import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly service: AnalyticsService) { }

    /**
     * GET /analytics/vendor-outstanding
     * Outstanding balance grouped by vendor
     */
    @Get('vendor-outstanding')
    getVendorOutstanding() {
        return this.service.getVendorOutstanding();
    }

    /**
     * GET /analytics/payment-aging
     * Aging report (0-30, 31-60, 61-90, 90+ days)
     */
    @Get('payment-aging')
    getPaymentAging() {
        return this.service.getPaymentAging();
    }
}
