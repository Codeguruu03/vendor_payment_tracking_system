import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    Min,
    IsString,
    IsIn,
    IsOptional,
} from 'class-validator';

export class CreatePaymentDto {
    @IsInt({ message: 'PO ID must be a number' })
    @IsNotEmpty({ message: 'Purchase Order ID is required' })
    poId: number;

    @IsNumber({}, { message: 'Amount must be a number' })
    @Min(0.01, { message: 'Payment amount must be greater than 0' })
    amount: number;

    @IsString()
    @IsIn(['CASH', 'CHEQUE', 'NEFT', 'RTGS', 'UPI'], {
        message: 'Payment method must be one of: CASH, CHEQUE, NEFT, RTGS, or UPI',
    })
    method: 'CASH' | 'CHEQUE' | 'NEFT' | 'RTGS' | 'UPI';

    @IsString()
    @IsOptional()
    notes?: string;
}
