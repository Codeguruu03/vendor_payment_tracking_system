import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    Min,
    IsString,
    IsIn,
    IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
    @ApiProperty({ description: 'Purchase Order ID', example: 1 })
    @IsInt({ message: 'PO ID must be a number' })
    @IsNotEmpty({ message: 'Purchase Order ID is required' })
    poId: number;

    @ApiProperty({ description: 'Payment amount', example: 5000, minimum: 0.01 })
    @IsNumber({}, { message: 'Amount must be a number' })
    @Min(0.01, { message: 'Payment amount must be greater than 0' })
    amount: number;

    @ApiProperty({
        description: 'Payment method',
        example: 'UPI',
        enum: ['CASH', 'CHEQUE', 'NEFT', 'RTGS', 'UPI'],
    })
    @IsString()
    @IsIn(['CASH', 'CHEQUE', 'NEFT', 'RTGS', 'UPI'], {
        message: 'Payment method must be one of: CASH, CHEQUE, NEFT, RTGS, or UPI',
    })
    method: 'CASH' | 'CHEQUE' | 'NEFT' | 'RTGS' | 'UPI';

    @ApiPropertyOptional({ description: 'Payment notes', example: 'First installment' })
    @IsString()
    @IsOptional()
    notes?: string;
}
