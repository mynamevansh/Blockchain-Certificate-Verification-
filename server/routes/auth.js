const express = require('express');
const router = express.Router();
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
router.post('/logout', require('../middleware/auth').authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
module.exports = router;
