import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { CreateVendorDto, UpdateVendorDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Vendors')
@ApiBearerAuth('JWT-auth')
@Controller('vendors')
export class VendorController {
  constructor(private readonly service: VendorService) { }

  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  @ApiResponse({ status: 409, description: 'Vendor name/email already exists' })
  @Post()
  create(@Body() dto: CreateVendorDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'List all vendors with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of vendors' })
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @ApiOperation({ summary: 'Get vendor details with payment summary' })
  @ApiResponse({ status: 200, description: 'Vendor details' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Update vendor information' })
  @ApiResponse({ status: 200, description: 'Vendor updated' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorDto,
  ) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Soft delete a vendor' })
  @ApiResponse({ status: 200, description: 'Vendor deleted' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
