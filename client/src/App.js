import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/professional.css';

import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/SimpleWebSocketContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';

import LoadingSpinner from './components/LoadingSpinner';
import HomePage from './pages/HomePage';
import AuthHomePage from './pages/AuthHomePage';
import AdminDashboard from './pages/NewAdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProfessionalHome from './pages/ProfessionalHome';
import Upload from './pages/Upload';
import ProfessionalVerify from './pages/ProfessionalVerify';
import ProfessionalRevoke from './pages/ProfessionalRevoke';
import ProfessionalDashboard from './pages/ProfessionalDashboard';

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

function AppContent() {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <>
      <LoadingSpinner show={isLoading} message={loadingMessage} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthHomePage />} />
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
        
        <Route path="/home" element={<ProfessionalHome />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/verify" element={<ProfessionalVerify />} />
        <Route path="/revoke" element={<ProfessionalRevoke />} />
        <Route path="/dashboard" element={<ProfessionalDashboard />} />
        
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
    </>
  );
}

function App() {
  return (
    <Router
      future={{
        // React Router v7 Compatibility Flags
        v7_startTransition: true,       // ✅ Wraps state updates in React.startTransition
        v7_relativeSplatPath: true,     // ✅ New relative path resolution in splat routes
        v7_fetcherPersist: true,        // ✅ Persist fetchers across route changes
        v7_normalizeFormMethod: true,   // ✅ Normalize form methods to uppercase
        v7_partialHydration: true,      // ✅ Support partial hydration (SSR)
      }}
    >
      <AuthProvider>
        <WebSocketProvider>
          <LoadingProvider>
            <AppContent />
          </LoadingProvider>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;