import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private service: PaymentService) {}

  @Post()
  pay(@Body() body) {
    return this.service.pay(body.poId, body.amount);
  }
}
