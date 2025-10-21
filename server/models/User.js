const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  program: {
    type: String,
    required: [true, 'Program is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  enrollmentDate: {
    type: Date,
    required: [true, 'Enrollment date is required']
  },
  expectedGraduation: {
    type: Date,
    required: [true, 'Expected graduation date is required']
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'suspended', 'graduated', 'withdrawn']
  },
  certificates: [{
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate'
    },
    issuedDate: Date,
    status: {
      type: String,
      enum: ['valid', 'revoked'],
      default: 'valid'
    }
  }],
  profileImage: {
    type: String, // URL to profile image
    default: null
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return await this.save();
};
userSchema.methods.addCertificate = async function(certificateId) {
  this.certificates.push({
    certificateId,
    issuedDate: new Date(),
    status: 'valid'
  });
  return await this.save();
};
userSchema.statics.findActiveByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};
userSchema.statics.findByStudentId = function(studentId) {
  return this.findOne({ studentId: studentId.toUpperCase(), isActive: true });
};
module.exports = mongoose.model('User', userSchema);
