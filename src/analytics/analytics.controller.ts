import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-auth')
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly service: AnalyticsService) { }

    @ApiOperation({ summary: 'Get outstanding balance grouped by vendor' })
    @ApiResponse({ status: 200, description: 'Vendor outstanding report' })
    @Get('vendor-outstanding')
    getVendorOutstanding() {
        return this.service.getVendorOutstanding();
    }

    @ApiOperation({ summary: 'Get payment aging report (0-30, 31-60, 61-90, 90+ days)' })
    @ApiResponse({ status: 200, description: 'Payment aging report' })
    @Get('payment-aging')
    getPaymentAging() {
        return this.service.getPaymentAging();
    }
}
