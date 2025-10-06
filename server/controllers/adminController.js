const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin by email
    const admin = await Admin.findActiveByEmail(email);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate token
    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          department: admin.department,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin Registration (for super admins to create new admins)
const adminRegister = async (req, res) => {
  try {
    const { name, email, password, department, permissions } = req.body;

    // Validate input
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password,
      department,
      permissions: permissions || ['create_certificate', 'view_users'],
      role: 'admin'
    });

    await newAdmin.save();

    // Generate token
    const token = generateToken({
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        token,
        user: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          department: newAdmin.department,
          permissions: newAdmin.permissions
        }
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          department: admin.department,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update Admin Profile
const updateAdminProfile = async (req, res) => {
  try {
    const { name, department } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (department) updates.department = department;

    const admin = await Admin.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          department: admin.department,
          permissions: admin.permissions
        }
      }
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get All Admins (Super Admin only)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admins.length,
      data: {
        admins: admins.map(admin => ({
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          department: admin.department,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  adminLogin,
  adminRegister,
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins
};