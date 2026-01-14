import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto';
import { generatePaymentReference } from '../common/utils/generate-identifiers';
import { PaginationDto, createPaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) { }

  /**
   * Record a payment against a PO
   */
  async create(dto: CreatePaymentDto, username?: string) {
    return this.prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUnique({
        where: { id: dto.poId },
        include: { payments: { where: { deletedAt: null } } },
      });

      if (!po) {
        throw new NotFoundException(
          `Purchase Order with ID ${dto.poId} not found`,
        );
      }

      if (po.status === 'DRAFT') {
        throw new BadRequestException(
          'Cannot record payment for a DRAFT PO. Approve the PO first.',
        );
      }

      if (po.status === 'FULLY_PAID') {
        throw new BadRequestException(
          'PO is already fully paid. No more payments are allowed.',
        );
      }

      const totalPaid = po.payments.reduce((sum, p) => sum + p.amountPaid, 0);
      const outstandingAmount = po.totalAmount - totalPaid;

      if (dto.amount > outstandingAmount) {
        throw new BadRequestException(
          `Payment amount (${dto.amount}) exceeds outstanding amount (${outstandingAmount}). Overpayment is not allowed.`,
        );
      }

      const payment = await tx.payment.create({
        data: {
          reference: generatePaymentReference(),
          purchaseOrderId: dto.poId,
          amountPaid: dto.amount,
          paymentDate: new Date(),
          method: dto.method,
          notes: dto.notes,
          createdBy: username,
        },
      });

      const newTotalPaid = totalPaid + dto.amount;
      const newStatus =
        newTotalPaid >= po.totalAmount
          ? 'FULLY_PAID'
          : 'PARTIALLY_PAID';

      await tx.purchaseOrder.update({
        where: { id: dto.poId },
        data: { status: newStatus },
      });

      return {
        payment,
        poStatus: newStatus,
        summary: {
          poTotalAmount: po.totalAmount,
          previouslyPaid: totalPaid,
          currentPayment: dto.amount,
          totalPaid: newTotalPaid,
          outstandingAmount: po.totalAmount - newTotalPaid,
        },
      };
    });
  }

  /**
   * Get all payments with pagination (excluding soft deleted)
   */
  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const where = { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          purchaseOrder: {
            select: {
              id: true,
              poNumber: true,
              totalAmount: true,
              vendor: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { paymentDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  }

  /**
   * Get payment by ID (excluding soft deleted)
   */
  async findOne(id: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, deletedAt: null },
      include: {
        purchaseOrder: {
          include: {
            vendor: { select: { id: true, name: true, email: true } },
            payments: { where: { deletedAt: null } },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    const poPayments = payment.purchaseOrder.payments;
    const totalPaid = poPayments.reduce((sum, p) => sum + p.amountPaid, 0);

    return {
      ...payment,
      purchaseOrder: {
        ...payment.purchaseOrder,
        payments: undefined,
        paymentSummary: {
          totalPaid,
          outstandingAmount: payment.purchaseOrder.totalAmount - totalPaid,
          paymentCount: poPayments.length,
        },
      },
    };
  }

  /**
   * Soft delete (void) a payment and recalculate PO status
   */
  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { id, deletedAt: null },
        include: {
          purchaseOrder: {
            include: {
              payments: { where: { deletedAt: null } },
            },
          },
        },
      });

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      // Soft delete the payment
      const voidedPayment = await tx.payment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      // Recalculate total paid for the PO (excluding this voided payment)
      const remainingPayments = payment.purchaseOrder.payments.filter(
        (p) => p.id !== id,
      );
      const totalPaid = remainingPayments.reduce((sum, p) => sum + p.amountPaid, 0);
      const poTotal = payment.purchaseOrder.totalAmount;

      // Determine new status
      let newStatus: POStatus = POStatus.APPROVED;
      if (totalPaid > 0 && totalPaid < poTotal) {
        newStatus = POStatus.PARTIALLY_PAID;
      } else if (totalPaid >= poTotal) {
        newStatus = POStatus.FULLY_PAID;
      }

      // Update PO status
      const updatedPO = await tx.purchaseOrder.update({
        where: { id: payment.purchaseOrderId },
        data: { status: newStatus },
      });

      return {
        voidedPayment,
        poStatus: newStatus,
        summary: {
          poTotalAmount: poTotal,
          totalPaid,
          outstandingAmount: poTotal - totalPaid,
          paymentCount: remainingPayments.length,
        },
      };
    });
  }
}
