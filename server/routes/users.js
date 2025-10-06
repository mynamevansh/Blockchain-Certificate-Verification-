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
router.post('/login', userLogin);
router.post('/register', userRegister);
router.get('/profile', authenticateStudent, getUserProfile);
router.put('/profile', authenticateStudent, updateUserProfile);
router.get('/certificates', authenticateStudent, getUserCertificates);
router.get('/all', authenticateAdmin, requirePermission('view_users'), getAllUsers);
module.exports = router;
