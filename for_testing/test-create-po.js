const BASE_URL = 'https://vendor-payment-tracking-system.onrender.com';

async function test() {
  try {
    console.log('🔐 Testing login...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log('✅ Logged in');

    console.log('\n📦 Getting existing vendors...');
    const vendorRes = await fetch(`${BASE_URL}/api/vendors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const vendorListData = await vendorRes.json();
    const vendors = vendorListData.data || [];
    console.log('Found vendors:', vendors.length);
    if (vendors.length > 0) {
      console.log('First vendor:', JSON.stringify(vendors[0], null, 2));
    }

    console.log('\n📋 Getting existing POs...');
    const poRes = await fetch(`${BASE_URL}/api/purchase-orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const poListData = await poRes.json();
    const pos = poListData.data || [];
    console.log('Found POs:', pos.length);
    if (pos.length > 0) {
      console.log('First PO:', JSON.stringify(pos[0], null, 2));
    }

    console.log('\n📝 Attempting to create new PO...');
    if (vendors.length > 0) {
      const newPoPayload = {
        poNumber: 'PO-2024-TEST-' + Date.now(),
        vendorId: vendors[0].id,
        totalAmount: 50000,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'APPROVED',
        items: [
          { description: 'Test Item 1', quantity: 10, unitPrice: 2500 },
          { description: 'Test Item 2', quantity: 10, unitPrice: 2500 },
        ],
      };
      console.log('Payload:', JSON.stringify(newPoPayload, null, 2));
      
      const createRes = await fetch(`${BASE_URL}/api/purchase-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPoPayload),
      });
      const createData = await createRes.json();
      console.log('Create response:', JSON.stringify(createData, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
