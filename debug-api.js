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
  console.log('Token:', authToken);
}

async function testCreateVendor() {
  console.log('\n📝 Testing vendor creation...');
  const vendorData = {
    name: 'Test Vendor ' + Date.now(),
    contactPerson: 'Test Person',
    email: 'test@example.com',
    phone: '1234567890',
    paymentTerms: 30,
    status: 'ACTIVE'
  };

  const response = await fetch(`${BASE_URL}/vendors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(vendorData)
  });

  console.log('Response Status:', response.status);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
  return data;
}

async function testGetVendors() {
  console.log('\n📦 Testing get vendors...');
  const response = await fetch(`${BASE_URL}/vendors`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });

  console.log('Response Status:', response.status);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
}

async function test() {
  try {
    await login();
    const vendor = await testCreateVendor();
    
    if (vendor.id) {
      console.log('\n✅ Vendor created with ID:', vendor.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await testGetVendors();
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
