const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Certificate = require('../models/Certificate');
router.post('/upload', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    const {
      studentName,
      studentId,
      studentEmail,
      course,
      degree,
      gpa,
      graduationDate,
      university,
      dean,
      registrar
    } = req.body;
    if (!studentName || !course || !degree) {
      return res.status(400).json({
        success: false,
        message: 'Student name, course, and degree are required'
      });
    }
    const certificateId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const certificate = new Certificate({
      certificateId,
      studentName,
      studentId,
      studentEmail,
      course,
      degree,
      gpa: gpa || null,
      graduationDate: graduationDate || null,
      university: university || 'University of Excellence',
      dean: dean || 'Dr. John Anderson',
      registrar: registrar || 'Mary Johnson',
      issuer: req.user.email,
      issuerId: req.user.id,
      status: 'Valid',
      issuedDate: new Date(),
      blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`
    });
    await certificate.save();
    res.json({
      success: true,
      message: 'Certificate issued successfully',
      data: {
        id: certificate.certificateId,
        ...req.body,
        issuedDate: certificate.issuedDate,
        status: certificate.status
      }
    });
  } catch (error) {
    console.error('Certificate creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to issue certificate',
      error: error.message
    });
  }
});
router.get('/admin', authenticate, async (req, res) => {
  try {
    console.log('🔍 Admin certificates request:', {
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      timestamp: new Date().toISOString()
    });
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      console.log('❌ Access denied for user:', req.user.role);
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.',
        debug: {
          userRole: req.user.role,
          requiredRole: 'admin or super_admin'
        }
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Certificate.countDocuments();
    res.json({
      success: true,
      data: certificates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message
    });
  }
});
router.get('/user', authenticate, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const certificates = await Certificate.find({ 
      studentEmail: userEmail 
    }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your certificates',
      error: error.message
    });
  }
});
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    res.json({
      success: true,
      data: {
        isValid: certificate.status === 'Valid',
        certificate: {
          certificateId: certificate.certificateId,
          studentName: certificate.studentName,
          course: certificate.course,
          degree: certificate.degree,
          university: certificate.university,
          issuedDate: certificate.issuedDate,
          status: certificate.status
        }
      }
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate',
      error: error.message
    });
  }
});
router.post('/:certificateId/revoke', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    const { certificateId } = req.params;
    const { reason } = req.body;
    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    if (certificate.status === 'Revoked') {
      return res.status(400).json({
        success: false,
        message: 'Certificate is already revoked'
      });
    }
    certificate.status = 'Revoked';
    certificate.revokedDate = new Date();
    certificate.revokedBy = req.user.email;
    certificate.revocationReason = reason || 'No reason provided';
    await certificate.save();
    res.json({
      success: true,
      message: 'Certificate revoked successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Certificate revocation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke certificate',
      error: error.message
    });
  }
});
router.get('/stats', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    const total = await Certificate.countDocuments();
    const active = await Certificate.countDocuments({ status: 'Valid' });
    const revoked = await Certificate.countDocuments({ status: 'Revoked' });
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    const monthlyIssued = await Certificate.countDocuments({
      createdAt: { $gte: currentMonth }
    });
    res.json({
      success: true,
      data: {
        total,
        active,
        revoked,
        monthlyIssued,
        pending: 0 // Placeholder for future use
      }
    });
  } catch (error) {
    console.error('Get certificate stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate statistics',
      error: error.message
    });
  }
});
module.exports = router;
