import { IsString, IsIn } from 'class-validator';

export class UpdatePurchaseOrderStatusDto {
    @IsString()
    @IsIn(['DRAFT', 'APPROVED', 'PARTIALLY_PAID', 'FULLY_PAID'], {
        message:
            'Status must be one of: DRAFT, APPROVED, PARTIALLY_PAID, or FULLY_PAID',
    })
    status: 'DRAFT' | 'APPROVED' | 'PARTIALLY_PAID' | 'FULLY_PAID';
}
