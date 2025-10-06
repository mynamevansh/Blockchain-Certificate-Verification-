const axios = require('axios');

const testAuthFlow = async () => {
  try {
    console.log('🧪 Testing Complete Authentication Flow...\n');

    // Step 1: Admin Login
    console.log('1️⃣ Admin Login Test...');
    const loginResponse = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'University_admin@university.edu',
      password: 'admin123'
    });

    console.log('✅ Login Response:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.data?.token,
      userData: loginResponse.data.data?.user
    });

    const token = loginResponse.data.data?.token;
    if (!token) {
      console.log('❌ No token received from login');
      return;
    }

    // Step 2: Test Admin Certificates Endpoint
    console.log('\n2️⃣ Testing Admin Certificates Endpoint...');
    try {
      const certsResponse = await axios.get('http://localhost:5000/api/certificates/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Certificates Response:', {
        success: certsResponse.data.success,
        dataLength: certsResponse.data.data?.length || 0,
        pagination: certsResponse.data.pagination
      });

    } catch (error) {
      console.log('❌ Certificates Request Failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        debug: error.response?.data?.debug
      });
    }

    // Step 3: Test Token Validation
    console.log('\n3️⃣ Testing Token Validation...');
    try {
      const profileResponse = await axios.get('http://localhost:5000/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Profile Response:', {
        success: profileResponse.data.success,
        userRole: profileResponse.data.data?.user?.role,
        userName: profileResponse.data.data?.user?.name
      });

    } catch (error) {
      console.log('❌ Profile Request Failed:', {
        status: error.response?.status,
        message: error.response?.data?.message
      });
    }

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
};

testAuthFlow();