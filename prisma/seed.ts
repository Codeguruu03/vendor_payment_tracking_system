import { PrismaClient, VendorStatus, POStatus, PaymentMethod } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data (in reverse order of dependencies)
    await prisma.payment.deleteMany();
    await prisma.lineItem.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    await prisma.vendor.deleteMany();

    console.log('✅ Cleared existing data');

    // Create 5 Vendors
    const vendors = await Promise.all([
        prisma.vendor.create({
            data: {
                name: 'Acme Corporation',
                contactPerson: 'John Smith',
                email: 'john@acme.com',
                phone: '9876543210',
                paymentTerms: 30,
                status: VendorStatus.ACTIVE,
            },
        }),
        prisma.vendor.create({
            data: {
                name: 'Global Supplies Ltd',
                contactPerson: 'Jane Doe',
                email: 'jane@globalsupplies.com',
                phone: '9876543211',
                paymentTerms: 45,
                status: VendorStatus.ACTIVE,
            },
        }),
        prisma.vendor.create({
            data: {
                name: 'Tech Parts India',
                contactPerson: 'Raj Kumar',
                email: 'raj@techparts.in',
                phone: '9876543212',
                paymentTerms: 15,
                status: VendorStatus.ACTIVE,
            },
        }),
        prisma.vendor.create({
            data: {
                name: 'Metro Electronics',
                contactPerson: 'Priya Sharma',
                email: 'priya@metroelectronics.com',
                phone: '9876543213',
                paymentTerms: 60,
                status: VendorStatus.ACTIVE,
            },
        }),
        prisma.vendor.create({
            data: {
                name: 'Sunset Traders',
                contactPerson: 'Mike Wilson',
                email: 'mike@sunsettraders.com',
                phone: '9876543214',
                paymentTerms: 7,
                status: VendorStatus.INACTIVE,
            },
        }),
    ]);

    console.log(`✅ Created ${vendors.length} vendors`);

    // Create 15 Purchase Orders with Line Items
    const today = dayjs();
    const purchaseOrders = [];

    // PO 1-3 for Vendor 1 (Acme)
    purchaseOrders.push(
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(60, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[0].id,
                poDate: today.subtract(60, 'day').toDate(),
                totalAmount: 15000,
                dueDate: today.subtract(30, 'day').toDate(),
                status: POStatus.FULLY_PAID,
                items: {
                    create: [
                        { description: 'Steel Rods - 10mm', quantity: 100, unitPrice: 100 },
                        { description: 'Steel Plates', quantity: 50, unitPrice: 100 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(30, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[0].id,
                poDate: today.subtract(30, 'day').toDate(),
                totalAmount: 25000,
                dueDate: today.toDate(),
                status: POStatus.PARTIALLY_PAID,
                items: {
                    create: [
                        { description: 'Industrial Pipes', quantity: 200, unitPrice: 75 },
                        { description: 'Pipe Fittings', quantity: 100, unitPrice: 100 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.format('YYYYMMDD')}-001`,
                vendorId: vendors[0].id,
                poDate: today.toDate(),
                totalAmount: 10000,
                dueDate: today.add(30, 'day').toDate(),
                status: POStatus.APPROVED,
                items: {
                    create: [
                        { description: 'Bolts & Nuts Set', quantity: 500, unitPrice: 20 },
                    ],
                },
            },
        }),
    );

    // PO 4-6 for Vendor 2 (Global Supplies)
    purchaseOrders.push(
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(90, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[1].id,
                poDate: today.subtract(90, 'day').toDate(),
                totalAmount: 50000,
                dueDate: today.subtract(45, 'day').toDate(),
                status: POStatus.FULLY_PAID,
                items: {
                    create: [
                        { description: 'Office Chairs', quantity: 50, unitPrice: 800 },
                        { description: 'Desks', quantity: 20, unitPrice: 500 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(45, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[1].id,
                poDate: today.subtract(45, 'day').toDate(),
                totalAmount: 35000,
                dueDate: today.toDate(),
                status: POStatus.APPROVED,
                items: {
                    create: [
                        { description: 'Printer Paper (Reams)', quantity: 500, unitPrice: 50 },
                        { description: 'Ink Cartridges', quantity: 100, unitPrice: 100 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(10, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[1].id,
                poDate: today.subtract(10, 'day').toDate(),
                totalAmount: 20000,
                dueDate: today.add(35, 'day').toDate(),
                status: POStatus.DRAFT,
                items: {
                    create: [
                        { description: 'Filing Cabinets', quantity: 10, unitPrice: 2000 },
                    ],
                },
            },
        }),
    );

    // PO 7-9 for Vendor 3 (Tech Parts India)
    purchaseOrders.push(
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(20, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[2].id,
                poDate: today.subtract(20, 'day').toDate(),
                totalAmount: 75000,
                dueDate: today.subtract(5, 'day').toDate(),
                status: POStatus.PARTIALLY_PAID,
                items: {
                    create: [
                        { description: 'Laptop - Dell Inspiron', quantity: 5, unitPrice: 12000 },
                        { description: 'RAM Modules 16GB', quantity: 10, unitPrice: 1500 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(5, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[2].id,
                poDate: today.subtract(5, 'day').toDate(),
                totalAmount: 30000,
                dueDate: today.add(10, 'day').toDate(),
                status: POStatus.APPROVED,
                items: {
                    create: [
                        { description: 'SSD 512GB', quantity: 20, unitPrice: 1500 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.format('YYYYMMDD')}-002`,
                vendorId: vendors[2].id,
                poDate: today.toDate(),
                totalAmount: 45000,
                dueDate: today.add(15, 'day').toDate(),
                status: POStatus.DRAFT,
                items: {
                    create: [
                        { description: 'Monitor 27inch', quantity: 10, unitPrice: 3500 },
                        { description: 'Keyboard + Mouse Combo', quantity: 20, unitPrice: 500 },
                    ],
                },
            },
        }),
    );

    // PO 10-12 for Vendor 4 (Metro Electronics)
    purchaseOrders.push(
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(120, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[3].id,
                poDate: today.subtract(120, 'day').toDate(),
                totalAmount: 100000,
                dueDate: today.subtract(60, 'day').toDate(),
                status: POStatus.PARTIALLY_PAID,
                items: {
                    create: [
                        { description: 'Industrial AC Units', quantity: 5, unitPrice: 15000 },
                        { description: 'Installation Service', quantity: 5, unitPrice: 5000 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(50, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[3].id,
                poDate: today.subtract(50, 'day').toDate(),
                totalAmount: 60000,
                dueDate: today.add(10, 'day').toDate(),
                status: POStatus.APPROVED,
                items: {
                    create: [
                        { description: 'UPS 5KVA', quantity: 6, unitPrice: 10000 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.format('YYYYMMDD')}-003`,
                vendorId: vendors[3].id,
                poDate: today.toDate(),
                totalAmount: 80000,
                dueDate: today.add(60, 'day').toDate(),
                status: POStatus.DRAFT,
                items: {
                    create: [
                        { description: 'Server Rack', quantity: 2, unitPrice: 25000 },
                        { description: 'Network Switch', quantity: 4, unitPrice: 7500 },
                    ],
                },
            },
        }),
    );

    // PO 13-15 for Vendor 5 (Sunset Traders - INACTIVE)
    purchaseOrders.push(
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(180, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[4].id,
                poDate: today.subtract(180, 'day').toDate(),
                totalAmount: 40000,
                dueDate: today.subtract(173, 'day').toDate(),
                status: POStatus.FULLY_PAID,
                items: {
                    create: [
                        { description: 'Office Supplies Kit', quantity: 100, unitPrice: 400 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(150, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[4].id,
                poDate: today.subtract(150, 'day').toDate(),
                totalAmount: 25000,
                dueDate: today.subtract(143, 'day').toDate(),
                status: POStatus.FULLY_PAID,
                items: {
                    create: [
                        { description: 'Stationery Bundle', quantity: 250, unitPrice: 100 },
                    ],
                },
            },
        }),
        await prisma.purchaseOrder.create({
            data: {
                poNumber: `PO-${today.subtract(100, 'day').format('YYYYMMDD')}-001`,
                vendorId: vendors[4].id,
                poDate: today.subtract(100, 'day').toDate(),
                totalAmount: 15000,
                dueDate: today.subtract(93, 'day').toDate(),
                status: POStatus.APPROVED, // Old unpaid PO from inactive vendor
                items: {
                    create: [
                        { description: 'Cleaning Supplies', quantity: 50, unitPrice: 300 },
                    ],
                },
            },
        }),
    );

    console.log(`✅ Created 15 purchase orders`);

    // Create 10 Payments
    const payments = await Promise.all([
        // Payment for PO 1 (Acme - Fully Paid)
        prisma.payment.create({
            data: {
                reference: `PAY-${today.subtract(55, 'day').format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[0].id,
                amountPaid: 15000,
                paymentDate: today.subtract(55, 'day').toDate(),
                method: PaymentMethod.NEFT,
                notes: 'Full payment for steel order',
            },
        }),

        // Payments for PO 2 (Acme - Partially Paid)
        prisma.payment.create({
            data: {
                reference: `PAY-${today.subtract(15, 'day').format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[1].id,
                amountPaid: 10000,
                paymentDate: today.subtract(15, 'day').toDate(),
                method: PaymentMethod.UPI,
                notes: 'Advance payment',
            },
        }),
        prisma.payment.create({
            data: {
                reference: `PAY-${today.subtract(5, 'day').format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[1].id,
                amountPaid: 5000,
                paymentDate: today.subtract(5, 'day').toDate(),
                method: PaymentMethod.UPI,
                notes: 'Second installment',
            },
        }),

        // Payment for PO 4 (Global Supplies - Fully Paid)
        prisma.payment.create({
            data: {
                reference: `PAY-${today.subtract(50, 'day').format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[3].id,
                amountPaid: 50000,
                paymentDate: today.subtract(50, 'day').toDate(),
                method: PaymentMethod.RTGS,
                notes: 'Full payment for office furniture',
            },
        }),

        // Payments for PO 7 (Tech Parts - Partially Paid)
        prisma.payment.create({
            data: {
                reference: `PAY-${today.subtract(10, 'day').format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[6].id,
                amountPaid: 30000,
                paymentDate: today.subtract(10, 'day').toDate(),
                method: PaymentMethod.NEFT,
                notes: '40% advance for laptops',
            },
        }),
        prisma.payment.create({
            data: {
                reference: `PAY-${today.subtract(3, 'day').format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[6].id,
                amountPaid: 20000,
                paymentDate: today.subtract(3, 'day').toDate(),
                method: PaymentMethod.UPI,
                notes: 'Partial payment continuation',
            },
        }),

        // Payment for PO 10 (Metro - Partially Paid, overdue)
        prisma.payment.create({
            data: {
                reference: `PAY-${today.subtract(80, 'day').format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[9].id,
                amountPaid: 50000,
                paymentDate: today.subtract(80, 'day').toDate(),
                method: PaymentMethod.CHEQUE,
                notes: '50% payment on delivery',
            },
        }),

        // Payments for PO 13, 14 (Sunset Traders - Fully Paid)
        prisma.payment.create({
            data: {
                reference: `PAY-${today.subtract(170, 'day').format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[12].id,
                amountPaid: 40000,
                paymentDate: today.subtract(170, 'day').toDate(),
                method: PaymentMethod.CASH,
                notes: 'Full payment on delivery',
            },
        }),
        prisma.payment.create({
            data: {
                reference: `PAY-${today.subtract(145, 'day').format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[13].id,
                amountPaid: 25000,
                paymentDate: today.subtract(145, 'day').toDate(),
                method: PaymentMethod.UPI,
                notes: 'Full payment for stationery',
            },
        }),

        // Recent payment
        prisma.payment.create({
            data: {
                reference: `PAY-${today.format('YYYYMMDD')}-001`,
                purchaseOrderId: purchaseOrders[1].id,
                amountPaid: 5000,
                paymentDate: today.toDate(),
                method: PaymentMethod.UPI,
                notes: 'Third installment',
            },
        }),
    ]);

    console.log(`✅ Created ${payments.length} payments`);

    console.log('\n📊 Seed Summary:');
    console.log(`   • Vendors: ${vendors.length}`);
    console.log(`   • Purchase Orders: 15`);
    console.log(`   • Payments: ${payments.length}`);
    console.log('\n✨ Database seeding completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seed error:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
