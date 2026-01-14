import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    /**
     * GET /analytics/vendor-outstanding
     * Returns outstanding balance grouped by vendor
     */
    async getVendorOutstanding() {
        const vendors = await this.prisma.vendor.findMany({
            where: { deletedAt: null },
            include: {
                purchaseOrders: {
                    include: {
                        payments: { where: { deletedAt: null } },
                    },
                },
            },
        });

        const result = vendors.map((vendor) => {
            let totalPOAmount = 0;
            let totalPaid = 0;

            for (const po of vendor.purchaseOrders) {
                totalPOAmount += po.totalAmount;
                for (const payment of po.payments) {
                    totalPaid += payment.amountPaid;
                }
            }

            const outstandingAmount = totalPOAmount - totalPaid;

            return {
                vendorId: vendor.id,
                vendorName: vendor.name,
                contactPerson: vendor.contactPerson,
                totalPurchaseOrders: vendor.purchaseOrders.length,
                totalPOAmount,
                totalPaid,
                outstandingAmount,
                status: vendor.status,
            };
        });

        // Sort by outstanding amount descending
        result.sort((a, b) => b.outstandingAmount - a.outstandingAmount);

        // Summary
        const summary = {
            totalOutstanding: result.reduce((sum, v) => sum + v.outstandingAmount, 0),
            totalVendors: result.length,
            vendorsWithOutstanding: result.filter((v) => v.outstandingAmount > 0).length,
        };

        return { summary, vendors: result };
    }

    /**
     * GET /analytics/payment-aging
     * Returns aging report with buckets: 0-30, 31-60, 61-90, 90+ days
     */
    async getPaymentAging() {
        const today = dayjs();

        // Get all POs that are not fully paid
        const purchaseOrders = await this.prisma.purchaseOrder.findMany({
            where: {
                status: {
                    in: ['APPROVED', 'PARTIALLY_PAID'],
                },
            },
            include: {
                vendor: {
                    select: { id: true, name: true },
                },
                payments: { where: { deletedAt: null } },
            },
        });

        // Categorize into aging buckets based on due date
        const buckets = {
            current: [] as any[], // 0-30 days
            days31to60: [] as any[], // 31-60 days
            days61to90: [] as any[], // 61-90 days
            over90: [] as any[], // 90+ days
        };

        for (const po of purchaseOrders) {
            const totalPaid = po.payments.reduce((sum, p) => sum + p.amountPaid, 0);
            const outstanding = po.totalAmount - totalPaid;

            if (outstanding <= 0) continue;

            const dueDate = dayjs(po.dueDate);
            const daysOverdue = today.diff(dueDate, 'day');

            const poData = {
                poId: po.id,
                poNumber: po.poNumber,
                vendorId: po.vendor.id,
                vendorName: po.vendor.name,
                totalAmount: po.totalAmount,
                totalPaid,
                outstanding,
                dueDate: po.dueDate,
                daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
            };

            if (daysOverdue <= 0) {
                buckets.current.push(poData);
            } else if (daysOverdue <= 30) {
                buckets.current.push(poData);
            } else if (daysOverdue <= 60) {
                buckets.days31to60.push(poData);
            } else if (daysOverdue <= 90) {
                buckets.days61to90.push(poData);
            } else {
                buckets.over90.push(poData);
            }
        }

        // Calculate summary for each bucket
        const calculateBucketSummary = (bucket: any[]) => ({
            count: bucket.length,
            totalOutstanding: bucket.reduce((sum, po) => sum + po.outstanding, 0),
        });

        return {
            summary: {
                current: calculateBucketSummary(buckets.current),
                days31to60: calculateBucketSummary(buckets.days31to60),
                days61to90: calculateBucketSummary(buckets.days61to90),
                over90: calculateBucketSummary(buckets.over90),
                totalOutstanding:
                    calculateBucketSummary(buckets.current).totalOutstanding +
                    calculateBucketSummary(buckets.days31to60).totalOutstanding +
                    calculateBucketSummary(buckets.days61to90).totalOutstanding +
                    calculateBucketSummary(buckets.over90).totalOutstanding,
            },
            aging: {
                current: buckets.current,
                days31to60: buckets.days31to60,
                days61to90: buckets.days61to90,
                over90: buckets.over90,
            },
        };
    }

    /**
     * GET /analytics/payment-trends
     * Returns monthly payment trends for the last 6 months
     */
    async getPaymentTrends() {
        const today = dayjs();
        const sixMonthsAgo = today.subtract(6, 'month');

        // Get all payments from the last 6 months (excluding voided)
        const payments = await this.prisma.payment.findMany({
            where: {
                paymentDate: {
                    gte: sixMonthsAgo.toDate(),
                    lte: today.toDate(),
                },
                deletedAt: null,
            },
            include: {
                purchaseOrder: {
                    select: {
                        id: true,
                        poNumber: true,
                        vendorId: true,
                        vendor: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
        });

        // Group payments by month
        const monthlyData: { [key: string]: { count: number; totalAmount: number; payments: any[] } } = {};

        // Initialize 6 months of data
        for (let i = 5; i >= 0; i--) {
            const monthKey = today.subtract(i, 'month').format('YYYY-MM');
            monthlyData[monthKey] = { count: 0, totalAmount: 0, payments: [] };
        }

        // Aggregate payments by month
        for (const payment of payments) {
            const monthKey = dayjs(payment.paymentDate).format('YYYY-MM');
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].count++;
                monthlyData[monthKey].totalAmount += payment.amountPaid;
                monthlyData[monthKey].payments.push({
                    id: payment.id,
                    reference: payment.reference,
                    amount: payment.amountPaid,
                    method: payment.method,
                    poNumber: payment.purchaseOrder.poNumber,
                    vendorName: payment.purchaseOrder.vendor.name,
                    paymentDate: payment.paymentDate,
                });
            }
        }

        // Convert to array format
        const trends = Object.entries(monthlyData).map(([month, data]) => ({
            month,
            paymentCount: data.count,
            totalAmount: data.totalAmount,
            averagePayment: data.count > 0 ? data.totalAmount / data.count : 0,
            payments: data.payments,
        }));

        // Calculate summary
        const summary = {
            period: `${sixMonthsAgo.format('YYYY-MM-DD')} to ${today.format('YYYY-MM-DD')}`,
            totalPayments: payments.length,
            totalAmount: payments.reduce((sum, p) => sum + p.amountPaid, 0),
            averagePayment: payments.length > 0 ? payments.reduce((sum, p) => sum + p.amountPaid, 0) / payments.length : 0,
            highestMonth: trends.reduce((max, curr) => curr.totalAmount > max.totalAmount ? curr : max),
            lowestMonth: trends.filter(t => t.paymentCount > 0).reduce((min, curr) => curr.totalAmount < min.totalAmount ? curr : min, trends[0]),
        };

        return { summary, trends };
    }
}
