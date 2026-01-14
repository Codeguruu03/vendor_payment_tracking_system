const BASE_URL = 'https://vendor-payment-tracking-system.onrender.com';

let authToken = '';

async function login() {
  console.log('🔐 Logging in...');
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const data = await response.json();
  authToken = data.access_token;
  console.log('✅ Logged in successfully');
}

async function createVendor(vendor) {
  const response = await fetch(`${BASE_URL}/vendors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(vendor)
  });
  const data = await response.json();
  return data;
}

async function createPurchaseOrder(po) {
  const response = await fetch(`${BASE_URL}/purchase-orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(po)
  });
  const data = await response.json();
  return data;
}

async function recordPayment(payment) {
  const response = await fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(payment)
  });
  const data = await response.json();
  return data;
}

async function seed() {
  try {
    await login();

    // Create Vendors
    console.log('\n📦 Creating vendors...');
    const vendors = [
      {
        name: 'Acme Corporation',
        contactPerson: 'John Smith',
        email: 'john@acme.com',
        phone: '9876543210',
        paymentTerms: 30,
        status: 'ACTIVE'
      },
      {
        name: 'Global Supplies Ltd',
        contactPerson: 'Jane Doe',
        email: 'jane@globalsupplies.com',
        phone: '9876543211',
        paymentTerms: 45,
        status: 'ACTIVE'
      },
      {
        name: 'Tech Parts India',
        contactPerson: 'Raj Kumar',
        email: 'raj@techparts.in',
        phone: '9876543212',
        paymentTerms: 15,
        status: 'ACTIVE'
      },
      {
        name: 'Expert Services',
        contactPerson: 'Alice Johnson',
        email: 'alice@expert.com',
        phone: '9876543213',
        paymentTerms: 60,
        status: 'ACTIVE'
      },
      {
        name: 'Quality Traders',
        contactPerson: 'Bob Wilson',
        email: 'bob@quality.com',
        phone: '9876543214',
        paymentTerms: 20,
        status: 'ACTIVE'
      }
    ];

    const vendorIds = [];
    for (const vendor of vendors) {
      const result = await createVendor(vendor);
      vendorIds.push(result.id);
      console.log(`✅ Created vendor: ${vendor.name}`);
    }

    // Create Purchase Orders
    console.log('\n📋 Creating purchase orders...');
    const poData = [
      {
        vendorId: vendorIds[0],
        lineItems: [
          { description: 'Widget A', quantity: 100, unitPrice: 50 },
          { description: 'Widget B', quantity: 50, unitPrice: 75 }
        ]
      },
      {
        vendorId: vendorIds[1],
        lineItems: [
          { description: 'Part X', quantity: 20, unitPrice: 200 }
        ]
      },
      {
        vendorId: vendorIds[2],
        lineItems: [
          { description: 'Component Y', quantity: 150, unitPrice: 25 },
          { description: 'Component Z', quantity: 75, unitPrice: 30 }
        ]
      },
      {
        vendorId: vendorIds[3],
        lineItems: [
          { description: 'Service Package', quantity: 1, unitPrice: 5000 }
        ]
      },
      {
        vendorId: vendorIds[4],
        lineItems: [
          { description: 'Material M', quantity: 500, unitPrice: 10 }
        ]
      },
      {
        vendorId: vendorIds[0],
        lineItems: [
          { description: 'Supply Kit', quantity: 30, unitPrice: 150 }
        ]
      },
      {
        vendorId: vendorIds[1],
        lineItems: [
          { description: 'Equipment', quantity: 5, unitPrice: 1000 }
        ]
      },
      {
        vendorId: vendorIds[2],
        lineItems: [
          { description: 'Tool Set', quantity: 10, unitPrice: 300 }
        ]
      },
      {
        vendorId: vendorIds[3],
        lineItems: [
          { description: 'Consulting Hours', quantity: 40, unitPrice: 100 }
        ]
      },
      {
        vendorId: vendorIds[4],
        lineItems: [
          { description: 'Raw Material', quantity: 1000, unitPrice: 5 }
        ]
      }
    ];

    const poIds = [];
    for (const po of poData) {
      const result = await createPurchaseOrder(po);
      poIds.push(result.id);
      console.log(`✅ Created PO: ${result.poNumber}`);
    }

    // Create Payments
    console.log('\n💰 Creating payments...');
    const payments = [
      { purchaseOrderId: poIds[0], amount: 5000, method: 'BANK_TRANSFER' },
      { purchaseOrderId: poIds[0], amount: 4750, method: 'CHEQUE' },
      { purchaseOrderId: poIds[1], amount: 4000, method: 'CASH' },
      { purchaseOrderId: poIds[2], amount: 3000, method: 'CREDIT_CARD' },
      { purchaseOrderId: poIds[2], amount: 3375, method: 'BANK_TRANSFER' },
      { purchaseOrderId: poIds[3], amount: 2500, method: 'CHEQUE' },
      { purchaseOrderId: poIds[4], amount: 2500, method: 'CASH' },
      { purchaseOrderId: poIds[5], amount: 2250, method: 'BANK_TRANSFER' },
      { purchaseOrderId: poIds[6], amount: 2500, method: 'CREDIT_CARD' },
      { purchaseOrderId: poIds[7], amount: 1500, method: 'CHEQUE' },
      { purchaseOrderId: poIds[8], amount: 2000, method: 'BANK_TRANSFER' },
      { purchaseOrderId: poIds[9], amount: 2500, method: 'CASH' },
      { purchaseOrderId: poIds[1], amount: 1000, method: 'BANK_TRANSFER' },
      { purchaseOrderId: poIds[3], amount: 2500, method: 'CREDIT_CARD' },
      { purchaseOrderId: poIds[5], amount: 2250, method: 'BANK_TRANSFER' }
    ];

    for (const payment of payments) {
      const result = await recordPayment(payment);
      console.log(`✅ Recorded payment: $${payment.amount}`);
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log(`✅ Created ${vendorIds.length} vendors`);
    console.log(`✅ Created ${poIds.length} purchase orders`);
    console.log(`✅ Created ${payments.length} payments`);
    console.log('\n🎉 Data is now available in the API!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seed();
