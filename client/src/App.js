import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/professional.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/SimpleWebSocketContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';

// Components
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import AuthHomePage from './pages/AuthHomePage';
import AdminDashboard from './pages/NewAdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProfessionalHome from './pages/ProfessionalHome';
import ProfessionalUpload from './pages/ProfessionalUpload';
import ProfessionalVerify from './pages/ProfessionalVerify';
import ProfessionalRevoke from './pages/ProfessionalRevoke';
import ProfessionalDashboard from './pages/ProfessionalDashboard';

// Protected Route Component
function ProtectedRoute({ children, allowedRole }) {
  const userType = localStorage.getItem('userType');
  
  if (!userType) {
    return <Navigate to="/auth" replace />;
  }
  
  if (allowedRole && userType !== allowedRole) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

// Main App Component with Loading
function AppContent() {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <>
      <LoadingSpinner show={isLoading} message={loadingMessage} />
      <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthHomePage />} />
            
            {/* University System - Protected Routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy Professional Routes */}
            <Route path="/home" element={<ProfessionalHome />} />
            <Route path="/upload" element={<ProfessionalUpload />} />
            <Route path="/verify" element={<ProfessionalVerify />} />
            <Route path="/revoke" element={<ProfessionalRevoke />} />
            <Route path="/dashboard" element={<ProfessionalDashboard />} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <LoadingProvider>
          <AppContent />
        </LoadingProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;