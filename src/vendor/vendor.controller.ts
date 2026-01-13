import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto, UpdateVendorDto } from './dto';

@Controller('vendors')
export class VendorController {
  constructor(private readonly service: VendorService) { }

  /**
   * POST /vendors - Create a new vendor
   */
  @Post()
  create(@Body() dto: CreateVendorDto) {
    return this.service.create(dto);
  }

  /**
   * GET /vendors - List all vendors
   */
  @Get()
  findAll() {
    return this.service.findAll();
  }

  /**
   * GET /vendors/:id - Get vendor details with payment summary
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  /**
   * PUT /vendors/:id - Update vendor information
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorDto,
  ) {
    return this.service.update(id, dto);
  }

  /**
   * DELETE /vendors/:id - Soft delete a vendor
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
