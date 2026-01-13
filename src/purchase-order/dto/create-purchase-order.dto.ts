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
} from 'class-validator';

export class LineItemDto {
    @IsString()
    @IsNotEmpty({ message: 'Item description is required' })
    description: string;

    @IsInt({ message: 'Quantity must be a whole number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;

    @IsNumber({}, { message: 'Unit price must be a number' })
    @Min(0.01, { message: 'Unit price must be greater than 0' })
    unitPrice: number;
}

export class CreatePurchaseOrderDto {
    @IsInt({ message: 'Vendor ID must be a number' })
    @IsNotEmpty({ message: 'Vendor ID is required' })
    vendorId: number;

    @IsArray({ message: 'Items must be an array' })
    @ValidateNested({ each: true })
    @ArrayMinSize(1, { message: 'At least one line item is required' })
    @Type(() => LineItemDto)
    items: LineItemDto[];
}
