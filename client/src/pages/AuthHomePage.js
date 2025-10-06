import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import useNavigateWithLoading from '../hooks/useNavigateWithLoading';
import { ShieldCheck, GraduationCap, Users, FileCheck, ChevronRight, Eye, EyeOff } from 'lucide-react';

const AuthHomePage = () => {
  const navigateWithLoading = useNavigateWithLoading();
  const { hideLoading } = useLoading();
  const { loginAsAdmin, loginAsUser, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    // Cleanup: dismiss all auth-related toasts when component unmounts (page change)
    return () => {
      toast.dismiss();
    };
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (activeTab === 'admin') {
        await loginAsAdmin(formData.email, formData.password, formData.rememberMe);
        navigateWithLoading('/admin-dashboard', {
          message: 'Loading Admin Dashboard...',
          delay: 500
        });
      } else {
        await loginAsUser(formData.email, formData.password, formData.rememberMe);
        navigateWithLoading('/student-dashboard', {
          message: 'Loading Student Dashboard...',
          delay: 500
        });
      }
    } catch (error) {
      // Error is already handled in the auth context
    }
  };

  // Quick fill demo credentials
  const fillDemoCredentials = () => {
    if (activeTab === 'admin') {
      setFormData({
        email: 'University_admin@university.edu',
        password: 'admin123',
        rememberMe: false
      });
    } else {
      setFormData({
        email: 'student@university.edu',
        password: 'demostudent',
        rememberMe: false
      });
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

        {/* Login Form */}
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => {
                setActiveTab('admin');
                setFormData({ email: '', password: '', rememberMe: false });
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: activeTab === 'admin' ? 'white' : 'transparent',
                color: activeTab === 'admin' ? '#1e293b' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'admin' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              <ShieldCheck size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Administrator
            </button>
            <button
              onClick={() => {
                setActiveTab('student');
                setFormData({ email: '', password: '', rememberMe: false });
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: activeTab === 'student' ? 'white' : 'transparent',
                color: activeTab === 'student' ? '#1e293b' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'student' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              <GraduationCap size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Student
            </button>
          </div>

          {/* Form Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: activeTab === 'admin' ? '#eff6ff' : '#ecfdf5',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              {activeTab === 'admin' ? (
                <ShieldCheck size={32} style={{ color: '#3b82f6' }} />
              ) : (
                <GraduationCap size={32} style={{ color: '#10b981' }} />
              )}
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 0.5rem 0'
            }}>
              {activeTab === 'admin' ? 'Administrator Login' : 'Student Login'}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0
            }}>
              {activeTab === 'admin' 
                ? 'Sign in to manage certificates and users'
                : 'Sign in to view your certificates'
              }
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder={activeTab === 'admin' ? 'admin@university.edu' : 'student@university.edu'}
                onFocus={(e) => e.target.style.borderColor = activeTab === 'admin' ? '#3b82f6' : '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '3rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your password"
                  onFocus={(e) => e.target.style.borderColor = activeTab === 'admin' ? '#3b82f6' : '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="rememberMe" style={{
                fontSize: '0.875rem',
                color: '#374151',
                cursor: 'pointer'
              }}>
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.875rem',
                backgroundColor: isLoading ? '#9ca3af' : (activeTab === 'admin' ? '#3b82f6' : '#10b981'),
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? (
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
                `Sign In as ${activeTab === 'admin' ? 'Administrator' : 'Student'}`
              )}
            </button>

            {/* Demo Credentials Button */}
            <button
              type="button"
              onClick={fillDemoCredentials}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: activeTab === 'admin' ? '#3b82f6' : '#10b981',
                border: `1px solid ${activeTab === 'admin' ? '#3b82f6' : '#10b981'}`,
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = activeTab === 'admin' ? '#3b82f6' : '#10b981';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = activeTab === 'admin' ? '#3b82f6' : '#10b981';
              }}
            >
              Fill Demo Credentials
            </button>
          </form>
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
            margin: '0 0 1rem 0',
            fontFamily: 'Open Sans, sans-serif'
          }}>
            <strong>🔒 MongoDB Authentication System:</strong> Use the credentials below or click "Fill Demo Credentials" to auto-populate the form.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #dbeafe'
            }}>
              <p style={{
                fontSize: '0.75rem',
                color: '#1e40af',
                margin: '0 0 0.25rem 0',
                fontWeight: '600'
              }}>Admin Login:</p>
              <p style={{
                fontSize: '0.75rem',
                color: '#3730a3',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                University_admin@university.edu<br/>
                admin123
              </p>
            </div>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#ecfdf5',
              borderRadius: '8px',
              border: '1px solid #d1fae5'
            }}>
              <p style={{
                fontSize: '0.75rem',
                color: '#047857',
                margin: '0 0 0.25rem 0',
                fontWeight: '600'
              }}>Student Login:</p>
              <p style={{
                fontSize: '0.75rem',
                color: '#065f46',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                student@university.edu<br/>
                demostudent
              </p>
            </div>
          </div>
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