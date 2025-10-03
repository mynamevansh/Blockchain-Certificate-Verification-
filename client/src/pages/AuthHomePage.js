import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import useNavigateWithLoading from '../hooks/useNavigateWithLoading';
import { ShieldCheck, GraduationCap, Users, FileCheck, ChevronRight } from 'lucide-react';

const AuthHomePage = () => {
  const navigateWithLoading = useNavigateWithLoading();
  const { hideLoading } = useLoading();
  const [signingIn, setSigningIn] = useState(null);

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    // Cleanup: dismiss all auth-related toasts when component unmounts (page change)
    return () => {
      toast.dismiss('admin-signin');
      toast.dismiss('student-signin');
      toast.dismiss(); // Clear any remaining toasts to prevent overlap
    };
  }, []);

  const handleAdminSignIn = async () => {
    setSigningIn('admin');
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user type in localStorage for demo
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('user', JSON.stringify({
        id: 'admin1',
        name: 'System Administrator',
        email: 'admin@university.edu',
        role: 'admin'
      }));
      
      // Show success toast immediately after authentication
      toast.success('Signed in as Administrator! Redirecting...', {
        autoClose: 2500, // Stay visible for 2.5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false, // Don't pause to ensure consistent timing
        draggable: true,
        toastId: 'admin-signin' // Unique ID to prevent duplicates
      });
      
      // Clear signing state
      setSigningIn(null);
      
      // Wait for user to see the success message
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Auto-dismiss toast before navigation
      toast.dismiss('admin-signin');
      
      // Start navigation with loading
      navigateWithLoading('/admin-dashboard', {
        message: 'Loading Admin Dashboard...',
        delay: 300
      });
      
    } catch (error) {
      toast.error('Sign in failed. Please try again.');
      setSigningIn(null);
    }
  };

  const handleStudentSignIn = async () => {
    setSigningIn('student');
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user type in localStorage for demo
      localStorage.setItem('userType', 'student');
      localStorage.setItem('user', JSON.stringify({
        id: 'student1',
        name: 'John Smith',
        email: 'john.smith@student.university.edu',
        role: 'student'
      }));
      
      // Show success toast immediately after authentication
      toast.success('Signed in as Student! Redirecting...', {
        autoClose: 2500, // Stay visible for 2.5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false, // Don't pause to ensure consistent timing
        draggable: true,
        toastId: 'student-signin' // Unique ID to prevent duplicates
      });
      
      // Clear signing state
      setSigningIn(null);
      
      // Wait for user to see the success message
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Auto-dismiss toast before navigation
      toast.dismiss('student-signin');
      
      // Start navigation with loading
      navigateWithLoading('/student-dashboard', {
        message: 'Loading Student Dashboard...',
        delay: 300
      });
      
    } catch (error) {
      toast.error('Sign in failed. Please try again.');
      setSigningIn(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Top Navbar */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={32} style={{ color: '#3b82f6' }} />
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0,
              fontFamily: 'Roboto, sans-serif'
            }}>
              CertifyChain
            </h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '4rem 1.5rem'
      }}>
        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.75rem',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 1.5rem 0',
            fontFamily: 'Roboto, sans-serif',
            lineHeight: '1.2'
          }}>
            University Certificate Management System
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            maxWidth: '700px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.6',
            fontFamily: 'Open Sans, sans-serif'
          }}>
            Secure, blockchain-powered certificate verification and management platform.
            Issue, verify, and manage academic credentials with complete transparency and authenticity.
          </p>

          {/* Feature Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <FileCheck size={32} style={{ color: '#10b981', margin: '0 auto 0.75rem auto' }} />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                Instant Verification
              </h4>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0,
                fontFamily: 'Open Sans, sans-serif'
              }}>
                Verify certificates in seconds with blockchain technology
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <ShieldCheck size={32} style={{ color: '#3b82f6', margin: '0 auto 0.75rem auto' }} />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                Secure & Tamper-Proof
              </h4>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0,
                fontFamily: 'Open Sans, sans-serif'
              }}>
                Immutable records ensure authenticity
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Users size={32} style={{ color: '#8b5cf6', margin: '0 auto 0.75rem auto' }} />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                Role-Based Access
              </h4>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0,
                fontFamily: 'Open Sans, sans-serif'
              }}>
                Separate portals for administrators and students
              </p>
            </div>
          </div>
        </div>

        {/* Sign In Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Admin Sign In */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)'
            }} />
            
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#eff6ff',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <ShieldCheck size={32} style={{ color: '#3b82f6' }} />
            </div>

            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 0.75rem 0',
              fontFamily: 'Roboto, sans-serif'
            }}>
              Administrator Portal
            </h3>
            
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: '0 0 2rem 0',
              fontFamily: 'Open Sans, sans-serif',
              lineHeight: '1.5'
            }}>
              Full system access for university staff. Manage certificates, verify credentials, and oversee user accounts.
            </p>

            <ul style={{
              textAlign: 'left',
              margin: '0 0 2rem 0',
              padding: 0,
              listStyle: 'none'
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                color: '#475569',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                <ChevronRight size={14} style={{ color: '#3b82f6' }} />
                Issue and manage certificates
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                color: '#475569',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                <ChevronRight size={14} style={{ color: '#3b82f6' }} />
                Verify and revoke certificates
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                color: '#475569',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                <ChevronRight size={14} style={{ color: '#3b82f6' }} />
                User management and analytics
              </li>
            </ul>

            <button
              onClick={handleAdminSignIn}
              disabled={signingIn === 'admin'}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                backgroundColor: signingIn === 'admin' ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: signingIn === 'admin' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Roboto, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (signingIn !== 'admin') {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (signingIn !== 'admin') {
                  e.target.style.backgroundColor = '#3b82f6';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {signingIn === 'admin' ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Signing In...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Sign in as Admin
                </>
              )}
            </button>
          </div>

          {/* Student Sign In */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10b981, #047857)'
            }} />
            
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#ecfdf5',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <GraduationCap size={32} style={{ color: '#10b981' }} />
            </div>

            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 0.75rem 0',
              fontFamily: 'Roboto, sans-serif'
            }}>
              Student Portal
            </h3>
            
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: '0 0 2rem 0',
              fontFamily: 'Open Sans, sans-serif',
              lineHeight: '1.5'
            }}>
              View and manage your academic certificates. Access your credential history and verification status.
            </p>

            <ul style={{
              textAlign: 'left',
              margin: '0 0 2rem 0',
              padding: 0,
              listStyle: 'none'
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                color: '#475569',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                <ChevronRight size={14} style={{ color: '#10b981' }} />
                View your certificates
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                color: '#475569',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                <ChevronRight size={14} style={{ color: '#10b981' }} />
                Download credential proofs
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                color: '#475569',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                <ChevronRight size={14} style={{ color: '#10b981' }} />
                Share verification links
              </li>
            </ul>

            <button
              onClick={handleStudentSignIn}
              disabled={signingIn === 'student'}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                backgroundColor: signingIn === 'student' ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: signingIn === 'student' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Roboto, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (signingIn !== 'student') {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (signingIn !== 'student') {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {signingIn === 'student' ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Signing In...
                </>
              ) : (
                <>
                  <GraduationCap size={18} />
                  Sign in as Student
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: 0,
            fontFamily: 'Open Sans, sans-serif'
          }}>
            <strong>Demo System:</strong> This is a demonstration of the certificate management system.
            Both admin and student portals are pre-configured for testing purposes.
          </p>
        </div>
      </main>

      {/* CSS Animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthHomePage;