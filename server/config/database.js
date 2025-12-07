const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 30000,
      ssl: true,
      authSource: 'admin',
      retryWrites: true,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, options);

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
      code: error.code,
    });

    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Check Atlas cluster status, whitelist IP, and credentials');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Verify MongoDB username and password');
    } else if (error.message.includes('MongoNetworkError')) {
      console.log('💡 Check internet or network connectivity');
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
        role: 'super_admin',
      });
      await initialAdmin.save();
      console.log('👤 Initial admin user created successfully');
    } else {
      console.log('ℹ️  Admin user already exists, skipping...');
    }

    const students = [
      {
        name: 'Vansh Ranawat',
        email: 'vansh@university.edu',
        password: 'vansh123',
        studentId: 'STU-2024-001',
        program: 'B.Tech Computer Science',
        department: 'Computer Science',
        enrollmentDate: new Date('2022-08-01'),
        expectedGraduation: new Date('2026-05-30'),
        status: 'active',
        emailVerified: true,
      },
      {
        name: 'Shashank Gole',
        email: 'shashank@university.edu',
        password: 'shashank123',
        studentId: 'STU-2024-002',
        program: 'B.Tech Computer Science',
        department: 'Computer Science',
        enrollmentDate: new Date('2021-08-01'),
        expectedGraduation: new Date('2025-05-30'),
        status: 'active',
        emailVerified: true,
      },
      {
        name: 'Shreyas Dhadam',
        email: 'shreyas@university.edu',
        password: 'shreyas123',
        studentId: 'STU-2024-003',
        program: 'B.Tech Information Technology',
        department: 'Information Technology',
        enrollmentDate: new Date('2021-08-01'),
        expectedGraduation: new Date('2025-05-30'),
        status: 'active',
        emailVerified: true,
      }
    ];

    for (const studentData of students) {
      try {
        const existingStudent = await User.findOne({
          $or: [
            { email: studentData.email },
            { studentId: studentData.studentId }
          ]
        });

        if (!existingStudent) {
          const student = new User(studentData);
          await student.save();
          console.log(`🎓 Student ${studentData.name} created successfully`);
        } else {
          console.log(`ℹ️  Student ${studentData.name} already exists, skipping...`);
        }
      } catch (error) {
        if (error.code === 11000) {
          console.log(`ℹ️  Student ${studentData.name} already exists (Duplicate Key), skipping...`);
        } else {
          console.error(`❌ Error creating student ${studentData.name}:`, error.message);
        }
      }
    }

    // Seed sample certificate for demo
    const Certificate = require('../models/Certificate');
    const existingCert = await Certificate.findOne({ certificateId: 'CERT-2024-001' });
    if (!existingCert) {
      const sampleCert = new Certificate({
        certificateId: 'CERT-2024-001',
        studentId: 'STU-2024-001',
        studentName: 'Vansh Ranawat',
        studentEmail: 'vansh@university.edu',
        course: 'B.Tech Computer Science',
        degree: 'Bachelor of Technology',
        university: 'University of Excellence',
        gpa: 3.8,
        graduationDate: new Date('2024-05-30'),
        dean: 'Dr. John Anderson',
        registrar: 'Mary Johnson',
        status: 'Valid',
        fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // Empty file SHA-256
        ipfsHash: 'QmSampleIpfsHashForDemoVerification',
        transactionHash: '0xSampleTransactionHashForDemo'
      });
      await sampleCert.save();
      console.log('📜 Sample certificate CERT-2024-001 created successfully');
    } else {
      console.log('ℹ️  Sample certificate already exists, skipping...');
    }

  } catch (error) {
    console.error('❌ Error seeding initial data:', error.message);
  }
};

module.exports = { connectDB, seedInitialData };