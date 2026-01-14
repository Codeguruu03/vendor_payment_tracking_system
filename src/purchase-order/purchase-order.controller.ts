import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PurchaseOrderService } from './purchase-order.service';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderStatusDto,
  PurchaseOrderFilterDto,
} from './dto';

@ApiTags('Purchase Orders')
@ApiBearerAuth('JWT-auth')
@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly service: PurchaseOrderService) { }

  @ApiOperation({ summary: 'Create a new Purchase Order' })
  @ApiResponse({ status: 201, description: 'PO created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or inactive vendor' })
  @Post()
  create(@Body() dto: CreatePurchaseOrderDto, @Request() req: any) {
    return this.service.create(dto, req.user?.username);
  }

  @ApiOperation({ summary: 'List Purchase Orders with filtering & pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of POs' })
  @Get()
  findAll(@Query() filter: PurchaseOrderFilterDto) {
    return this.service.findAll(filter);
  }

  @ApiOperation({ summary: 'Get PO details with payment history' })
  @ApiResponse({ status: 200, description: 'PO details' })
  @ApiResponse({ status: 404, description: 'PO not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Update PO status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'PO not found' })
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePurchaseOrderStatusDto,
    @Request() req: any,
  ) {
    return this.service.updateStatus(id, dto, req.user?.username);
  }
}
