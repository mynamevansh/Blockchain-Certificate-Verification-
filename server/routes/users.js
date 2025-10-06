const express = require('express');
const router = express.Router();
const {
  userLogin,
  userRegister,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserCertificates
} = require('../controllers/userController');
const { authenticateStudent, authenticateAdmin, requirePermission } = require('../middleware/auth');

// @route   POST /api/users/login
// @desc    User login
// @access  Public
router.post('/login', userLogin);

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', userRegister);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private (Student)
router.get('/profile', authenticateStudent, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private (Student)
router.put('/profile', authenticateStudent, updateUserProfile);

// @route   GET /api/users/certificates
// @desc    Get user certificates
// @access  Private (Student)
router.get('/certificates', authenticateStudent, getUserCertificates);

// @route   GET /api/users/all
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/all', authenticateAdmin, requirePermission('view_users'), getAllUsers);

module.exports = router;