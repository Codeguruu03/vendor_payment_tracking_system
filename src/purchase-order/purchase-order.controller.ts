import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderStatusDto } from './dto';

@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly service: PurchaseOrderService) { }

  /**
   * POST /purchase-orders - Create a new PO
   */
  @Post()
  create(@Body() dto: CreatePurchaseOrderDto) {
    return this.service.create(dto);
  }

  /**
   * GET /purchase-orders - List all POs with optional filtering
   */
  @Get()
  findAll(
    @Query('vendorId') vendorId?: number,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(vendorId, status);
  }

  /**
   * GET /purchase-orders/:id - Get PO details with payment history
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  /**
   * PATCH /purchase-orders/:id/status - Update PO status
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePurchaseOrderStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }
}
