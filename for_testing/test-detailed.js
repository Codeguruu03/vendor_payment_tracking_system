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
  console.log('✅ Login successful');
}

async function testCreateAndFetch() {
  console.log('\n📝 Creating a new vendor...');
  
  const vendorName = 'Test Vendor ' + Date.now();
  const vendorData = {
    name: vendorName,
    contactPerson: 'Test Person',
    email: `test${Date.now()}@example.com`,
    phone: '1234567890',
    paymentTerms: 30,
    status: 'ACTIVE'
  };

  // CREATE
  const createResponse = await fetch(`${BASE_URL}/vendors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(vendorData)
  });

  const createdVendor = await createResponse.json();
  console.log('Created vendor response:', JSON.stringify(createdVendor, null, 2));

  if (!createdVendor.id) {
    console.error('❌ Failed to create vendor');
    return;
  }

  console.log(`✅ Vendor created with ID: ${createdVendor.id}`);

  // FETCH IMMEDIATELY
  console.log('\n📦 Fetching all vendors immediately after creation...');
  const getResponse = await fetch(`${BASE_URL}/vendors?page=1&limit=100`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });

  const allVendors = await getResponse.json();
  console.log('\nAll vendors response:', JSON.stringify(allVendors, null, 2));

  if (allVendors.data && allVendors.data.length > 0) {
    console.log(`\n✅ Found ${allVendors.data.length} vendors`);
    allVendors.data.forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.name} (ID: ${v.id})`);
    });
  } else {
    console.log('❌ No vendors found');
  }
}

async function test() {
  try {
    await login();
    await testCreateAndFetch();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
