const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  university: {
    type: String,
    required: true,
    trim: true,
    default: 'University of Excellence'
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4
  },
  graduationDate: {
    type: Date,
    required: true
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  dean: {
    type: String,
    required: true,
    trim: true
  },
  registrar: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Valid', 'Revoked', 'Pending'],
    default: 'Valid'
  },
  blockchainHash: {
    type: String,
    required: true,
    trim: true
  },
  ipfsHash: {
    type: String,
    trim: true
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  revokedDate: {
    type: Date
  },
  revokeReason: {
    type: String,
    trim: true
  },
  metadata: {
    version: {
      type: String,
      default: '1.0'
    },
    template: {
      type: String,
      default: 'standard'
    }
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

certificateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

certificateSchema.methods.revoke = async function(adminId, reason) {
  this.status = 'Revoked';
  this.revokedBy = adminId;
  this.revokedDate = new Date();
  this.revokeReason = reason;
  return await this.save();
};

certificateSchema.statics.generateCertificateId = function() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `CERT-${timestamp}-${random}`;
};

certificateSchema.statics.findValidByStudent = function(studentId) {
  return this.find({ studentId, status: 'Valid' }).populate('issuedBy', 'name email');
};

module.exports = mongoose.model('Certificate', certificateSchema);