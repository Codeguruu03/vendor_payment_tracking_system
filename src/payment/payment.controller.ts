import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) { }

  /**
   * POST /payments - Record a payment against a PO
   */
  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }

  /**
   * GET /payments - List all payments
   */
  @Get()
  findAll() {
    return this.service.findAll();
  }

  /**
   * GET /payments/:id - Get payment details
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
