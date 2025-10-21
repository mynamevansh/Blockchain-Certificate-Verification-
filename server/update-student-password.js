const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
const updateStudentPassword = async () => {
  try {
    await connectDB();
    const User = require('./models/User');
    const newPassword = 'demostudent';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.updateOne(
      { email: 'student@university.edu' },
      { password: hashedPassword }
    );
    if (result.modifiedCount > 0) {
      console.log('✅ Student password updated successfully');
      console.log('📧 Email: student@university.edu');
      console.log('🔑 New Password: demostudent');
    } else {
      console.log('ℹ️  No student found with email student@university.edu');
    }
  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};
updateStudentPassword();
