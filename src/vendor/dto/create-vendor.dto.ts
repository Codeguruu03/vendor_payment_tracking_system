import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsIn,
    IsInt,
    Min,
    Max,
    IsOptional,
} from 'class-validator';

export class CreateVendorDto {
    @IsString()
    @IsNotEmpty({ message: 'Vendor name is required' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Contact person is required' })
    contactPerson: string;

    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    phone: string;

    @IsInt({ message: 'Payment terms must be a number' })
    @IsIn([7, 15, 30, 45, 60], {
        message: 'Payment terms must be one of: 7, 15, 30, 45, or 60 days',
    })
    paymentTerms: number;

    @IsString()
    @IsIn(['ACTIVE', 'INACTIVE'], {
        message: 'Status must be either ACTIVE or INACTIVE',
    })
    status: 'ACTIVE' | 'INACTIVE';
}
