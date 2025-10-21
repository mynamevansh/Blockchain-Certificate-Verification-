const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
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

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔌 Port: ${conn.connection.port}`);

    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📴 Mongoose disconnected from MongoDB');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.error('🔍 Error Details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Solution: Check MongoDB Atlas connection string and network access');
      console.log('   • Verify your Atlas cluster is running');
      console.log('   • Check IP whitelist in Atlas Security settings');
      console.log('   • Ensure correct username/password in connection string');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Solution: Authentication failed');
      console.log('   • Verify username and password in MONGODB_URI');
      console.log('   • Check if database user has proper permissions');
    } else if (error.message.includes('MongoNetworkError')) {
      console.log('💡 Solution: Network connectivity issue');
      console.log('   • Check internet connection');
      console.log('   • Verify Atlas cluster is accessible');
      console.log('   • Check firewall settings');
    }
    
    process.exit(1);
  }
};

const seedInitialData = async () => {
  try {
    const Admin = require('../models/Admin');
    const User = require('../models/User');
    
    const existingAdmin = await Admin.findOne({ email: 'University_admin@university.edu' });
    
    if (!existingAdmin) {
      const initialAdmin = new Admin({
        name: 'University Administrator',
        email: 'University_admin@university.edu',
        password: 'admin123',
        department: 'IT Administration',
        permissions: ['create_certificate', 'revoke_certificate', 'view_users', 'manage_users', 'system_settings'],
        role: 'super_admin'
      });
      
      await initialAdmin.save();
      console.log('👤 Initial admin user created successfully');
      console.log('📧 Email: University_admin@university.edu');
      console.log('🔑 Password: admin123');
    }

    const existingStudent = await User.findOne({ email: 'student@university.edu' });
    
    if (!existingStudent) {
      const initialStudent = new User({
        name: 'Vansh Ranawat',
        email: 'student@university.edu',
        password: 'demostudent',
        studentId: 'STU-2024-001',
        program: 'Computer Science',
        department: 'Computer Science',
        enrollmentDate: new Date('2024-09-01'),
        expectedGraduation: new Date('2028-05-31'),
        status: 'active',
        emailVerified: true
      });
      
      await initialStudent.save();
      console.log('🎓 Initial student user created successfully');
      console.log('📧 Email: student@university.edu');
      console.log('🔑 Password: demostudent');
      console.log('🆔 Student ID: STU-2024-001');
    }

  } catch (error) {
    console.error('❌ Error seeding initial data:', error.message);
  }
};

module.exports = { connectDB, seedInitialData };