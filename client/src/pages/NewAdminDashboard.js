import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../constants';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Users, 
  Plus,
  Search,
  Download,
  Eye,
  LogOut,
  ShieldCheck,
  Settings,
  Menu,
  Home,
  Award,
  UserCheck,
  Activity
} from 'lucide-react';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { hideLoading } = useLoading();
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [certificateForm, setCertificateForm] = useState({
    studentName: '',
    studentId: '',
    studentEmail: '',
    course: '',
    degree: '',
    gpa: '',
    graduationDate: '',
    university: 'University of Excellence',
    dean: 'Dr. John Anderson',
    registrar: 'Mary Johnson'
  });
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    activeCertificates: 0,
    revokedCertificates: 0,
    totalUsers: 0,
    pendingRequests: 0,
    monthlyIssued: 0,
    systemUptime: '99.9%'
  });
  const loadDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userType = localStorage.getItem('userType');
      const userData = localStorage.getItem('user_data');
      console.log('🔍 Debug Auth Status:', {
        hasToken: !!token,
        userType,
        userData: userData ? JSON.parse(userData) : null,
        isAuthenticated,
        hasAdminRole: hasRole('admin')
      });
      if (!token) {
        console.error('❌ No auth token found');
        toast.error('Please log in to access admin features');
        navigate('/auth');
        return;
      }
      try {
        console.log('📡 Making request to', `${API_BASE_URL}/api/certificates/admin`, 'with token:', token.substring(0, 20) + '...');
        const certificatesResponse = await fetch(`${API_BASE_URL}/api/certificates/admin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('📈 Response Status:', certificatesResponse.status, certificatesResponse.statusText);
        if (certificatesResponse.ok) {
          const certificatesData = await certificatesResponse.json();
          console.log('✅ Certificates loaded:', certificatesData);
          setCertificates(certificatesData.data || []);
          updateStats(certificatesData.data || []);
        } else {
          const errorData = await certificatesResponse.text();
          console.error('❌ API Error:', certificatesResponse.status, errorData);
          if (certificatesResponse.status === 401) {
            toast.error('Session expired. Please log in again.');
            logout();
            navigate('/auth');
            return;
          } else if (certificatesResponse.status === 403) {
            toast.error('Access denied. Admin privileges required.');
            console.error('403 Forbidden - Check user role and permissions');
          } else {
            toast.error('Failed to load certificates');
          }
          setCertificates([]);
        }
      } catch (certError) {
        console.error('Certificate endpoint error:', certError);
        toast.error('Network error loading certificates');
        setCertificates([]);
      }
      setUsers([]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  }, [isAuthenticated, hasRole, navigate, logout]);
  const updateStats = (certificatesData) => {
    const total = certificatesData.length;
    const active = certificatesData.filter(cert => cert.status === 'Valid').length;
    const revoked = certificatesData.filter(cert => cert.status === 'Revoked').length;
    setStats(prev => ({
      ...prev,
      totalCertificates: total,
      activeCertificates: active,
      revokedCertificates: revoked,
      monthlyIssued: certificatesData.filter(cert => {
        const issueDate = new Date(cert.issuedDate);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return issueDate.getMonth() === currentMonth && issueDate.getFullYear() === currentYear;
      }).length
    }));
  };
  useEffect(() => {
    hideLoading();
    if (!isAuthenticated || !hasRole('admin')) {
      navigate('/auth');
      return;
    }
    loadDashboardData();
    const timer = setTimeout(() => {
      if (user && user.name) {
        toast.success(`Welcome back, ${user.name}!`, {
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          toastId: 'dashboard-welcome'
        });
      }
    }, 800);
    return () => {
      clearTimeout(timer);
      toast.dismiss('dashboard-welcome');
    };
  }, [hideLoading, isAuthenticated, hasRole, navigate, user, loadDashboardData]);
  const handleFormChange = (field, value) => {
    setCertificateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleIssueCertificate = async () => {
    if (!certificateForm.studentName || !certificateForm.course || !certificateForm.degree) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIssuingCertificate(true);
    try {
      const certificateData = {
        studentName: certificateForm.studentName,
        studentId: certificateForm.studentId,
        studentEmail: certificateForm.studentEmail,
        course: certificateForm.course,
        degree: certificateForm.degree,
        gpa: certificateForm.gpa,
        graduationDate: certificateForm.graduationDate,
        university: certificateForm.university,
        dean: certificateForm.dean,
        registrar: certificateForm.registrar,
        issuer: user.email,
        issuerId: user._id
      };
      const response = await fetch(`${API_BASE_URL}/api/certificates/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(certificateData)
      });
      const result = await response.json();
      if (result.success) {
        await loadDashboardData();
        setCertificateForm({
          studentName: '',
          studentId: '',
          studentEmail: '',
          course: '',
          degree: '',
          gpa: '',
          graduationDate: '',
          university: 'University of Excellence',
          dean: 'Dr. John Anderson',
          registrar: 'Mary Johnson'
        });
        setShowIssueModal(false);
        toast.success(`Certificate issued successfully!`);
      } else {
        throw new Error(result.message || 'Failed to issue certificate');
      }
    } catch (error) {
      console.error('Certificate issuance failed:', error);
      toast.error(error.message || 'Failed to issue certificate. Please try again.');
    } finally {
      setIssuingCertificate(false);
    }
  };
  const handleDownloadCertificate = (certificate) => {
    const certificateData = {
      ...certificate,
      downloadedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(certificateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${certificate.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Certificate ${certificate.id} downloaded successfully`);
  };
  const handleSignOut = async () => {
    try {
      await logout();
      await new Promise(resolve => setTimeout(resolve, 1200));
      navigate('/auth');
    } catch (error) {
      toast.error('Sign out failed. Please try again.');
    }
  };
  const handleRevokeCertificate = (certificateId) => {
    setCertificates(prev => 
      prev.map(cert => 
        cert.id === certificateId 
          ? { ...cert, status: 'Revoked' }
          : cert
      )
    );
    toast.success(`Certificate ${certificateId} has been revoked`);
  };
  const getStatusBadge = (status) => {
    const isValid = status === 'Valid';
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: isValid ? '#dcfce7' : '#fee2e2',
        color: isValid ? '#166534' : '#dc2626'
      }}>
        {status}
      </span>
    );
  };
  const IssueModal = () => {
    if (!showIssueModal) return null;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>Issue New Certificate</h3>
            <button
              onClick={() => setShowIssueModal(false)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Student Name *</label>
                <input
                  type="text"
                  value={certificateForm.studentName}
                  onChange={(e) => handleFormChange('studentName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Student ID</label>
                <input
                  type="text"
                  value={certificateForm.studentId}
                  onChange={(e) => handleFormChange('studentId', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter student ID"
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Student Email</label>
              <input
                type="email"
                value={certificateForm.studentEmail}
                onChange={(e) => handleFormChange('studentEmail', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
                placeholder="Enter student email"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Course *</label>
                <select
                  value={certificateForm.course}
                  onChange={(e) => handleFormChange('course', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">Select course</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Degree *</label>
                <select
                  value={certificateForm.degree}
                  onChange={(e) => handleFormChange('degree', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">Select degree</option>
                  <option value="Bachelor of Science">Bachelor of Science</option>
                  <option value="Bachelor of Arts">Bachelor of Arts</option>
                  <option value="Master of Science">Master of Science</option>
                  <option value="Master of Arts">Master of Arts</option>
                  <option value="Doctor of Philosophy">Doctor of Philosophy</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={certificateForm.gpa}
                  onChange={(e) => handleFormChange('gpa', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter GPA"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Graduation Date</label>
                <input
                  type="date"
                  value={certificateForm.graduationDate}
                  onChange={(e) => handleFormChange('graduationDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Dean</label>
                <input
                  type="text"
                  value={certificateForm.dean}
                  onChange={(e) => handleFormChange('dean', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Dean name"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Registrar</label>
                <input
                  type="text"
                  value={certificateForm.registrar}
                  onChange={(e) => handleFormChange('registrar', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Registrar name"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowIssueModal(false)}
                disabled={issuingCertificate}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: issuingCertificate ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleIssueCertificate}
                disabled={issuingCertificate}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: issuingCertificate ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: issuingCertificate ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {issuingCertificate ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Issuing...
                  </>
                ) : (
                  <>
                    <Award size={16} />
                    Issue Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const StatCard = ({ icon, title, value, subtitle, color, trend }) => (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      e.currentTarget.style.borderColor = '#e2e8f0';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
      e.currentTarget.style.borderColor = '#f1f5f9';
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: color,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{
            fontSize: '0.75rem',
            color: trend.includes('+') ? '#059669' : '#dc2626',
            fontWeight: '500',
            backgroundColor: trend.includes('+') ? '#ecfdf5' : '#fef2f2',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {trend}
          </div>
        )}
      </div>
      <div>
        <p style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 0.25rem 0',
          lineHeight: '1'
        }}>
          {value}
        </p>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: '0 0 0.25rem 0',
          fontWeight: '500'
        }}>
          {title}
        </p>
        {subtitle && (
          <p style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            margin: 0
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
  const renderOverview = () => (
    <div style={{ padding: '2rem' }}>
      {}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <StatCard
          icon={<FileText size={20} style={{ color: '#3b82f6' }} />}
          title="Total Certificates"
          value={stats.totalCertificates}
          subtitle={stats.totalCertificates === 0 ? "No certificates yet" : `${stats.totalCertificates} certificates issued`}
          color="#eff6ff"
        />
        <StatCard
          icon={<CheckCircle size={20} style={{ color: '#10b981' }} />}
          title="Active Certificates"
          value={stats.activeCertificates}
          subtitle={stats.activeCertificates === 0 ? "No active certificates" : `${stats.activeCertificates} valid certificates`}
          color="#ecfdf5"
        />
        <StatCard
          icon={<Activity size={20} style={{ color: '#f59e0b' }} />}
          title="Monthly Issued"
          value={stats.monthlyIssued}
          subtitle={stats.monthlyIssued === 0 ? "No certificates this month" : `${stats.monthlyIssued} issued this month`}
          color="#fffbeb"
        />
        <StatCard
          icon={<Users size={20} style={{ color: '#3b82f6' }} />}
          title="Total Users"
          value={users.length}
          subtitle={users.length === 0 ? "No users registered" : `${users.length} registered users`}
          color="#eff6ff"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #f1f5f9',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.borderColor = '#f1f5f9';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Recent Certificates
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Latest certificate issuances and updates
            </p>
          </div>
          {certificates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {certificates.slice(0, 3).map((cert, index) => (
                <div key={cert.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: cert.status === 'Valid' ? '#ecfdf5' : '#fef2f2',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {cert.status === 'Valid' ? 
                        <CheckCircle size={16} style={{ color: '#10b981' }} /> :
                        <XCircle size={16} style={{ color: '#ef4444' }} />
                      }
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0 0 2px 0'
                      }}>
                        {cert.studentName}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {cert.course} • {cert.issuedDate}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: cert.status === 'Valid' ? '#10b981' : '#ef4444',
                    backgroundColor: cert.status === 'Valid' ? '#ecfdf5' : '#fef2f2',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {cert.status}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setActiveTab('certificates')}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontWeight: '500',
                  marginTop: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#eff6ff';
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                View all certificates →
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <FileText size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0 0 0.5rem 0'
              }}>
                No certificates issued yet
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                margin: 0
              }}>
                Recent certificate activity will appear here
              </p>
            </div>
          )}
        </div>
        {}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #f1f5f9',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.borderColor = '#f1f5f9';
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 0.5rem 0'
            }}>
              System Status
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Current system health and metrics
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Database
                </span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                color: '#10b981',
                fontWeight: '600',
                backgroundColor: '#ecfdf5',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                OPERATIONAL
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  API Services
                </span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                color: '#10b981',
                fontWeight: '600',
                backgroundColor: '#ecfdf5',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                HEALTHY
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '50%'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Backup Status
                </span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                color: '#f59e0b',
                fontWeight: '600',
                backgroundColor: '#fffbeb',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                SCHEDULED
              </span>
            </div>
            <div style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Server Uptime
                </span>
                <span style={{
                  fontSize: '1.25rem',
                  color: '#111827',
                  fontWeight: '600'
                }}>
                  {stats.systemUptime} (30 days)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.borderColor = '#f1f5f9';
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 0.5rem 0'
          }}>
            Quick Actions
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            Frequently used certificate management functions
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <Plus size={18} style={{ color: '#3b82f6' }} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Issue New Certificate</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Create and issue certificates</div>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <Search size={18} style={{ color: '#10b981' }} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Verify Certificate</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Check certificate validity</div>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.borderColor = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <Users size={18} style={{ color: '#8b5cf6' }} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Manage Users</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>User accounts and permissions</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
  const renderCertificates = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            All Certificates
          </h3>
          <button 
            onClick={() => setShowIssueModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={16} />
            Issue Certificate
          </button>
        </div>
        {certificates.length > 0 ? (
          <div style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Certificate ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Student Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Course</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Degree</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Issue Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, index) => (
                  <tr key={cert.id} style={{ 
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9fafb';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1e293b', fontWeight: '500' }}>
                      {cert.id}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1e293b' }}>
                      {cert.studentName}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1e293b' }}>
                      {cert.course}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {cert.degree}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {cert.issuedDate}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(cert.status)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{
                          padding: '0.5rem',
                          backgroundColor: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Eye size={14} style={{ color: '#6b7280' }} />
                        </button>
                        <button 
                          onClick={() => handleDownloadCertificate(cert)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#f3f4f6',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#e5e7eb';
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f3f4f6';
                            e.target.style.transform = 'scale(1)';
                          }}
                          title="Download Certificate"
                        >
                          <Download size={14} style={{ color: '#6b7280' }} />
                        </button>
                        {cert.status === 'Valid' && (
                          <button 
                            onClick={() => handleRevokeCertificate(cert.id)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#fef2f2',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#fee2e2';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#fef2f2';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <XCircle size={14} style={{ color: '#ef4444' }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
            <p style={{
              fontSize: '1rem',
              fontWeight: '500',
              margin: '0 0 0.5rem 0'
            }}>
              No certificates found
            </p>
            <p style={{
              fontSize: '0.875rem',
              margin: 0
            }}>
              Issued certificates will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
  const renderUsers = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            User Management
          </h3>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}>
            <Plus size={16} />
            Add User
          </button>
        </div>
        {users.length > 0 ? (
          <div style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Department</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Last Login</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} style={{ 
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
                  }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: user.role === 'Faculty' ? '#f0f9ff' : '#f3f4f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <UserCheck size={16} style={{ 
                            color: user.role === 'Faculty' ? '#3b82f6' : '#6b7280' 
                          }} />
                        </div>
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827',
                            margin: 0
                          }}>
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: user.role === 'Faculty' ? '#3b82f6' : user.role === 'Student' ? '#10b981' : '#6b7280',
                        backgroundColor: user.role === 'Faculty' ? '#eff6ff' : user.role === 'Student' ? '#ecfdf5' : '#f3f4f6',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {user.department}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: user.status === 'Active' ? '#10b981' : user.status === 'Graduated' ? '#3b82f6' : '#ef4444',
                        backgroundColor: user.status === 'Active' ? '#ecfdf5' : user.status === 'Graduated' ? '#eff6ff' : '#fef2f2',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {user.lastLogin}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{
                          padding: '0.5rem',
                          backgroundColor: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Eye size={14} style={{ color: '#6b7280' }} />
                        </button>
                        <button style={{
                          padding: '0.5rem',
                          backgroundColor: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e5e7eb';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6';
                          e.target.style.transform = 'scale(1)';
                        }}>
                          <Settings size={14} style={{ color: '#6b7280' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <Users size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
            <p style={{
              fontSize: '1rem',
              fontWeight: '500',
              margin: '0 0 0.5rem 0'
            }}>
              No users registered
            </p>
            <p style={{
              fontSize: '0.875rem',
              margin: 0
            }}>
              Users added through the registration form will appear here. Click "Add User" to register new users.
            </p>
          </div>
        )}
      </div>
    </div>
  );
  const renderSettings = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 1.5rem 0'
        }}>
          System Settings
        </h3>
        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          <div>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 0.5rem 0'
            }}>
              University Information
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Configure university name, logo, and contact information
            </p>
          </div>
          <div>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 0.5rem 0'
            }}>
              Certificate Templates
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Manage certificate designs and layouts
            </p>
          </div>
          <div>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 0.5rem 0'
            }}>
              Security Settings
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Configure authentication and access controls
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Open Sans", sans-serif'
    }}>
      <IssueModal />
      {}
      <div style={{
        width: sidebarOpen ? '280px' : '80px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div 
            onClick={() => setActiveTab('overview')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: '0.25rem',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}>
              <ShieldCheck size={20} style={{ color: 'white' }} />
            </div>
            {sidebarOpen && (
              <div>
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  transition: 'color 0.2s ease'
                }}>
                  CertifyChain
                </h2>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Admin Portal
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <Menu size={16} />
          </button>
        </div>
        {}
        <nav style={{ padding: '1rem' }}>
          {[
            { id: 'overview', icon: Home, label: 'Overview' },
            { id: 'certificates', icon: Award, label: 'Certificates' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '0.25rem',
                backgroundColor: activeTab === item.id ? '#f3f4f6' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: activeTab === item.id ? '#374151' : '#6b7280',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.color = '#374151';
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        {}
        {sidebarOpen && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            right: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={16} style={{ color: '#6b7280' }} />
              </div>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#111827',
                  margin: 0
                }}>
                  {user?.name || 'Administrator'}
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  {user?.email || 'admin@university.edu'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.625rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#6b7280',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fef2f2';
                e.target.style.borderColor = '#fca5a5';
                e.target.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#6b7280';
              }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>
      {}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '280px' : '80px',
        transition: 'margin-left 0.3s ease'
      }}>
        {}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              {activeTab === 'overview' && 'System overview and statistics'}
              {activeTab === 'certificates' && 'Manage all certificates'}
              {activeTab === 'users' && 'User management and permissions'}
              {activeTab === 'settings' && 'System configuration'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px'
            }}>
              <Activity size={16} style={{ color: '#10b981' }} />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontWeight: '500'
              }}>
                System Online
              </span>
            </div>
          </div>
        </header>
        {}
        <main style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 73px)' }}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'certificates' && renderCertificates()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>
      {}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default AdminDashboard;
