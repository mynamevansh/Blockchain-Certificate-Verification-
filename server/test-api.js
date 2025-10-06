const axios = require('axios');
const API_BASE = 'http://localhost:5000/api';
const ADMIN_CREDENTIALS = {
  email: 'University_admin@university.edu',
  password: 'admin123'
};
const STUDENT_CREDENTIALS = {
  email: 'student@university.edu',
  password: 'demostudent'
};
const testAPI = async () => {
  try {
    console.log('🧪 Testing Backend API Endpoints...\n');
    console.log('1️⃣ Testing Health Check...');
    try {
      const healthResponse = await axios.get('http://localhost:5000/health');
      console.log('✅ Health Check:', healthResponse.data.message);
    } catch (error) {
      console.log('❌ Health Check Failed:', error.message);
      return;
    }
    console.log('\n2️⃣ Testing Admin Login...');
    try {
      const adminResponse = await axios.post(`${API_BASE}/admin/login`, ADMIN_CREDENTIALS);
      console.log('✅ Admin Login Success:', adminResponse.data.message);
      console.log('🔑 Admin Token:', adminResponse.data.data?.token ? 'Generated' : 'Missing');
      const adminToken = adminResponse.data.data?.token;
      if (adminToken) {
        console.log('\n3️⃣ Testing Admin Profile Access...');
        const profileResponse = await axios.get(`${API_BASE}/admin/profile`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Admin Profile:', profileResponse.data.data?.user?.name);
      }
    } catch (error) {
      console.log('❌ Admin Login Failed:', error.response?.data?.message || error.message);
      console.log('🔍 Status Code:', error.response?.status);
    }
    console.log('\n4️⃣ Testing Student Login...');
    try {
      const studentResponse = await axios.post(`${API_BASE}/users/login`, STUDENT_CREDENTIALS);
      console.log('✅ Student Login Success:', studentResponse.data.message);
      console.log('🔑 Student Token:', studentResponse.data.data?.token ? 'Generated' : 'Missing');
      const studentToken = studentResponse.data.data?.token;
      if (studentToken) {
        console.log('\n5️⃣ Testing Student Profile Access...');
        const profileResponse = await axios.get(`${API_BASE}/users/profile`, {
          headers: { Authorization: `Bearer ${studentToken}` }
        });
        console.log('✅ Student Profile:', profileResponse.data.data?.user?.name);
      }
    } catch (error) {
      console.log('❌ Student Login Failed:', error.response?.data?.message || error.message);
      console.log('🔍 Status Code:', error.response?.status);
    }
    console.log('\n6️⃣ Testing Invalid Credentials...');
    try {
      await axios.post(`${API_BASE}/admin/login`, {
        email: 'wrong@email.com',
        password: 'wrongpassword'
      });
      console.log('❌ Security Issue: Invalid login should fail!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Security Check Passed: Invalid credentials rejected');
      } else {
        console.log('⚠️  Unexpected error:', error.message);
      }
    }
    console.log('\n🎉 API Testing Complete!');
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
};
const checkServerStatus = async () => {
  try {
    await axios.get('http://localhost:5000/health');
    console.log('✅ Backend server is running on port 5000\n');
    return true;
  } catch (error) {
    console.log('❌ Backend server is not running on port 5000');
    console.log('💡 Please start the server first: npm run dev');
    return false;
  }
};
const runTests = async () => {
  const serverRunning = await checkServerStatus();
  if (serverRunning) {
    await testAPI();
  }
};
runTests();
