import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderStatusDto,
  PurchaseOrderFilterDto,
} from './dto';
import {
  generatePONumber,
  calculateDueDate,
} from '../common/utils/generate-identifiers';
import { createPaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class PurchaseOrderService {
  constructor(private prisma: PrismaService) { }

  /**
   * Create a new Purchase Order
   */
  async create(dto: CreatePurchaseOrderDto, username?: string) {
    // Validate vendor exists and is active
    const vendor = await this.prisma.vendor.findFirst({
      where: { id: dto.vendorId, deletedAt: null },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${dto.vendorId} not found`);
    }

    if (vendor.status === 'INACTIVE') {
      throw new BadRequestException(
        'Cannot create PO for inactive vendor. Activate the vendor first.',
      );
    }

    // Calculate total amount from line items
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    // Calculate due date based on vendor payment terms
    const poDate = new Date();
    const dueDate = calculateDueDate(poDate, vendor.paymentTerms);

    // Generate unique PO number
    const poNumber = generatePONumber();

    return this.prisma.purchaseOrder.create({
      data: {
        poNumber,
        vendorId: dto.vendorId,
        poDate,
        totalAmount,
        dueDate,
        status: 'APPROVED',
        createdBy: username,
        updatedBy: username,
        items: {
          create: dto.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
        vendor: {
          select: { id: true, name: true, contactPerson: true },
        },
      },
    });
  }

  /**
   * Get all POs with filtering and pagination
   */
  async findAll(filter: PurchaseOrderFilterDto) {
    const { page = 1, limit = 10, vendorId, status, dateFrom, dateTo, amountMin, amountMax } = filter;

    const where: any = {};

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (status) {
      where.status = status;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.poDate = {};
      if (dateFrom) {
        where.poDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.poDate.lte = new Date(dateTo);
      }
    }

    // Amount range filter
    if (amountMin !== undefined || amountMax !== undefined) {
      where.totalAmount = {};
      if (amountMin !== undefined) {
        where.totalAmount.gte = amountMin;
      }
      if (amountMax !== undefined) {
        where.totalAmount.lte = amountMax;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        include: {
          vendor: {
            select: { id: true, name: true, contactPerson: true },
          },
          items: true,
          _count: { select: { payments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  }

  /**
   * Get PO by ID with payment history
   */
  async findOne(id: number) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        vendor: {
          select: { id: true, name: true, contactPerson: true, email: true },
        },
        items: true,
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    // Calculate payment summary
    const totalPaid = po.payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const outstandingAmount = po.totalAmount - totalPaid;

    return {
      ...po,
      paymentSummary: {
        totalPaid,
        outstandingAmount,
        paymentCount: po.payments.length,
      },
    };
  }

  /**
   * Update PO status
   */
  async updateStatus(id: number, dto: UpdatePurchaseOrderStatusDto, username?: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { 
        status: dto.status,
        updatedBy: username,
      },
      include: {
        vendor: { select: { id: true, name: true } },
      },
    });
  }
}
