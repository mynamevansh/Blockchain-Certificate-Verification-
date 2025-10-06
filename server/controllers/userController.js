const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findActiveByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      studentId: user.studentId
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          program: user.program,
          department: user.department,
          status: user.status,
          enrollmentDate: user.enrollmentDate,
          expectedGraduation: user.expectedGraduation,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// User Registration
const userRegister = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      studentId, 
      program, 
      department, 
      enrollmentDate, 
      expectedGraduation,
      phoneNumber,
      address 
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !studentId || !program || !department || !enrollmentDate || !expectedGraduation) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { studentId: studentId.toUpperCase() }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or student ID already exists'
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      studentId,
      program,
      department,
      enrollmentDate: new Date(enrollmentDate),
      expectedGraduation: new Date(expectedGraduation),
      phoneNumber,
      address,
      status: 'active'
    });

    await newUser.save();

    // Generate token
    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      studentId: newUser.studentId
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          studentId: newUser.studentId,
          role: newUser.role,
          program: newUser.program,
          department: newUser.department,
          status: newUser.status,
          enrollmentDate: newUser.enrollmentDate,
          expectedGraduation: newUser.expectedGraduation
        }
      }
    });

  } catch (error) {
    console.error('User registration error:', error);
    
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

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('certificates.certificateId', 'certificateId course degree issuedDate status');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          program: user.program,
          department: user.department,
          status: user.status,
          enrollmentDate: user.enrollmentDate,
          expectedGraduation: user.expectedGraduation,
          phoneNumber: user.phoneNumber,
          address: user.address,
          certificates: user.certificates,
          profileImage: user.profileImage,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (address) updates.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          program: user.program,
          department: user.department,
          phoneNumber: user.phoneNumber,
          address: user.address
        }
      }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, program, department } = req.query;
    const query = { isActive: true };
    
    // Add filters
    if (status) query.status = status;
    if (program) query.program = new RegExp(program, 'i');
    if (department) query.department = new RegExp(department, 'i');

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          program: user.program,
          department: user.department,
          status: user.status,
          enrollmentDate: user.enrollmentDate,
          expectedGraduation: user.expectedGraduation,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get User Certificates
const getUserCertificates = async (req, res) => {
  try {
    const Certificate = require('../models/Certificate');
    
    const certificates = await Certificate.findValidByStudent(req.user._id);

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: {
        certificates
      }
    });

  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  userLogin,
  userRegister,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserCertificates
};