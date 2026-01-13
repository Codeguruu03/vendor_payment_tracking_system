import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { VendorModule } from './vendor/vendor.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    VendorModule,
    PurchaseOrderModule,
    PaymentModule,
    AnalyticsModule,
  ],
  providers: [
    // Enable JWT authentication globally for all endpoints
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
