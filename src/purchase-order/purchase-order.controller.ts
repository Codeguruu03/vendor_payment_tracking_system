import { Controller, Post, Body } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';

@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private service: PurchaseOrderService) {}

  @Post()
  create(@Body() body) {
    return this.service.create(body.vendorId, body.totalAmount);
  }
}
