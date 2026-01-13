import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto, UpdateVendorDto } from './dto';
import { VendorStatus } from '@prisma/client';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) { }

  /**
   * Create a new vendor
   */
  async create(dto: CreateVendorDto) {
    // Check for existing vendor with same name
    const existingByName = await this.prisma.vendor.findUnique({
      where: { name: dto.name },
    });
    if (existingByName) {
      throw new ConflictException(`Vendor with name "${dto.name}" already exists`);
    }

    // Check for existing vendor with same email
    const existingByEmail = await this.prisma.vendor.findUnique({
      where: { email: dto.email },
    });
    if (existingByEmail) {
      throw new ConflictException(`Vendor with email "${dto.email}" already exists`);
    }

    return this.prisma.vendor.create({
      data: {
        name: dto.name,
        contactPerson: dto.contactPerson,
        email: dto.email,
        phone: dto.phone,
        paymentTerms: dto.paymentTerms,
        status: dto.status as VendorStatus,
      },
    });
  }

  /**
   * Get all vendors (excluding soft deleted)
   */
  async findAll() {
    return this.prisma.vendor.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a vendor by ID with payment summary
   */
  async findOne(id: number) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, deletedAt: null },
      include: {
        purchaseOrders: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    // Calculate payment summary
    let totalPOs = 0;
    let totalAmount = 0;
    let totalPaid = 0;

    for (const po of vendor.purchaseOrders) {
      totalPOs++;
      totalAmount += po.totalAmount;
      for (const payment of po.payments) {
        totalPaid += payment.amountPaid;
      }
    }

    const outstandingAmount = totalAmount - totalPaid;

    return {
      ...vendor,
      purchaseOrders: undefined, // Remove detailed PO data
      paymentSummary: {
        totalPurchaseOrders: totalPOs,
        totalAmount,
        totalPaid,
        outstandingAmount,
      },
    };
  }

  /**
   * Update vendor by ID
   */
  async update(id: number, dto: UpdateVendorDto) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, deletedAt: null },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    // Check for name uniqueness if being updated
    if (dto.name && dto.name !== vendor.name) {
      const existingByName = await this.prisma.vendor.findUnique({
        where: { name: dto.name },
      });
      if (existingByName) {
        throw new ConflictException(`Vendor with name "${dto.name}" already exists`);
      }
    }

    // Check for email uniqueness if being updated
    if (dto.email && dto.email !== vendor.email) {
      const existingByEmail = await this.prisma.vendor.findUnique({
        where: { email: dto.email },
      });
      if (existingByEmail) {
        throw new ConflictException(`Vendor with email "${dto.email}" already exists`);
      }
    }

    return this.prisma.vendor.update({
      where: { id },
      data: {
        ...dto,
        status: dto.status as VendorStatus | undefined,
      },
    });
  }

  /**
   * Soft delete vendor by ID
   */
  async remove(id: number) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, deletedAt: null },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return this.prisma.vendor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
