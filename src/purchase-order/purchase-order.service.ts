import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseOrderService {
  constructor(private prisma: PrismaService) {}

  async create(vendorId: number, totalAmount: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor || vendor.status === 'INACTIVE') {
      throw new BadRequestException('Vendor inactive');
    }

    return this.prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${Date.now()}`,
        vendorId,
        totalAmount,
        dueDate: new Date(Date.now() + vendor.paymentTerms * 86400000),
        status: 'APPROVED',
      },
    });
  }
}
