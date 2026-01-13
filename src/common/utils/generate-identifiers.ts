import dayjs from 'dayjs';

// Counter storage for unique sequential IDs within the same day
const counters: Map<string, number> = new Map();

/**
 * Generates a PO number in format: PO-YYYYMMDD-XXX
 * Example: PO-20260113-001
 */
export function generatePONumber(): string {
    const today = dayjs().format('YYYYMMDD');
    const key = `PO-${today}`;

    const currentCount = counters.get(key) || 0;
    const newCount = currentCount + 1;
    counters.set(key, newCount);

    const sequentialNumber = String(newCount).padStart(3, '0');
    return `${key}-${sequentialNumber}`;
}

/**
 * Generates a Payment reference in format: PAY-YYYYMMDD-XXX
 * Example: PAY-20260113-001
 */
export function generatePaymentReference(): string {
    const today = dayjs().format('YYYYMMDD');
    const key = `PAY-${today}`;

    const currentCount = counters.get(key) || 0;
    const newCount = currentCount + 1;
    counters.set(key, newCount);

    const sequentialNumber = String(newCount).padStart(3, '0');
    return `${key}-${sequentialNumber}`;
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
