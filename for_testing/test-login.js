const BASE_URL = 'https://vendor-payment-tracking-system.onrender.com';

async function testLogin() {
  console.log('Testing login to:', BASE_URL);
  
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.access_token) {
      console.log('✅ Login successful!');
      return true;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  return false;
}

testLogin();
