import dayjs from 'dayjs';

/**
 * Generates a unique PO number in format: PO-YYYYMMDD-XXXXX
 * Uses timestamp + random for uniqueness (survives server restarts)
 */
export function generatePONumber(): string {
    const today = dayjs().format('YYYYMMDD');
    const timestamp = Date.now().toString().slice(-5); // Last 5 digits of timestamp
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `PO-${today}-${timestamp}${random}`;
}

/**
 * Generates a unique Payment reference in format: PAY-YYYYMMDD-XXXXX
 * Uses timestamp + random for uniqueness (survives server restarts)
 */
export function generatePaymentReference(): string {
    const today = dayjs().format('YYYYMMDD');
    const timestamp = Date.now().toString().slice(-5); // Last 5 digits of timestamp
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `PAY-${today}-${timestamp}${random}`;
}

/**
 * Calculates due date based on PO date and vendor payment terms
 * @param poDate - The purchase order date
 * @param paymentTerms - Number of days for payment (7, 15, 30, 45, 60)
 * @returns Due date
 */
export function calculateDueDate(poDate: Date, paymentTerms: number): Date {
    return dayjs(poDate).add(paymentTerms, 'day').toDate();
}

/**
 * Valid payment terms options
 */
export const VALID_PAYMENT_TERMS = [7, 15, 30, 45, 60];

/**
 * Validates that payment terms is one of the allowed values
 */
export function isValidPaymentTerms(terms: number): boolean {
    return VALID_PAYMENT_TERMS.includes(terms);
}
