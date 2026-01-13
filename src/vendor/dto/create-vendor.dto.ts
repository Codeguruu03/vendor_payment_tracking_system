import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsIn,
    IsInt,
    IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorDto {
    @ApiProperty({ description: 'Vendor name (unique)', example: 'Acme Corporation' })
    @IsString()
    @IsNotEmpty({ message: 'Vendor name is required' })
    name: string;

    @ApiProperty({ description: 'Contact person name', example: 'John Smith' })
    @IsString()
    @IsNotEmpty({ message: 'Contact person is required' })
    contactPerson: string;

    @ApiProperty({ description: 'Email address (unique)', example: 'john@acme.com' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({ description: 'Phone number', example: '9876543210' })
    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    phone: string;

    @ApiProperty({
        description: 'Payment terms in days',
        example: 30,
        enum: [7, 15, 30, 45, 60],
    })
    @IsInt({ message: 'Payment terms must be a number' })
    @IsIn([7, 15, 30, 45, 60], {
        message: 'Payment terms must be one of: 7, 15, 30, 45, or 60 days',
    })
    paymentTerms: number;

    @ApiProperty({
        description: 'Vendor status',
        example: 'ACTIVE',
        enum: ['ACTIVE', 'INACTIVE'],
    })
    @IsString()
    @IsIn(['ACTIVE', 'INACTIVE'], {
        message: 'Status must be either ACTIVE or INACTIVE',
    })
    status: 'ACTIVE' | 'INACTIVE';
}
