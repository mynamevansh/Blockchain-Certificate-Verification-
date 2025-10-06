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
router.post('/login', adminLogin);
router.post('/register', authenticateAdmin, requirePermission('manage_users'), adminRegister);
router.get('/profile', authenticateAdmin, getAdminProfile);
router.put('/profile', authenticateAdmin, updateAdminProfile);
router.get('/all', authenticateAdmin, requirePermission('manage_users'), getAllAdmins);
module.exports = router;
