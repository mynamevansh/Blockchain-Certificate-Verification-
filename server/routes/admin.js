const express = require('express');
const router = express.Router();
const {
  adminLogin,
  adminRegister,
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins
} = require('../controllers/adminController');
const { authenticateAdmin, requirePermission } = require('../middleware/auth');

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', adminLogin);

// @route   POST /api/admin/register
// @desc    Register new admin (Super Admin only)
// @access  Private (Super Admin)
router.post('/register', authenticateAdmin, requirePermission('manage_users'), adminRegister);

// @route   GET /api/admin/profile
// @desc    Get admin profile
// @access  Private (Admin)
router.get('/profile', authenticateAdmin, getAdminProfile);

// @route   PUT /api/admin/profile
// @desc    Update admin profile
// @access  Private (Admin)
router.put('/profile', authenticateAdmin, updateAdminProfile);

// @route   GET /api/admin/all
// @desc    Get all admins
// @access  Private (Super Admin)
router.get('/all', authenticateAdmin, requirePermission('manage_users'), getAllAdmins);

module.exports = router;