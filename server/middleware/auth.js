const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// General authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided or invalid format.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Find user based on role
    let user;
    if (decoded.role === 'admin' || decoded.role === 'super_admin') {
      user = await Admin.findById(decoded.id).select('-password');
    } else {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.'
      });
    }

    // Add user to request object
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Admin-only authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    // First run general authentication
    await authenticate(req, res, () => {
      // Check if user is admin
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Student-only authentication middleware
const authenticateStudent = async (req, res, next) => {
  try {
    // First run general authentication
    await authenticate(req, res, () => {
      // Check if user is student
      if (!req.user || req.user.role !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Student privileges required.'
        });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Permission-based middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Check if user has the required permission (for admins)
    if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      if (!req.user.permissions || !req.user.permissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${permission}`
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authenticateAdmin,
  authenticateStudent,
  requirePermission
};