import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async pay(poId: number, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUnique({
        where: { id: poId },
        include: { payments: true },
      });

      if (!po) throw new BadRequestException('PO not found');

      const totalPaid = po.payments.reduce(
        (sum, p) => sum + p.amountPaid,
        0,
      );

      if (amount > po.totalAmount - totalPaid) {
        throw new BadRequestException('Overpayment not allowed');
      }

      await tx.payment.create({
        data: {
          reference: `PAY-${Date.now()}`,
          purchaseOrderId: poId,
          amountPaid: amount,
          paymentDate: new Date(),
          method: 'UPI',
        },
      });

      const newTotal = totalPaid + amount;

      await tx.purchaseOrder.update({
        where: { id: poId },
        data: {
          status:
            newTotal === po.totalAmount
              ? 'FULLY_PAID'
              : 'PARTIALLY_PAID',
        },
      });

      return { status: 'OK' };
    });
  }
}
