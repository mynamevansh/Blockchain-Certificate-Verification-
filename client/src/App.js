import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/professional.css';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/SimpleWebSocketContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import LoadingSpinner from './components/LoadingSpinner';
import AuthHomePage from './pages/AuthHomePage';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
// import PublicVerify from './pages/PublicVerify'; // unused
import VerifyCertificate from './pages/VerifyCertificate';
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
        <Route path="/" element={<LandingPage />} />
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
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
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
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
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
