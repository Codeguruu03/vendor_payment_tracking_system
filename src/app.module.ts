import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { VendorModule } from './vendor/vendor.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    PrismaModule,
    VendorModule,
    PurchaseOrderModule,
    PaymentModule,
  ],
})
export class AppModule {}
