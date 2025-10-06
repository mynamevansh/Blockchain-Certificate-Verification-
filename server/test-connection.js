const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const testMongoDBConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB Atlas Connection...');
    console.log('📡 Connection String:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@'));
    const options = {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 30000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      authSource: 'admin',
      retryWrites: true,
    };
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('✅ MongoDB Atlas Connection Successful!');
    console.log('📊 Database:', conn.connection.db.databaseName);
    console.log('🌐 Host:', conn.connection.host);
    console.log('🔌 Port:', conn.connection.port);
    console.log('📈 Ready State:', conn.connection.readyState); // 1 = connected
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📂 Collections:', collections.map(c => c.name));
    await mongoose.connection.close();
    console.log('🔌 Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Atlas Connection Failed!');
    console.error('🔍 Error Details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication Error Solutions:');
      console.log('   • Check username/password in .env file');
      console.log('   • Verify database user exists in Atlas');
      console.log('   • Ensure user has proper permissions (readWrite)');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('MongoNetworkError')) {
      console.log('\n💡 Network Error Solutions:');
      console.log('   • Check internet connection');
      console.log('   • Verify cluster URL in connection string');
      console.log('   • Check IP whitelist in Atlas (add 0.0.0.0/0 for testing)');
    } else if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('\n💡 Authentication Failed Solutions:');
      console.log('   • Double-check username and password');
      console.log('   • Ensure no special characters need URL encoding');
      console.log('   • Try recreating database user in Atlas');
    }
    console.log('\n🔧 General Troubleshooting Steps:');
    console.log('   1. Verify MongoDB Atlas cluster is running');
    console.log('   2. Check Network Access in Atlas (IP Whitelist)');
    console.log('   3. Verify Database Access (User Permissions)');
    console.log('   4. Test connection string format');
    process.exit(1);
  }
};
testMongoDBConnection();
