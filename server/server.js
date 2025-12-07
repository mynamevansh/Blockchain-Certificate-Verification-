const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, seedInitialData } = require('./config/database');
dotenv.config();
const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://blockchain-certificate-verification.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed.replace('*', '')))) {
      callback(null, true);
    } else if (origin && origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/api/certificates', require('./routes/certificates'));
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Certificate Verification API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      admin: '/api/admin',
      users: '/api/users'
    },
    documentation: 'See README.md for API documentation'
  });
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  let error = { ...err };
  error.message = err.message;
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    error = { message, statusCode: 400 };
  }
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
});
const http = require('http');
const { Server } = require('socket.io');

const startServer = async () => {
  try {
    await connectDB();
    await seedInitialData();
    const PORT = process.env.PORT || 5000;

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        },
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Access-Control-Allow-Origin"]
      }
    });

    // Make io accessible to our router
    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('🔌 New client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log('');
      console.log('🚀 ================================');
      console.log('🚀 SERVER STARTED SUCCESSFULLY!');
      console.log('🚀 ================================');
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🔗 Local: http://localhost:${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log('🚀 ================================');
      console.log('');
      console.log('🔐 Initial Login Credentials:');
      console.log('📧 Admin: University_admin@university.edu / admin123');
      console.log('🎓 Students:');
      console.log('   • Vansh: vansh@university.edu / vansh123');
      console.log('   • Shashank: shashank@university.edu / shashank123');
      console.log('   • Shreyas: shreyas@university.edu / shreyas123');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
if (require.main === module) {
  startServer();
} else {
  let isConnected = false;
  const initializeServerless = async () => {
    if (!isConnected) {
      try {
        await connectDB();
        await seedInitialData();
        isConnected = true;
        console.log('✅ Serverless function initialized');
      } catch (error) {
        console.error('❌ Serverless initialization error:', error);
      }
    }
  };
  initializeServerless();
}
module.exports = app;
