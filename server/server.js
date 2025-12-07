const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, seedInitialData } = require('./config/database');

dotenv.config();
const app = express();

/* ---------------------------------------------
   CORS CONFIG
--------------------------------------------- */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
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

/* ---------------------------------------------
   BODY PARSING
--------------------------------------------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ---------------------------------------------
   REQUEST LOGGING (dev mode only)
--------------------------------------------- */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} -`, new Date().toISOString());
    next();
  });
}

/* ---------------------------------------------
   HEALTH CHECK
--------------------------------------------- */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/* ---------------------------------------------
   ROUTES
--------------------------------------------- */
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
      health: '/api/health',
      auth: '/api/auth',
      admin: '/api/admin',
      users: '/api/users',
      certificates: '/api/certificates'
    }
  });
});

/* ---------------------------------------------
   404 HANDLER
--------------------------------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

/* ---------------------------------------------
   GLOBAL ERROR HANDLER
--------------------------------------------- */
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);

  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    status = 400;
  }
  if (err.name === 'CastError') {
    message = 'Invalid ID format';
    status = 400;
  }

  res.status(status).json({ success: false, message });
});

/* ---------------------------------------------
   SOCKET.IO SETUP (CORE FIX)
--------------------------------------------- */
const http = require('http');
const { Server } = require('socket.io');

const startServer = async () => {
  try {
    await connectDB();

    // ⛔ Avoid seeding duplicates in production
    if (process.env.NODE_ENV === 'development') {
      await seedInitialData();
    }

    const PORT = process.env.PORT || 5000;
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",      // ⭐ FIX: works for localhost + Render deployments
        methods: ["GET", "POST"]
      }
    });

    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

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
      console.log('🔐 Initial Login Credentials (dev only):');
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

/* ---------------------------------------------
   PROCESS SAFETY
--------------------------------------------- */
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

/* ---------------------------------------------
   START SERVER
--------------------------------------------- */
if (require.main === module) {
  startServer();
} else {
  let isConnected = false;
  const initializeServerless = async () => {
    if (!isConnected) {
      try {
        await connectDB();
        isConnected = true;
        console.log('✅ Serverless initialized');
      } catch (error) {
        console.error('❌ Serverless init error:', error);
      }
    }
  };
  initializeServerless();
}

module.exports = app;
