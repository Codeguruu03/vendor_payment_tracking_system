const BASE_URL = 'https://vendor-payment-tracking-system.onrender.com';

let authToken = '';

// Sample data for seeding
const sampleData = {
  vendors: [
    { name: 'Acme Corporation', contactPerson: 'John Smith', email: 'john@acme.com', phone: '9876543210', paymentTerms: 30 },
    { name: 'Global Supplies Ltd', contactPerson: 'Jane Doe', email: 'jane@globalsupplies.com', phone: '9876543211', paymentTerms: 45 },
    { name: 'Tech Parts India', contactPerson: 'Raj Kumar', email: 'raj@techparts.in', phone: '9876543212', paymentTerms: 15 },
    { name: 'Expert Services', contactPerson: 'Alice Johnson', email: 'alice@expert.com', phone: '9876543213', paymentTerms: 60 },
    { name: 'Quality Traders', contactPerson: 'Bob Wilson', email: 'bob@quality.com', phone: '9876543214', paymentTerms: 20 },
  ],
  purchaseOrders: [
    { poNumber: 'PO-2024-0001', totalAmount: 50000, dueDate: '2024-03-15', status: 'APPROVED' },
    { poNumber: 'PO-2024-0002', totalAmount: 75000, dueDate: '2024-02-28', status: 'APPROVED' },
    { poNumber: 'PO-2024-0003', totalAmount: 30000, dueDate: '2024-03-20', status: 'APPROVED' },
    { poNumber: 'PO-2024-0004', totalAmount: 55000, dueDate: '2024-02-15', status: 'PARTIALLY_PAID' },
    { poNumber: 'PO-2024-0005', totalAmount: 100000, dueDate: '2024-04-10', status: 'APPROVED' },
  ],
  payments: [
    { poNumber: 'PO-2024-0001', amount: 50000, method: 'BANK_TRANSFER', date: '2024-01-20' },
    { poNumber: 'PO-2024-0001', amount: 25000, method: 'CHEQUE', date: '2024-01-15' },
    { poNumber: 'PO-2024-0002', amount: 50000, method: 'BANK_TRANSFER', date: '2024-01-25' },
    { poNumber: 'PO-2024-0002', amount: 25000, method: 'UPI', date: '2024-01-22' },
    { poNumber: 'PO-2024-0003', amount: 30000, method: 'BANK_TRANSFER', date: '2024-01-18' },
    { poNumber: 'PO-2024-0004', amount: 55000, method: 'CHEQUE', date: '2024-01-10' },
    { poNumber: 'PO-2024-0004', amount: 30000, method: 'BANK_TRANSFER', date: '2024-01-28' },
    { poNumber: 'PO-2024-0005', amount: 75000, method: 'BANK_TRANSFER', date: '2024-01-30' },
    { poNumber: 'PO-2024-0005', amount: 25000, method: 'UPI', date: '2024-02-01' },
  ],
};

async function login() {
  console.log('🔐 Logging in...');
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const data = await response.json();
  authToken = data.access_token;
  console.log('✅ Login successful\n');
}

async function createVendor(vendor) {
  const response = await fetch(`${BASE_URL}/api/vendors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(vendor),
  });
  return response.json();
}

async function createPurchaseOrder(po, vendorId) {
  const response = await fetch(`${BASE_URL}/api/purchase-orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      ...po,
      vendorId,
      items: [
        { description: 'Item 1', quantity: 10, unitPrice: po.totalAmount / 20 },
        { description: 'Item 2', quantity: 10, unitPrice: po.totalAmount / 20 },
      ],
    }),
  });
  return response.json();
}

async function createPayment(payment, purchaseOrderId) {
  const payloadData = {
    purchaseOrderId,
    amount: payment.amount,
    method: payment.method,
    paymentDate: new Date(payment.date).toISOString(),
  };
  
  console.log(`    [DEBUG] Creating payment:`, payloadData);
  
  const response = await fetch(`${BASE_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(payloadData),
  });
  const data = await response.json();
  console.log(`    [DEBUG] Response:`, data);
  return data;
}

async function main() {
  try {
    await login();

    console.log('📦 Getting existing vendors...');
    const vendorRes = await fetch(`${BASE_URL}/api/vendors`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const vendorListData = await vendorRes.json();
    const vendors = vendorListData.data || [];
    console.log(`  📊 Found ${vendors.length} existing vendors`);

    // If we have fewer than 5 vendors, create more
    if (vendors.length < 5) {
      for (let i = vendors.length; i < 5; i++) {
        const vendor = sampleData.vendors[i];
        const created = await createVendor(vendor);
        vendors.push(created);
        console.log(`  ✅ Created vendor: ${created.name}`);
      }
    }

    console.log('\n📋 Getting existing purchase orders...');
    const poRes = await fetch(`${BASE_URL}/api/purchase-orders`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const poListData = await poRes.json();
    let purchaseOrders = poListData.data || [];
    console.log(`  📊 Found ${purchaseOrders.length} existing POs`);

    // Create new POs if needed
    const existingPONumbers = purchaseOrders.map(p => p.poNumber);
    for (let i = 0; i < sampleData.purchaseOrders.length; i++) {
      const poData = sampleData.purchaseOrders[i];
      if (!existingPONumbers.includes(poData.poNumber)) {
        const vendorId = vendors[i % vendors.length].id;
        const created = await createPurchaseOrder(poData, vendorId);
        purchaseOrders.push(created);
        console.log(`  ✅ Created PO: ${created.poNumber}`);
      }
    }

    console.log('\n💳 Creating payments...');
    let paymentCount = 0;
    for (const payment of sampleData.payments) {
      const po = purchaseOrders.find(p => p.poNumber === payment.poNumber);
      if (po) {
        const payRes = await createPayment(payment, po.id);
        if (payRes && !payRes.error) {
          paymentCount++;
          console.log(`  ✅ Created payment: ${payment.amount} via ${payment.method}`);
        } else {
          console.log(`  ⚠️  Payment creation response:`, payRes);
        }
      } else {
        console.log(`  ⚠️  PO not found for ${payment.poNumber}`);
      }
    }

    console.log(`\n✨ Seed complete!`);
    console.log(`  • ${vendors.length} vendors`);
    console.log(`  • ${purchaseOrders.length} purchase orders`);
    console.log(`  • ${paymentCount} new payments created`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

main();
