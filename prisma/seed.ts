import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with sample data...');

  // Clear existing data in dependency order
  await prisma.payment.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.vendor.deleteMany();

  // Create 5 vendors
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: 'Acme Corporation',
        contactPerson: 'John Smith',
        email: 'john@acme.com',
        phone: '9876543210',
        paymentTerms: 30,
        status: 'ACTIVE',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Global Supplies Ltd',
        contactPerson: 'Jane Doe',
        email: 'jane@globalsupplies.com',
        phone: '9876543211',
        paymentTerms: 45,
        status: 'ACTIVE',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Tech Parts India',
        contactPerson: 'Raj Kumar',
        email: 'raj@techparts.in',
        phone: '9876543212',
        paymentTerms: 15,
        status: 'ACTIVE',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Expert Services',
        contactPerson: 'Alice Johnson',
        email: 'alice@expert.com',
        phone: '9876543213',
        paymentTerms: 60,
        status: 'ACTIVE',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Quality Traders',
        contactPerson: 'Bob Wilson',
        email: 'bob@quality.com',
        phone: '9876543214',
        paymentTerms: 20,
        status: 'ACTIVE',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    }),
  ]);

  console.log(`✅ Created ${vendors.length} vendors`);

  // Create 10 purchase orders with line items
  const now = new Date();
  const purchaseOrders = await Promise.all([
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0001`,
        vendorId: vendors[0].id,
        poDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        totalAmount: 50000,
        dueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [
            { description: 'Office Supplies', quantity: 100, unitPrice: 250 },
            { description: 'Stationery', quantity: 100, unitPrice: 250 },
          ],
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0002`,
        vendorId: vendors[1].id,
        poDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        totalAmount: 75000,
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [{ description: 'Consulting Services', quantity: 1, unitPrice: 75000 }],
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0003`,
        vendorId: vendors[2].id,
        poDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        totalAmount: 40000,
        dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        status: 'DRAFT',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [{ description: 'Computer Parts', quantity: 200, unitPrice: 200 }],
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0004`,
        vendorId: vendors[3].id,
        poDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        totalAmount: 100000,
        dueDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [{ description: 'Software License', quantity: 100, unitPrice: 1000 }],
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0005`,
        vendorId: vendors[4].id,
        poDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        totalAmount: 60000,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'DRAFT',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [{ description: 'Raw Materials', quantity: 300, unitPrice: 200 }],
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0006`,
        vendorId: vendors[0].id,
        poDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        totalAmount: 30000,
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        status: 'PARTIALLY_PAID',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [{ description: 'Office Equipment', quantity: 30, unitPrice: 1000 }],
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0007`,
        vendorId: vendors[1].id,
        poDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        totalAmount: 45000,
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [{ description: 'Marketing Materials', quantity: 150, unitPrice: 300 }],
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0008`,
        vendorId: vendors[2].id,
        poDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        totalAmount: 55000,
        dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        status: 'FULLY_PAID',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [{ description: 'IT Components', quantity: 110, unitPrice: 500 }],
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0009`,
        vendorId: vendors[3].id,
        poDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        totalAmount: 80000,
        dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        status: 'DRAFT',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [{ description: 'Professional Services', quantity: 40, unitPrice: 2000 }],
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0010`,
        vendorId: vendors[4].id,
        poDate: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000),
        totalAmount: 65000,
        dueDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        status: 'PARTIALLY_PAID',
        createdBy: 'admin',
        updatedBy: 'admin',
        items: {
          create: [{ description: 'Bulk Resources', quantity: 250, unitPrice: 260 }],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${purchaseOrders.length} purchase orders`);

  // Create 12 payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0001`,
        purchaseOrderId: purchaseOrders[0].id,
        amountPaid: 25000,
        paymentDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
        notes: 'First installment',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0002`,
        purchaseOrderId: purchaseOrders[0].id,
        amountPaid: 25000,
        paymentDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        method: 'CHEQUE',
        notes: 'Second installment',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0003`,
        purchaseOrderId: purchaseOrders[1].id,
        amountPaid: 75000,
        paymentDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
        notes: 'Full payment',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0004`,
        purchaseOrderId: purchaseOrders[5].id,
        amountPaid: 15000,
        paymentDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        method: 'CASH',
        notes: 'Partial payment',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0005`,
        purchaseOrderId: purchaseOrders[5].id,
        amountPaid: 15000,
        paymentDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        method: 'UPI',
        notes: 'Remaining balance',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0006`,
        purchaseOrderId: purchaseOrders[7].id,
        amountPaid: 55000,
        paymentDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
        notes: 'Full payment',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0007`,
        purchaseOrderId: purchaseOrders[9].id,
        amountPaid: 32500,
        paymentDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        method: 'CHEQUE',
        notes: '50% advance',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0008`,
        purchaseOrderId: purchaseOrders[9].id,
        amountPaid: 32500,
        paymentDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
        notes: 'Final payment',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0009`,
        purchaseOrderId: purchaseOrders[6].id,
        amountPaid: 22500,
        paymentDate: new Date(now.getTime() - 48 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
        notes: '50% payment',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0010`,
        purchaseOrderId: purchaseOrders[6].id,
        amountPaid: 22500,
        paymentDate: new Date(now.getTime() - 38 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
        notes: 'Final payment',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0011`,
        purchaseOrderId: purchaseOrders[3].id,
        amountPaid: 100000,
        paymentDate: new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
        notes: 'Full project payment',
        createdBy: 'admin',
      },
    }),
    prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0012`,
        purchaseOrderId: purchaseOrders[1].id,
        amountPaid: 5000,
        paymentDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        method: 'UPI',
        notes: 'Adjustment payment',
        createdBy: 'admin',
      },
    }),
  ]);

  console.log(`✅ Created ${payments.length} payments`);

  console.log('\n📊 Seed Summary:');
  console.log(`   • Vendors: ${vendors.length}`);
  console.log(`   • Purchase Orders: ${purchaseOrders.length}`);
  console.log(`   • Payments: ${payments.length}`);
  console.log('\n✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
