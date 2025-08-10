const axios = require('axios');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_FILE_PATH = 'test.txt'; // Adjust this to a file that exists in your S3 bucket

async function testFileView() {
  try {
    console.log('🧪 Testing File View Functionality...\n');
    
    // Test 1: Check if the view endpoint exists
    console.log('1️⃣ Testing file view endpoint...');
    try {
      const response = await axios.get(`${BASE_URL}/api/files/view?path=${TEST_FILE_PATH}`);
      console.log('✅ File view endpoint working');
      console.log('   Response status:', response.status);
      console.log('   File name:', response.data.data.name);
      console.log('   File size:', response.data.data.size);
      console.log('   Content type:', response.data.data.contentType);
      console.log('   Is binary:', response.data.data.isBinary);
      console.log('   Content preview:', response.data.data.content.substring(0, 100) + '...');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  File view endpoint requires authentication (expected)');
      } else {
        console.log('❌ File view endpoint error:', error.response?.data?.error || error.message);
      }
    }
    
    // Test 2: Check if the download endpoint still works
    console.log('\n2️⃣ Testing file download endpoint...');
    try {
      const response = await axios.get(`${BASE_URL}/api/files/download?path=${TEST_FILE_PATH}`);
      console.log('✅ File download endpoint working');
      console.log('   Response status:', response.status);
      console.log('   Download URL generated:', !!response.data.data.downloadUrl);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  File download endpoint requires authentication (expected)');
      } else {
        console.log('❌ File download endpoint error:', error.response?.data?.error || error.message);
      }
    }
    
    // Test 3: Check if the list endpoint works
    console.log('\n3️⃣ Testing file list endpoint...');
    try {
      const response = await axios.get(`${BASE_URL}/api/files/list`);
      console.log('✅ File list endpoint working');
      console.log('   Response status:', response.status);
      console.log('   Folders found:', response.data.data.folders?.length || 0);
      console.log('   Files found:', response.data.data.files?.length || 0);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  File list endpoint requires authentication (expected)');
      } else {
        console.log('❌ File list endpoint error:', error.response?.data?.error || error.message);
      }
    }
    
    console.log('\n🎉 File view functionality test completed!');
    console.log('\n📝 Note: To test with authentication, you need to:');
    console.log('   1. Login to the application');
    console.log('   2. Use the browser to test the view functionality');
    console.log('   3. Check the admin panel for activity logs');
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testFileView();
}

module.exports = { testFileView }; 