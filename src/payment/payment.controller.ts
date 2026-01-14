import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) { }

  @ApiOperation({ summary: 'Record a payment against a Purchase Order' })
  @ApiResponse({ status: 201, description: 'Payment recorded successfully' })
  @ApiResponse({ status: 400, description: 'Overpayment or invalid PO status' })
  @ApiResponse({ status: 404, description: 'PO not found' })
  @Post()
  create(@Body() dto: CreatePaymentDto, @Request() req: any) {
    return this.service.create(dto, req.user?.username);
  }

  @ApiOperation({ summary: 'List all payments with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of payments' })
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Void (soft delete) a payment and recalculate PO status' })
  @ApiResponse({ status: 200, description: 'Payment voided successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
