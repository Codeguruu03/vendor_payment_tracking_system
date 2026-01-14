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
    console.log('Login response:', JSON.stringify(loginData, null, 2));

    if (!loginData.access_token) {
      console.error('No token received');
      return;
    }

    const token = loginData.access_token;
    
    console.log('\n📦 Testing vendors endpoint...');
    const vendorRes = await fetch(`${BASE_URL}/api/vendors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const vendorData = await vendorRes.json();
    console.log('Vendors response:', JSON.stringify(vendorData, null, 2).substring(0, 1000));

    console.log('\n📋 Testing purchase orders endpoint...');
    const poRes = await fetch(`${BASE_URL}/api/purchase-orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const poData = await poRes.json();
    console.log('PO response:', JSON.stringify(poData, null, 2).substring(0, 1000));

    console.log('\n💳 Testing payments endpoint...');
    const payRes = await fetch(`${BASE_URL}/api/payments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const payData = await payRes.json();
    console.log('Payment response:', JSON.stringify(payData, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
