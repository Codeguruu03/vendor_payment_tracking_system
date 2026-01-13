import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      message: 'Vendor Payment Tracking API is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: 'POST /auth/login',
        vendors: '/vendors',
        purchaseOrders: '/purchase-orders',
        payments: '/payments',
        analytics: '/analytics',
      },
    };
  }
}
