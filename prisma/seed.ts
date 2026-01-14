import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create 5 Vendors
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: 'Acme Corporation',
        contactPerson: 'John Smith',
        email: 'john@acme.com',
        phone: '9876543210',
        paymentTerms: 30,
        status: 'ACTIVE',
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
      },
    }),
  ]);

  console.log(`✅ Created ${vendors.length} vendors`);

  // Create Purchase Orders
  const now = new Date();
  const purchaseOrders = [
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0001`,
        vendorId: vendors[0].id,
        poDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        totalAmount: 50000,
        dueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        items: {
          create: [
            { description: 'Item 1', quantity: 100, unitPrice: 250 },
            { description: 'Item 2', quantity: 100, unitPrice: 250 },
          ],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0002`,
        vendorId: vendors[1].id,
        poDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        totalAmount: 75000,
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        items: {
          create: [{ description: 'Service A', quantity: 1, unitPrice: 75000 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0003`,
        vendorId: vendors[2].id,
        poDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        totalAmount: 40000,
        dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        status: 'DRAFT',
        items: {
          create: [{ description: 'Parts', quantity: 200, unitPrice: 200 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0004`,
        vendorId: vendors[3].id,
        poDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        totalAmount: 100000,
        dueDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        items: {
          create: [{ description: 'Consultation', quantity: 100, unitPrice: 1000 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0005`,
        vendorId: vendors[4].id,
        poDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        totalAmount: 60000,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'DRAFT',
        items: {
          create: [{ description: 'Supplies', quantity: 300, unitPrice: 200 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0006`,
        vendorId: vendors[0].id,
        poDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        totalAmount: 30000,
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        status: 'PARTIALLY_PAID',
        items: {
          create: [{ description: 'Equipment', quantity: 30, unitPrice: 1000 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0007`,
        vendorId: vendors[1].id,
        poDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        totalAmount: 45000,
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        items: {
          create: [{ description: 'Materials', quantity: 150, unitPrice: 300 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0008`,
        vendorId: vendors[2].id,
        poDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        totalAmount: 55000,
        dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        status: 'FULLY_PAID',
        items: {
          create: [{ description: 'Components', quantity: 110, unitPrice: 500 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0009`,
        vendorId: vendors[3].id,
        poDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        totalAmount: 80000,
        dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        status: 'DRAFT',
        items: {
          create: [{ description: 'Services', quantity: 40, unitPrice: 2000 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0010`,
        vendorId: vendors[4].id,
        poDate: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000),
        totalAmount: 65000,
        dueDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        status: 'PARTIALLY_PAID',
        items: {
          create: [{ description: 'Resources', quantity: 250, unitPrice: 260 }],
        },
      },
    }),
  ];

  console.log(`✅ Created ${purchaseOrders.length} purchase orders`);

  // Create Payments
  const payments = [
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0001`,
        purchaseOrderId: purchaseOrders[0].id,
        amountPaid: 25000,
        paymentDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0002`,
        purchaseOrderId: purchaseOrders[0].id,
        amountPaid: 25000,
        paymentDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        method: 'CHEQUE',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0003`,
        purchaseOrderId: purchaseOrders[1].id,
        amountPaid: 75000,
        paymentDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0004`,
        purchaseOrderId: purchaseOrders[5].id,
        amountPaid: 15000,
        paymentDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        method: 'CASH',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0005`,
        purchaseOrderId: purchaseOrders[5].id,
        amountPaid: 15000,
        paymentDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        method: 'CREDIT_CARD',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0006`,
        purchaseOrderId: purchaseOrders[7].id,
        amountPaid: 55000,
        paymentDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0007`,
        purchaseOrderId: purchaseOrders[9].id,
        amountPaid: 32500,
        paymentDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        method: 'CHEQUE',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0008`,
        purchaseOrderId: purchaseOrders[9].id,
        amountPaid: 32500,
        paymentDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
      },
    }),
  ];

  console.log(`✅ Created ${payments.length} payments`);

  console.log('\n📊 Seed Summary:');
  console.log(`   • Vendors: ${vendors.length}`);
  console.log(`   • Purchase Orders: ${purchaseOrders.length}`);
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

  // Create 5 Vendors
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: 'Acme Corporation',
        contactPerson: 'John Smith',
        email: 'john@acme.com',
        phone: '9876543210',
        paymentTerms: 30,
        status: 'ACTIVE',
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
      },
    }),
  ]);

  console.log(`✅ Created ${vendors.length} vendors`);

  // Create Purchase Orders
  const now = new Date();
  const purchaseOrders = [
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0001`,
        vendorId: vendors[0].id,
        poDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        totalAmount: 50000,
        dueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        items: {
          create: [
            { description: 'Item 1', quantity: 100, unitPrice: 250 },
            { description: 'Item 2', quantity: 100, unitPrice: 250 },
          ],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0002`,
        vendorId: vendors[1].id,
        poDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        totalAmount: 75000,
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        items: {
          create: [{ description: 'Service A', quantity: 1, unitPrice: 75000 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0003`,
        vendorId: vendors[2].id,
        poDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        totalAmount: 40000,
        dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        status: 'DRAFT',
        items: {
          create: [{ description: 'Parts', quantity: 200, unitPrice: 200 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0004`,
        vendorId: vendors[3].id,
        poDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        totalAmount: 100000,
        dueDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        items: {
          create: [{ description: 'Consultation', quantity: 100, unitPrice: 1000 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0005`,
        vendorId: vendors[4].id,
        poDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        totalAmount: 60000,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'DRAFT',
        items: {
          create: [{ description: 'Supplies', quantity: 300, unitPrice: 200 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0006`,
        vendorId: vendors[0].id,
        poDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        totalAmount: 30000,
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        status: 'PARTIALLY_PAID',
        items: {
          create: [{ description: 'Equipment', quantity: 30, unitPrice: 1000 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0007`,
        vendorId: vendors[1].id,
        poDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        totalAmount: 45000,
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        status: 'APPROVED',
        items: {
          create: [{ description: 'Materials', quantity: 150, unitPrice: 300 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0008`,
        vendorId: vendors[2].id,
        poDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        totalAmount: 55000,
        dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        status: 'FULLY_PAID',
        items: {
          create: [{ description: 'Components', quantity: 110, unitPrice: 500 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0009`,
        vendorId: vendors[3].id,
        poDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        totalAmount: 80000,
        dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        status: 'DRAFT',
        items: {
          create: [{ description: 'Services', quantity: 40, unitPrice: 2000 }],
        },
      },
    }),
    await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${now.getFullYear()}-0010`,
        vendorId: vendors[4].id,
        poDate: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000),
        totalAmount: 65000,
        dueDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        status: 'PARTIALLY_PAID',
        items: {
          create: [{ description: 'Resources', quantity: 250, unitPrice: 260 }],
        },
      },
    }),
  ];

  console.log(`✅ Created ${purchaseOrders.length} purchase orders`);

  // Create Payments
  const payments = [
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0001`,
        purchaseOrderId: purchaseOrders[0].id,
        amountPaid: 25000,
        paymentDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0002`,
        purchaseOrderId: purchaseOrders[0].id,
        amountPaid: 25000,
        paymentDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        method: 'CHEQUE',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0003`,
        purchaseOrderId: purchaseOrders[1].id,
        amountPaid: 75000,
        paymentDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0004`,
        purchaseOrderId: purchaseOrders[5].id,
        amountPaid: 15000,
        paymentDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        method: 'CASH',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0005`,
        purchaseOrderId: purchaseOrders[5].id,
        amountPaid: 15000,
        paymentDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        method: 'CREDIT_CARD',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0006`,
        purchaseOrderId: purchaseOrders[7].id,
        amountPaid: 55000,
        paymentDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0007`,
        purchaseOrderId: purchaseOrders[9].id,
        amountPaid: 32500,
        paymentDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        method: 'CHEQUE',
      },
    }),
    await prisma.payment.create({
      data: {
        reference: `PAY-${now.getFullYear()}-0008`,
        purchaseOrderId: purchaseOrders[9].id,
        amountPaid: 32500,
        paymentDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        method: 'BANK_TRANSFER',
      },
    }),
  ];

  console.log(`✅ Created ${payments.length} payments`);

  console.log('\n📊 Seed Summary:');
  console.log(`   • Vendors: ${vendors.length}`);
  console.log(`   • Purchase Orders: ${purchaseOrders.length}`);
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
                status: 'ACTIVE',
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
            },
        }),
        prisma.vendor.create({
            data: {
                name: 'Metro Electronics',
                contactPerson: 'Priya Sharma',
                email: 'priya@metroelectronics.com',
                phone: '9876543213',
                paymentTerms: 60,
                status: 'ACTIVE',
            },
        }),
        prisma.vendor.create({
            data: {
                name: 'Sunset Traders',
                contactPerson: 'Mike Wilson',
                email: 'mike@sunsettraders.com',
                phone: '9876543214',
                paymentTerms: 7,
                status: 'INACTIVE',
            },
        }),
    ]);

    console.log(`✅ Created ${vendors.length} vendors`);

    // Create 15 Purchase Orders with Line Items
    const today = dayjs();
    const purchaseOrders: PurchaseOrder[] = [];

    // Helper function to create PO
    async function createPO(
        poNumber: string,
        vendorId: number,
        poDate: Date,
        totalAmount: number,
        dueDate: Date,
        status: string,
        items: { description: string; quantity: number; unitPrice: number }[]
    ) {
        return prisma.purchaseOrder.create({
            data: {
                poNumber,
                vendorId,
                poDate,
                totalAmount,
                dueDate,
                status,
                items: {
                    create: items,
                },
            },
        });
    }

    // PO 1-3 for Vendor 1 (Acme)
    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(60, 'day').format('YYYYMMDD')}-001`,
            vendors[0].id,
            today.subtract(60, 'day').toDate(),
            15000,
            today.subtract(30, 'day').toDate(),
            'FULLY_PAID',
            [
                { description: 'Steel Rods - 10mm', quantity: 100, unitPrice: 100 },
                { description: 'Steel Plates', quantity: 50, unitPrice: 100 },
            ]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(30, 'day').format('YYYYMMDD')}-001`,
            vendors[0].id,
            today.subtract(30, 'day').toDate(),
            25000,
            today.toDate(),
            'PARTIALLY_PAID',
            [
                { description: 'Industrial Pipes', quantity: 200, unitPrice: 75 },
                { description: 'Pipe Fittings', quantity: 100, unitPrice: 100 },
            ]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.format('YYYYMMDD')}-001`,
            vendors[0].id,
            today.toDate(),
            10000,
            today.add(30, 'day').toDate(),
            POStatus.APPROVED,
            [{ description: 'Bolts & Nuts Set', quantity: 500, unitPrice: 20 }]
        )
    );

    // PO 4-6 for Vendor 2 (Global Supplies)
    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(90, 'day').format('YYYYMMDD')}-001`,
            vendors[1].id,
            today.subtract(90, 'day').toDate(),
            50000,
            today.subtract(45, 'day').toDate(),
            POStatus.FULLY_PAID,
            [
                { description: 'Office Chairs', quantity: 50, unitPrice: 800 },
                { description: 'Desks', quantity: 20, unitPrice: 500 },
            ]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(45, 'day').format('YYYYMMDD')}-001`,
            vendors[1].id,
            today.subtract(45, 'day').toDate(),
            35000,
            today.toDate(),
            POStatus.APPROVED,
            [
                { description: 'Printer Paper (Reams)', quantity: 500, unitPrice: 50 },
                { description: 'Ink Cartridges', quantity: 100, unitPrice: 100 },
            ]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(10, 'day').format('YYYYMMDD')}-001`,
            vendors[1].id,
            today.subtract(10, 'day').toDate(),
            20000,
            today.add(35, 'day').toDate(),
            POStatus.DRAFT,
            [{ description: 'Filing Cabinets', quantity: 10, unitPrice: 2000 }]
        )
    );

    // PO 7-9 for Vendor 3 (Tech Parts India)
    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(20, 'day').format('YYYYMMDD')}-001`,
            vendors[2].id,
            today.subtract(20, 'day').toDate(),
            75000,
            today.subtract(5, 'day').toDate(),
            'PARTIALLY_PAID',
            [
                { description: 'Laptop - Dell Inspiron', quantity: 5, unitPrice: 12000 },
                { description: 'RAM Modules 16GB', quantity: 10, unitPrice: 1500 },
            ]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(5, 'day').format('YYYYMMDD')}-001`,
            vendors[2].id,
            today.subtract(5, 'day').toDate(),
            30000,
            today.add(10, 'day').toDate(),
            POStatus.APPROVED,
            [{ description: 'SSD 512GB', quantity: 20, unitPrice: 1500 }]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.format('YYYYMMDD')}-002`,
            vendors[2].id,
            today.toDate(),
            45000,
            today.add(15, 'day').toDate(),
            POStatus.DRAFT,
            [
                { description: 'Monitor 27inch', quantity: 10, unitPrice: 3500 },
                { description: 'Keyboard + Mouse Combo', quantity: 20, unitPrice: 500 },
            ]
        )
    );

    // PO 10-12 for Vendor 4 (Metro Electronics)
    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(120, 'day').format('YYYYMMDD')}-001`,
            vendors[3].id,
            today.subtract(120, 'day').toDate(),
            100000,
            today.subtract(60, 'day').toDate(),
            'PARTIALLY_PAID',
            [
                { description: 'Industrial AC Units', quantity: 5, unitPrice: 15000 },
                { description: 'Installation Service', quantity: 5, unitPrice: 5000 },
            ]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(50, 'day').format('YYYYMMDD')}-001`,
            vendors[3].id,
            today.subtract(50, 'day').toDate(),
            60000,
            today.add(10, 'day').toDate(),
            POStatus.APPROVED,
            [{ description: 'UPS 5KVA', quantity: 6, unitPrice: 10000 }]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.format('YYYYMMDD')}-003`,
            vendors[3].id,
            today.toDate(),
            80000,
            today.add(60, 'day').toDate(),
            POStatus.DRAFT,
            [
                { description: 'Server Rack', quantity: 2, unitPrice: 25000 },
                { description: 'Network Switch', quantity: 4, unitPrice: 7500 },
            ]
        )
    );

    // PO 13-15 for Vendor 5 (Sunset Traders - INACTIVE)
    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(180, 'day').format('YYYYMMDD')}-001`,
            vendors[4].id,
            today.subtract(180, 'day').toDate(),
            40000,
            today.subtract(173, 'day').toDate(),
            POStatus.FULLY_PAID,
            [{ description: 'Office Supplies Kit', quantity: 100, unitPrice: 400 }]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(150, 'day').format('YYYYMMDD')}-001`,
            vendors[4].id,
            today.subtract(150, 'day').toDate(),
            25000,
            today.subtract(143, 'day').toDate(),
            POStatus.FULLY_PAID,
            [{ description: 'Stationery Bundle', quantity: 250, unitPrice: 100 }]
        )
    );

    purchaseOrders.push(
        await createPO(
            `PO-${today.subtract(100, 'day').format('YYYYMMDD')}-001`,
            vendors[4].id,
            today.subtract(100, 'day').toDate(),
            15000,
            today.subtract(93, 'day').toDate(),
            POStatus.APPROVED, // Old unpaid PO from inactive vendor
            [{ description: 'Cleaning Supplies', quantity: 50, unitPrice: 300 }]
        )
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
