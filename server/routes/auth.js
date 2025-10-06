const express = require('express');
const router = express.Router();

// @route   GET /api/auth/verify
// @desc    Verify token and get user info
// @access  Private
router.get('/verify', require('../middleware/auth').authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        ...(req.user.studentId && { studentId: req.user.studentId }),
        ...(req.user.department && { department: req.user.department })
      }
    }
  });
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', require('../middleware/auth').authenticate, (req, res) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just return success (client will remove the token)
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;