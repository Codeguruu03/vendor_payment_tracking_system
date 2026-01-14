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

    console.log('💰 Fetching PAYMENTS...');
    const payments = await getPayments();
    console.log('Payments response:', JSON.stringify(payments, null, 2));

    console.log('\n📊 Fetching VENDOR OUTSTANDING...');
    const outstanding = await getAnalyticsOutstanding();
    console.log('Outstanding response:', JSON.stringify(outstanding, null, 2));

    console.log('\n📈 Fetching PAYMENT AGING...');
    const aging = await getAnalyticsAging();
    console.log('Aging response:', JSON.stringify(aging, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

verify();
