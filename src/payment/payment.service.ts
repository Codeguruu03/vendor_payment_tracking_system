import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto';
import { PaymentMethod, POStatus } from '@prisma/client';
import { generatePaymentReference } from '../common/utils/generate-identifiers';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) { }

  /**
   * Record a payment against a PO
   */
  async create(dto: CreatePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      // Find the PO with existing payments
      const po = await tx.purchaseOrder.findUnique({
        where: { id: dto.poId },
        include: { payments: true },
      });

      if (!po) {
        throw new NotFoundException(
          `Purchase Order with ID ${dto.poId} not found`,
        );
      }

      // Check if PO is in valid state for payment
      if (po.status === POStatus.DRAFT) {
        throw new BadRequestException(
          'Cannot record payment for a DRAFT PO. Approve the PO first.',
        );
      }

      if (po.status === POStatus.FULLY_PAID) {
        throw new BadRequestException(
          'PO is already fully paid. No more payments are allowed.',
        );
      }

      // Calculate total already paid
      const totalPaid = po.payments.reduce((sum, p) => sum + p.amountPaid, 0);
      const outstandingAmount = po.totalAmount - totalPaid;

      // Validate payment amount
      if (dto.amount > outstandingAmount) {
        throw new BadRequestException(
          `Payment amount (${dto.amount}) exceeds outstanding amount (${outstandingAmount}). Overpayment is not allowed.`,
        );
      }

      // Create the payment
      const payment = await tx.payment.create({
        data: {
          reference: generatePaymentReference(),
          purchaseOrderId: dto.poId,
          amountPaid: dto.amount,
          paymentDate: new Date(),
          method: dto.method as PaymentMethod,
          notes: dto.notes,
        },
      });

      // Calculate new total and update PO status
      const newTotalPaid = totalPaid + dto.amount;
      const newStatus =
        newTotalPaid >= po.totalAmount
          ? POStatus.FULLY_PAID
          : POStatus.PARTIALLY_PAID;

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
   * Get all payments
   */
  async findAll() {
    return this.prisma.payment.findMany({
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
    });
  }

  /**
   * Get payment by ID
   */
  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        purchaseOrder: {
          include: {
            vendor: { select: { id: true, name: true, email: true } },
            payments: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Calculate payment summary for the PO
    const poPayments = payment.purchaseOrder.payments;
    const totalPaid = poPayments.reduce((sum, p) => sum + p.amountPaid, 0);

    return {
      ...payment,
      purchaseOrder: {
        ...payment.purchaseOrder,
        payments: undefined, // Remove detailed payments
        paymentSummary: {
          totalPaid,
          outstandingAmount: payment.purchaseOrder.totalAmount - totalPaid,
          paymentCount: poPayments.length,
        },
      },
    };
  }
}
