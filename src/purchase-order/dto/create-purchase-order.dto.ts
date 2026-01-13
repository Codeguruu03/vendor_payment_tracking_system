import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    ArrayMinSize,
    IsString,
    IsNumber,
    Min,
    IsOptional,
    IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class LineItemDto {
    @ApiProperty({ description: 'Item description', example: 'Steel Rods 10mm' })
    @IsString()
    @IsNotEmpty({ message: 'Item description is required' })
    description: string;

    @ApiProperty({ description: 'Quantity', example: 100, minimum: 1 })
    @IsInt({ message: 'Quantity must be a whole number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;

    @ApiProperty({ description: 'Unit price', example: 50.00, minimum: 0.01 })
    @IsNumber({}, { message: 'Unit price must be a number' })
    @Min(0.01, { message: 'Unit price must be greater than 0' })
    unitPrice: number;
}

export class CreatePurchaseOrderDto {
    @ApiProperty({ description: 'Vendor ID', example: 1 })
    @IsInt({ message: 'Vendor ID must be a number' })
    @IsNotEmpty({ message: 'Vendor ID is required' })
    vendorId: number;

    @ApiProperty({
        description: 'Line items',
        type: [LineItemDto],
        example: [{ description: 'Steel Rods', quantity: 100, unitPrice: 50 }],
    })
    @IsArray({ message: 'Items must be an array' })
    @ValidateNested({ each: true })
    @ArrayMinSize(1, { message: 'At least one line item is required' })
    @Type(() => LineItemDto)
    items: LineItemDto[];
}

export class PurchaseOrderFilterDto extends PaginationDto {
    @ApiPropertyOptional({ description: 'Filter by vendor ID', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    vendorId?: number;

    @ApiPropertyOptional({
        description: 'Filter by status',
        example: 'APPROVED',
        enum: ['DRAFT', 'APPROVED', 'PARTIALLY_PAID', 'FULLY_PAID'],
    })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({
        description: 'Filter by PO date from (YYYY-MM-DD)',
        example: '2026-01-01',
    })
    @IsOptional()
    @IsDateString()
    dateFrom?: string;

    @ApiPropertyOptional({
        description: 'Filter by PO date to (YYYY-MM-DD)',
        example: '2026-12-31',
    })
    @IsOptional()
    @IsDateString()
    dateTo?: string;

    @ApiPropertyOptional({ description: 'Min total amount', example: 1000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    amountMin?: number;

    @ApiPropertyOptional({ description: 'Max total amount', example: 100000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    amountMax?: number;
}
