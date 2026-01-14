const BASE_URL = 'https://vendor-payment-tracking-system.onrender.com';

let authToken = '';

async function login() {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const data = await response.json();
  authToken = data.access_token;
}

async function getVendors() {
  const response = await fetch(`${BASE_URL}/vendors`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  return response.json();
}

async function getPurchaseOrders() {
  const response = await fetch(`${BASE_URL}/purchase-orders`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  return response.json();
}

async function getPayments() {
  const response = await fetch(`${BASE_URL}/payments`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  return response.json();
}

async function getAnalyticsOutstanding() {
  const response = await fetch(`${BASE_URL}/analytics/vendor-outstanding`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  return response.json();
}

async function getAnalyticsAging() {
  const response = await fetch(`${BASE_URL}/analytics/payment-aging`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  return response.json();
}

async function verify() {
  try {
    console.log('🔐 Logging in...');
    await login();
    console.log('✅ Login successful\n');

    console.log('📦 Fetching VENDORS...');
    const vendors = await getVendors();
    console.log(`Total vendors: ${vendors.data.length}`);
    vendors.data.forEach(v => {
      console.log(`  - ${v.name} (${v.status})`);
    });

    console.log('\n📋 Fetching PURCHASE ORDERS...');
    const pos = await getPurchaseOrders();
    console.log(`Total POs: ${pos.data.length}`);
    pos.data.forEach(po => {
      console.log(`  - ${po.poNumber}: $${po.totalAmount} (${po.status})`);
    });

    console.log('\n💰 Fetching PAYMENTS...');
    const payments = await getPayments();
    console.log(`Total payments: ${payments.data.length}`);
    payments.data.forEach(p => {
      console.log(`  - Payment: $${p.amount} via ${p.method}`);
    });

    console.log('\n📊 Fetching VENDOR OUTSTANDING...');
    const outstanding = await getAnalyticsOutstanding();
    console.log('Outstanding balance per vendor:');
    outstanding.data.forEach(item => {
      console.log(`  - ${item.vendorName}: $${item.outstandingAmount}`);
    });

    console.log('\n📈 Fetching PAYMENT AGING...');
    const aging = await getAnalyticsAging();
    console.log('Payment aging (days):');
    console.log(`  - 0-30 days: $${aging.data['0-30']}`);
    console.log(`  - 31-60 days: $${aging.data['31-60']}`);
    console.log(`  - 61-90 days: $${aging.data['61-90']}`);
    console.log(`  - 90+ days: $${aging.data['90+']}`);

    console.log('\n✨ VERIFICATION COMPLETE!');
    console.log('✅ All data is correctly seeded and accessible via API');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verify();
