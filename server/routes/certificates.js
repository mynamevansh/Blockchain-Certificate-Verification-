const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const upload = require('../middleware/upload');
const { uploadToPinata } = require('../utils/pinata');
const blockchainService = require('../services/blockchain');
const crypto = require('crypto');
const fs = require('fs');
const calculateFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
};
router.post('/upload-ipfs', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    const { studentId, certificateHash } = req.body;
    if (!studentId) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }
    const student = await User.findOne({ studentId: studentId.toUpperCase() });
    if (!student) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    try {
      console.log('📤 Uploading to Pinata IPFS...');
      const pinataResult = await uploadToPinata(req.file.path, {
        name: `CERT-${studentId}-${Date.now()}`,
        keyvalues: {
          studentId: student.studentId,
          studentName: student.name,
          issuer: req.user.email,
          hash: certificateHash || 'pending'
        }
      });
      const ipfsCID = pinataResult.IpfsHash;
      console.log('✅ Uploaded to IPFS. CID:', ipfsCID);
      fs.unlinkSync(req.file.path);
      res.json({
        success: true,
        message: 'File uploaded to IPFS successfully',
        data: {
          ipfsCID,
          studentId: student.studentId,
          studentName: student.name
        },
        ipfsCID
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ IPFS upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload to IPFS',
      error: error.message
    });
  }
});
router.post('/issue', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    const {
      studentId,
      course,
      degree,
      university,
      gpa,
      graduationDate,
      dean,
      registrar,
      ipfsCID,
      certificateHash,
      certificateId,
      transactionHash,
      issuerWallet
    } = req.body;
    if (!studentId || !ipfsCID || !certificateHash || !certificateId || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, ipfsCID, certificateHash, certificateId, transactionHash'
      });
    }
    const student = await User.findOne({ studentId: studentId.toUpperCase() });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    const certificate = new Certificate({
      certificateId,
      studentId: student.studentId,
      studentName: student.name,
      studentEmail: student.email,
      course: course || 'N/A',
      degree: degree || 'N/A',
      university: university || 'University of Excellence',
      gpa: gpa || null,
      graduationDate: graduationDate || new Date(),
      dean: dean || 'Dr. John Anderson',
      registrar: registrar || 'Mary Johnson',
      status: 'Valid',
      issuedDate: new Date(),
      blockchainHash: certificateHash,
      ipfsHash: ipfsCID,
      fileHash: certificateHash,
      issuedBy: req.user.id,
      transactionHash: transactionHash,
      issuerWallet: issuerWallet
    });
    await certificate.save();
    console.log('✅ Certificate saved to database');
    const io = req.app.get('io');
    if (io) {
      io.emit('notification', {
        type: 'success',
        title: 'New Certificate Issued',
        message: `Certificate ${certificateId} has been issued to ${student.name}`,
        data: { certificateId, studentName: student.name }
      });
    }

    res.json({
      success: true,
      message: 'Certificate saved to database successfully',
      data: {
        certificateId,
        ipfsCID,
        fileHash: certificateHash,
        studentId: student.studentId,
        studentName: student.name,
        transactionHash
      }
    });
  } catch (error) {
    console.error('❌ Certificate save error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save certificate to database',
      error: error.message
    });
  }
});
router.get('/student/:studentId', authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;
    if (req.user.role === 'student' && req.user.studentId !== studentId.toUpperCase()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own certificates.'
      });
    }
    try {
      const blockchainCertificates = await blockchainService.getStudentCertificates(studentId.toUpperCase());
      const dbCertificates = await Certificate.find({ studentId: studentId.toUpperCase() })
        .sort({ issuedDate: -1 });
      const certificates = blockchainCertificates.map(bcCert => {
        const dbCert = dbCertificates.find(db => db.certificateId === bcCert.certificateId);
        return {
          ...bcCert,
          course: dbCert?.course,
          degree: dbCert?.degree,
          university: dbCert?.university,
          gpa: dbCert?.gpa,
          graduationDate: dbCert?.graduationDate
        };
      });
      res.json({
        success: true,
        data: certificates
      });
    } catch (blockchainError) {
      console.error('Blockchain fetch error:', blockchainError);
      const dbCertificates = await Certificate.find({ studentId: studentId.toUpperCase() })
        .sort({ issuedDate: -1 });
      res.json({
        success: true,
        data: dbCertificates.map(cert => ({
          certificateId: cert.certificateId,
          certificateHash: cert.fileHash,
          ipfsCID: cert.ipfsHash,
          studentId: cert.studentId,
          studentName: cert.studentName,
          status: cert.status === 'Valid' ? 'Active' : cert.status,
          isValid: cert.status === 'Valid',
          issuedAt: cert.issuedDate.toISOString(),
          course: cert.course,
          degree: cert.degree,
          university: cert.university,
          gpa: cert.gpa,
          graduationDate: cert.graduationDate
        })),
        warning: 'Blockchain data unavailable, showing database records only'
      });
    }
  } catch (error) {
    console.error('Get student certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message
    });
  }
});
router.get('/public-verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: 'Certificate ID is required'
      });
    }
    try {
      const blockchainCert = await blockchainService.verifyCertificate(certificateId);
      if (!blockchainCert || blockchainCert.status === 'Unknown') {
        return res.json({
          success: true,
          found: false,
          isValid: false,
          message: 'Certificate not found on blockchain'
        });
      }
      const isActive = blockchainCert.status === 'Active';
      res.json({
        success: true,
        found: true,
        isValid: isActive,
        message: isActive
          ? '✓ Certificate is authentic'
          : '✗ Certificate has been revoked',
        data: {
          certificateId: blockchainCert.certificateId,
          studentName: blockchainCert.studentName,
          studentId: blockchainCert.studentId,
          status: blockchainCert.status,
          issuedAt: blockchainCert.issuedAt,
          ipfsCID: blockchainCert.ipfsCID,
          blockchainHash: blockchainCert.certificateHash,
          issuerAddress: blockchainCert.issuerAddress
        }
      });
    } catch (blockchainError) {
      console.error('Blockchain verification error:', blockchainError);
      const dbCert = await Certificate.findOne({ certificateId });
      if (!dbCert) {
        return res.json({
          success: true,
          found: false,
          isValid: false,
          message: 'Certificate not found'
        });
      }
      const isValid = dbCert.status === 'Valid';
      res.json({
        success: true,
        found: true,
        isValid,
        message: isValid
          ? '✓ Certificate is authentic'
          : '✗ Certificate has been revoked',
        data: {
          certificateId: dbCert.certificateId,
          studentName: dbCert.studentName,
          studentId: dbCert.studentId,
          status: dbCert.status,
          issuedAt: dbCert.issuedDate,
          ipfsCID: dbCert.ipfsHash,
          blockchainHash: dbCert.fileHash,
          warning: 'Verified from database only (blockchain unavailable)'
        }
      });
    }
  } catch (error) {
    console.error('Public verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    });
  }
});
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: 'Certificate ID is required'
      });
    }
    try {
      const blockchainCert = await blockchainService.verifyCertificate(certificateId);
      if (!blockchainCert || blockchainCert.status === 'Unknown') {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found'
        });
      }
      const dbCert = await Certificate.findOne({ certificateId });
      const responseData = {
        certificateId: blockchainCert.certificateId,
        studentName: blockchainCert.studentName,
        studentId: blockchainCert.studentId,
        course: dbCert?.course || 'N/A',
        degree: dbCert?.degree || 'N/A',
        university: dbCert?.university || 'University',
        status: blockchainCert.status,
        issuedAt: blockchainCert.issuedAt,
        issuedDate: blockchainCert.issuedAt,
        ipfsCID: blockchainCert.ipfsCID,
        ipfsHash: blockchainCert.ipfsCID,
        certificateHash: blockchainCert.certificateHash,
        fileHash: blockchainCert.certificateHash,
        issuerAddress: blockchainCert.issuerAddress
      };
      return res.json({
        success: true,
        data: responseData,
        certificate: responseData
      });
    } catch (blockchainError) {
      console.error('Blockchain verification error:', blockchainError);
      const dbCert = await Certificate.findOne({ certificateId });
      if (!dbCert) {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found'
        });
      }
      const responseData = {
        certificateId: dbCert.certificateId,
        studentName: dbCert.studentName,
        studentId: dbCert.studentId,
        course: dbCert.course,
        degree: dbCert.degree,
        university: dbCert.university,
        status: dbCert.status === 'Valid' ? 'Active' : dbCert.status,
        issuedAt: dbCert.issuedDate,
        issuedDate: dbCert.issuedDate,
        ipfsCID: dbCert.ipfsHash,
        ipfsHash: dbCert.ipfsHash,
        certificateHash: dbCert.fileHash,
        fileHash: dbCert.fileHash,
        warning: 'Verified from database only (blockchain unavailable)'
      };
      return res.json({
        success: true,
        data: responseData,
        certificate: responseData
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    });
  }
});
router.post('/verify', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded for verification'
      });
    }
    const uploadedFileHash = await calculateFileHash(req.file.path);
    fs.unlinkSync(req.file.path);
    const certificateId = req.body.certificateId || req.query.certificateId;
    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: 'Certificate ID is required'
      });
    }
    try {
      const blockchainCert = await blockchainService.verifyCertificate(certificateId);
      if (!blockchainCert || blockchainCert.status === 'Unknown') {
        return res.json({
          success: true,
          isValid: false,
          message: 'Certificate not found on blockchain',
          uploadedHash: uploadedFileHash,
          blockchainHash: null
        });
      }
      const hashMatch = uploadedFileHash.toLowerCase() === blockchainCert.certificateHash.toLowerCase();
      const isActive = blockchainCert.status === 'Active';
      res.json({
        success: true,
        isValid: hashMatch && isActive,
        message: hashMatch && isActive
          ? '✓ Certificate is authentic'
          : hashMatch
            ? '✗ Certificate has been revoked'
            : '✗ Fake PDF File - Hash mismatch',
        data: {
          certificateId: blockchainCert.certificateId,
          studentName: blockchainCert.studentName,
          studentId: blockchainCert.studentId,
          status: blockchainCert.status,
          issuedAt: blockchainCert.issuedAt,
          ipfsCID: blockchainCert.ipfsCID,
          uploadedHash: uploadedFileHash,
          blockchainHash: blockchainCert.certificateHash,
          hashMatch
        }
      });
    } catch (blockchainError) {
      console.error('Blockchain verification error:', blockchainError);
      const dbCert = await Certificate.findOne({ certificateId });
      if (!dbCert) {
        return res.json({
          success: true,
          isValid: false,
          message: 'Certificate not found',
          uploadedHash: uploadedFileHash
        });
      }
      const hashMatch = uploadedFileHash.toLowerCase() === dbCert.fileHash.toLowerCase();
      const isValid = hashMatch && dbCert.status === 'Valid';
      res.json({
        success: true,
        isValid,
        message: isValid
          ? '✓ Certificate is authentic'
          : hashMatch
            ? '✗ Certificate has been revoked'
            : '✗ Fake PDF File - Hash mismatch',
        data: {
          certificateId: dbCert.certificateId,
          studentName: dbCert.studentName,
          studentId: dbCert.studentId,
          status: dbCert.status,
          issuedAt: dbCert.issuedDate,
          ipfsCID: dbCert.ipfsHash,
          uploadedHash: uploadedFileHash,
          blockchainHash: dbCert.fileHash,
          hashMatch,
          warning: 'Verified from database only (blockchain unavailable)'
        }
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    });
  }
});
router.get('/admin', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .populate('issuedBy', 'name email');
    res.json({
      success: true,
      data: certificates
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
router.get('/students', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    const students = await User.find({
      role: 'student',
      isActive: true,
      $or: [
        { name: { $regex: /^Shashank/i } },
        { name: { $regex: /^Shreyas/i } },
        { name: { $regex: /^Vansh/i } }
      ]
    }).select('name email studentId');
    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
});
router.patch('/activate/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    const { id } = req.params;
    const certificate = await Certificate.findOne({ certificateId: id });
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    if (certificate.status === 'Valid') {
      return res.status(400).json({
        success: false,
        message: 'Certificate is already active'
      });
    }
    if (certificate.status !== 'Revoked') {
      return res.status(400).json({
        success: false,
        message: 'Certificate must be revoked to activate'
      });
    }
    let blockchainResult = null;
    try {
      blockchainResult = await blockchainService.activateCertificate(id);
      console.log('✅ Certificate activated on blockchain:', blockchainResult.transactionHash);
    } catch (blockchainError) {
      console.error('⚠️ Blockchain activation failed:', blockchainError.message);
    }
    certificate.status = 'Valid';
    certificate.reactivatedAt = new Date();
    if (blockchainResult?.transactionHash) {
      certificate.activationTransactionHash = blockchainResult.transactionHash;
    }
    await certificate.save();
    const io = req.app.get('io');
    if (io) {
      io.emit('notification', {
        type: 'success',
        title: 'Certificate Activated',
        message: `Certificate ${certificate.certificateId} has been reactivated`,
        data: { certificateId: certificate.certificateId }
      });
    }

    res.json({
      success: true,
      message: 'Certificate activated successfully',
      data: {
        certificateId: certificate.certificateId,
        status: certificate.status,
        reactivatedAt: certificate.reactivatedAt,
        transactionHash: blockchainResult?.transactionHash || null,
        blockchainActivated: !!blockchainResult
      }
    });
  } catch (error) {
    console.error('❌ Certificate activation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate certificate',
      error: error.message
    });
  }
});
router.patch('/revoke/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    const { id } = req.params;
    const { reason } = req.body;
    const certificate = await Certificate.findOne({ certificateId: id });
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
    let blockchainResult = null;
    try {
      blockchainResult = await blockchainService.revokeCertificate(id);
      console.log('✅ Certificate revoked on blockchain:', blockchainResult.transactionHash);
    } catch (blockchainError) {
      console.error('⚠️ Blockchain revocation failed:', blockchainError.message);
    }
    certificate.status = 'Revoked';
    certificate.revokedBy = req.user.id;
    certificate.revokedDate = new Date();
    if (reason) {
      certificate.revokeReason = reason;
    }
    if (blockchainResult?.transactionHash) {
      certificate.revocationTransactionHash = blockchainResult.transactionHash;
    }
    await certificate.save();
    const io = req.app.get('io');
    if (io) {
      io.emit('notification', {
        type: 'info',
        title: 'Certificate Revoked',
        message: `Certificate ${certificate.certificateId} has been revoked`,
        data: { certificateId: certificate.certificateId }
      });
    }

    res.json({
      success: true,
      message: 'Certificate revoked successfully',
      data: {
        certificateId: certificate.certificateId,
        status: certificate.status,
        revokedAt: certificate.revokedDate,
        transactionHash: blockchainResult?.transactionHash || null,
        blockchainRevoked: !!blockchainResult
      }
    });
  } catch (error) {
    console.error('❌ Certificate revocation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke certificate',
      error: error.message
    });
  }
});
module.exports = router;
