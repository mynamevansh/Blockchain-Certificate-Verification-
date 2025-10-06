const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const updateStudentName = async () => {
  try {
    await connectDB();
    
    const User = require('./models/User');
    
    const newName = 'Vansh Ranawat';
    
    const result = await User.updateOne(
      { email: 'student@university.edu' },
      { name: newName }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Student name updated successfully');
      console.log('📧 Email: student@university.edu');
      console.log('👤 New Name: Vansh Ranawat');
    } else if (result.matchedCount > 0) {
      console.log('ℹ️  Student found but name was already correct');
      console.log('📧 Email: student@university.edu');
      console.log('👤 Name: Vansh Ranawat');
    } else {
      console.log('⚠️  No student found with email student@university.edu');
    }
    
    // Verify the update
    const updatedUser = await User.findOne({ email: 'student@university.edu' });
    if (updatedUser) {
      console.log('🔍 Verification - Current student data:');
      console.log('   Name:', updatedUser.name);
      console.log('   Email:', updatedUser.email);
      console.log('   Student ID:', updatedUser.studentId);
    }
    
  } catch (error) {
    console.error('❌ Error updating student name:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

updateStudentName();