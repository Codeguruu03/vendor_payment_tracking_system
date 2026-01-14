const BASE_URL = 'https://vendor-payment-tracking-system.onrender.com';

let authToken = '';
let adminUser = null;
let testVendorId = null;
let testPOId = null;
let testPaymentId = null;

const results = [];

async function login() {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const data = await response.json();
  authToken = data.access_token;
  return response.status === 200;
}

async function testEndpoint(name, method, url, body = null, expectedStatus = 200) {
  try {
    const options = {
      method,
      headers: { 'Authorization': `Bearer ${authToken}` }
    };

    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${url}`, options);
    const data = await response.json();

    const success = response.status === expectedStatus || (response.status >= 200 && response.status < 300);
    results.push({
      endpoint: name,
      method,
      url,
      status: response.status,
      success,
      data: success ? '✅' : data.message || data.error
    });

    return { success, data, status: response.status };
  } catch (error) {
    results.push({
      endpoint: name,
      method,
      url,
      status: 'ERROR',
      success: false,
      data: error.message
    });
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Verification...\n');

  // AUTH ENDPOINTS
  console.log('📝 Testing AUTH endpoints...');
  const loginResult = await testEndpoint('POST /auth/login', 'POST', '/auth/login', 
    { username: 'admin', password: 'admin123' }, 200);
  
  if (loginResult.success) {
    authToken = loginResult.data.access_token;
    console.log('✅ Authentication successful\n');
  }

  await testEndpoint('GET /auth/profile', 'GET', '/auth/profile', null, 200);

  // VENDOR ENDPOINTS
  console.log('\n📦 Testing VENDOR endpoints...');
  
  const createVendorResult = await testEndpoint('POST /vendors', 'POST', '/vendors', {
    name: `Test Vendor ${Date.now()}`,
    contactPerson: 'Test Person',
    email: `vendor${Date.now()}@test.com`,
    phone: '1234567890',
    paymentTerms: 30,
    status: 'ACTIVE'
  }, 201);
  
  if (createVendorResult.success) {
    testVendorId = createVendorResult.data.id;
  }

  await testEndpoint('GET /vendors (list)', 'GET', '/vendors?page=1&limit=10', null, 200);
  
  if (testVendorId) {
    await testEndpoint(`GET /vendors/${testVendorId}`, 'GET', `/vendors/${testVendorId}`, null, 200);
    
    await testEndpoint(`PUT /vendors/${testVendorId}`, 'PUT', `/vendors/${testVendorId}`, {
      contactPerson: 'Updated Person',
      paymentTerms: 45
    }, 200);
  }

  // PURCHASE ORDER ENDPOINTS
  console.log('\n📋 Testing PURCHASE ORDER endpoints...');
  
  if (testVendorId) {
    const createPOResult = await testEndpoint('POST /purchase-orders', 'POST', '/purchase-orders', {
      vendorId: testVendorId,
      lineItems: [
        { description: 'Test Item', quantity: 10, unitPrice: 100 }
      ]
    }, 201);

    if (createPOResult.success) {
      testPOId = createPOResult.data.id;
    }

    await testEndpoint('GET /purchase-orders (list)', 'GET', '/purchase-orders?page=1&limit=10', null, 200);
    
    if (testPOId) {
      await testEndpoint(`GET /purchase-orders/${testPOId}`, 'GET', `/purchase-orders/${testPOId}`, null, 200);
      
      await testEndpoint(`PUT /purchase-orders/${testPOId}`, 'PUT', `/purchase-orders/${testPOId}`, {
        lineItems: [
          { description: 'Updated Item', quantity: 15, unitPrice: 150 }
        ]
      }, 200);

      await testEndpoint(`PATCH /purchase-orders/${testPOId}/status`, 'PATCH', `/purchase-orders/${testPOId}/status`, {
        status: 'APPROVED'
      }, 200);
    }
  }

  // PAYMENT ENDPOINTS
  console.log('\n💰 Testing PAYMENT endpoints...');
  
  if (testPOId) {
    const createPaymentResult = await testEndpoint('POST /payments', 'POST', '/payments', {
      purchaseOrderId: testPOId,
      amount: 500,
      method: 'BANK_TRANSFER'
    }, 201);

    if (createPaymentResult.success) {
      testPaymentId = createPaymentResult.data.id;
    }

    await testEndpoint('GET /payments (list)', 'GET', '/payments?page=1&limit=10', null, 200);
    
    if (testPaymentId) {
      await testEndpoint(`GET /payments/${testPaymentId}`, 'GET', `/payments/${testPaymentId}`, null, 200);
      
      // Note: DELETE is for void/soft delete
      // Commenting out as it would remove the payment we just created
      // await testEndpoint(`DELETE /payments/${testPaymentId}`, 'DELETE', `/payments/${testPaymentId}`, null, 200);
    }
  }

  // ANALYTICS ENDPOINTS
  console.log('\n📊 Testing ANALYTICS endpoints...');
  
  await testEndpoint('GET /analytics/vendor-outstanding', 'GET', '/analytics/vendor-outstanding', null, 200);
  await testEndpoint('GET /analytics/payment-aging', 'GET', '/analytics/payment-aging', null, 200);
  await testEndpoint('GET /analytics/payment-trends', 'GET', '/analytics/payment-trends', null, 200);

  // SWAGGER
  console.log('\n📚 Testing SWAGGER endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/api-json`);
    const success = response.status === 200;
    results.push({
      endpoint: 'GET /api-json (Swagger)',
      method: 'GET',
      url: '/api-json',
      status: response.status,
      success,
      data: success ? '✅' : 'Failed'
    });
  } catch (error) {
    results.push({
      endpoint: 'GET /api-json (Swagger)',
      method: 'GET',
      url: '/api-json',
      status: 'ERROR',
      success: false,
      data: error.message
    });
  }

  // PRINT RESULTS
  console.log('\n\n════════════════════════════════════════════════════════════════');
  console.log('📊 API ENDPOINT VERIFICATION RESULTS');
  console.log('════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    const status = result.status === 'ERROR' ? 'ERROR' : result.status;
    console.log(`${icon} ${result.endpoint}`);
    console.log(`   Method: ${result.method} ${result.url}`);
    console.log(`   Status: ${status}`);
    console.log(`   Result: ${result.data}\n`);
    
    if (result.success) passed++;
    else failed++;
  });

  console.log('════════════════════════════════════════════════════════════════');
  console.log(`✅ PASSED: ${passed}/${results.length}`);
  console.log(`❌ FAILED: ${failed}/${results.length}`);
  console.log('════════════════════════════════════════════════════════════════\n');

  if (failed === 0) {
    console.log('🎉 All endpoints are working correctly!');
  } else {
    console.log('⚠️  Some endpoints need attention');
  }
}

async function main() {
  try {
    const loggedIn = await login();
    if (!loggedIn) {
      console.error('❌ Login failed');
      return;
    }
    await runTests();
  } catch (error) {
    console.error('Fatal error:', error.message);
  }
}

main();
