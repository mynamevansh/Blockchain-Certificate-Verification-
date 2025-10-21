import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Users, 
  Plus,
  Search,
  Download,
  Eye,
  Trash2,
  LogOut,
  ShieldCheck,
  Settings,
  BarChart3,
  Menu,
  Home,
  Award,
  UserCheck,
  Activity,
  AlertCircle
} from 'lucide-react';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [revokeId, setRevokeId] = useState('');
  const [revoking, setRevoking] = useState(false);
  const [revocationResult, setRevocationResult] = useState(null);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    activeCertificates: 0,
    revokedCertificates: 0,
    totalUsers: 0,
    pendingRequests: 0,
    monthlyIssued: 0
  });
  useEffect(() => {
    const sampleCertificates = [
      {
        id: 'CERT-2024-001',
        recipientName: 'Vansh Ranawat',
        courseName: 'Advanced Web Development',
        issueDate: '2024-05-15',
        expiryDate: '2024-12-15',
        status: 'Valid',
        issuer: 'Dr. Sarah Johnson'
      },
      {
        id: 'CERT-2024-002',
        recipientName: 'Emily Davis',
        courseName: 'Database Management',
        issueDate: '2024-06-10',
        expiryDate: '2024-12-10',
        status: 'Valid',
        issuer: 'Prof. Michael Brown'
      },
      {
        id: 'CERT-2024-003',
        recipientName: 'David Wilson',
        courseName: 'Cybersecurity Fundamentals',
        issueDate: '2024-03-20',
        expiryDate: '2024-09-20',
        status: 'Revoked',
        issuer: 'Dr. Lisa Chen'
      }
    ];
    setCertificates(sampleCertificates);
    setUsers([]);
    setStats({
      totalCertificates: sampleCertificates.length,
      activeCertificates: sampleCertificates.filter(c => c.status === 'Valid').length,
      revokedCertificates: sampleCertificates.filter(c => c.status === 'Revoked').length,
      totalUsers: 15,
      pendingRequests: 3,
      monthlyIssued: 12
    });
  }, []);
  const handleSignOut = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
    navigate('/auth');
  };
  const handleRevokeCertificate = (certificateId) => {
    setCertificates(prev => 
      prev.map(cert => 
        cert.id === certificateId 
          ? { ...cert, status: 'Revoked' }
          : cert
      )
    );
    setStats(prev => ({
      ...prev,
      activeCertificates: prev.activeCertificates - 1,
      revokedCertificates: prev.revokedCertificates + 1
    }));
    toast.success(`Certificate ${certificateId} has been revoked`);
  };
  const handleRevocationForm = async (e) => {
    e.preventDefault();
    if (!revokeId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }
    setRevoking(true);
    setRevocationResult(null);
    setTimeout(() => {
      const certificateIndex = certificates.findIndex(c => 
        c.id.toLowerCase() === revokeId.trim().toLowerCase()
      );
      if (certificateIndex !== -1) {
        const certificate = certificates[certificateIndex];
        if (certificate.status === 'Valid') {
          const updatedCertificates = [...certificates];
          updatedCertificates[certificateIndex] = { ...certificate, status: 'Revoked' };
          setCertificates(updatedCertificates);
          setStats(prev => ({
            ...prev,
            activeCertificates: prev.activeCertificates - 1,
            revokedCertificates: prev.revokedCertificates + 1
          }));
          setRevocationResult({
            success: true,
            message: `Certificate ${certificate.id} has been successfully revoked`,
            certificate: updatedCertificates[certificateIndex]
          });
          toast.success('Certificate revoked successfully');
        } else {
          setRevocationResult({
            success: false,
            message: 'Certificate is already revoked'
          });
          toast.warning('Certificate already revoked');
        }
      } else {
        setRevocationResult({
          success: false,
          message: 'Certificate not found'
        });
        toast.error('Certificate not found');
      }
      setRevoking(false);
      setRevokeId('');
    }, 1200);
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
        fontSize: '0.875rem',
        fontWeight: '500',
        backgroundColor: isValid ? '#dcfce7' : '#fee2e2',
        color: isValid ? '#166534' : '#dc2626'
      }}>
        {isValid ? '✔️' : '❌'}
        {status}
      </span>
    );
  };
  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '0 0 0.25rem 0',
            fontFamily: 'Open Sans, sans-serif'
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 0.25rem 0',
            fontFamily: 'Roboto, sans-serif'
          }}>
            {value}
          </p>
          {subtitle && (
            <p style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              margin: 0,
              fontFamily: 'Open Sans, sans-serif'
            }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: color + '20',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} style={{ color: 'white' }} />
            </div>
            {sidebarOpen && (
              <div>
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
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
            { id: 'revoke', icon: XCircle, label: 'Revoke Certificate' },
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
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
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
                  Administrator
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  admin@university.edu
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
                fontWeight: '500'
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
              {activeTab === 'revoke' && 'Revoke and invalidate certificates'}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
              fontSize: '0.875rem',
              color: '#64748b',
              fontFamily: 'Open Sans, sans-serif'
            }}>
              Welcome, System Administrator
            </span>
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#475569',
                cursor: 'pointer',
                fontFamily: 'Open Sans, sans-serif'
              }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      {}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem 1.5rem 0 1.5rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'certificates', label: 'Certificates', icon: FileText },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? '#3b82f6' : 'transparent'}`,
                  color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                  cursor: 'pointer',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      {}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1.5rem 3rem 1.5rem'
      }}>
        {}
        {activeTab === 'overview' && (
          <div>
            {}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <StatCard
                icon={<FileText size={24} style={{ color: '#3b82f6' }} />}
                title="Total Certificates"
                value={stats.totalCertificates}
                subtitle="All issued certificates"
                color="#3b82f6"
              />
              <StatCard
                icon={<CheckCircle size={24} style={{ color: '#10b981' }} />}
                title="Active Certificates"
                value={stats.activeCertificates}
                subtitle="Currently valid"
                color="#10b981"
              />
              <StatCard
                icon={<XCircle size={24} style={{ color: '#ef4444' }} />}
                title="Revoked Certificates"
                value={stats.revokedCertificates}
                subtitle="Inactive certificates"
                color="#ef4444"
              />
              <StatCard
                icon={<Users size={24} style={{ color: '#8b5cf6' }} />}
                title="Total Students"
                value={stats.totalUsers}
                subtitle="Registered users"
                color="#8b5cf6"
              />
            </div>
            {}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 1rem 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                Quick Actions
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <button
                  onClick={() => setActiveTab('certificates')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Open Sans, sans-serif',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f8fafc'}
                >
                  <Plus size={20} style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Issue New Certificate</span>
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Open Sans, sans-serif',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f8fafc'}
                >
                  <Search size={20} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Verify Certificate</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Open Sans, sans-serif',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f8fafc'}
                >
                  <Users size={20} style={{ color: '#8b5cf6' }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Manage Users</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {}
        {activeTab === 'certificates' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0,
                fontFamily: 'Roboto, sans-serif'
              }}>
                Tamper proof certificate verification
              </h2>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <Plus size={16} />
                Issue Certificate
              </button>
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Certificate ID</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Recipient</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Course</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Issue Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert, index) => (
                    <tr key={cert.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1e293b', fontFamily: 'Open Sans, sans-serif', fontWeight: '600' }}>{cert.id}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1e293b', fontFamily: 'Open Sans, sans-serif' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>{cert.recipientName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cert.recipientEmail}</div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1e293b', fontFamily: 'Open Sans, sans-serif' }}>{cert.courseName}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1e293b', fontFamily: 'Open Sans, sans-serif' }}>{new Date(cert.issueDate).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>{getStatusBadge(cert.status)}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button style={{
                            padding: '0.375rem',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}>
                            <Eye size={14} style={{ color: '#64748b' }} />
                          </button>
                          <button style={{
                            padding: '0.375rem',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}>
                            <Download size={14} style={{ color: '#64748b' }} />
                          </button>
                          {cert.status === 'Valid' && (
                            <button
                              onClick={() => handleRevokeCertificate(cert.id)}
                              style={{
                                padding: '0.375rem',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={14} style={{ color: '#dc2626' }} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {}
        {activeTab === 'users' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0,
                fontFamily: 'Roboto, sans-serif'
              }}>
                User Management
              </h2>
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Role</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Join Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151', fontFamily: 'Roboto, sans-serif' }}>Certificates</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1e293b', fontFamily: 'Open Sans, sans-serif', fontWeight: '500' }}>{user.name}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b', fontFamily: 'Open Sans, sans-serif' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: user.role === 'admin' ? '#dbeafe' : '#f0fdf4',
                          color: user.role === 'admin' ? '#1e40af' : '#166534',
                          textTransform: 'capitalize'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b', fontFamily: 'Open Sans, sans-serif' }}>{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1e293b', fontFamily: 'Open Sans, sans-serif', fontWeight: '500' }}>{user.certificateCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {}
        {activeTab === 'revoke' && (
          <div style={{ padding: '2rem' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 1.5rem 0',
                fontFamily: 'Roboto, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <XCircle size={24} style={{ color: '#dc2626' }} />
                Revoke Certificate
              </h2>
              <form onSubmit={handleRevocationForm} style={{ marginBottom: '2rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'end'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontFamily: 'Open Sans, sans-serif'
                    }}>
                      Certificate ID to Revoke
                    </label>
                    <input
                      type="text"
                      value={revokeId}
                      onChange={(e) => setRevokeId(e.target.value)}
                      placeholder="Enter certificate ID (e.g., CERT-2024-001)"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontFamily: 'Open Sans, sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={revoking}
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: revoking ? '#9ca3af' : '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: revoking ? 'not-allowed' : 'pointer',
                      fontFamily: 'Roboto, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {revoking ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ffffff33',
                          borderTop: '2px solid #ffffff',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Revoking...
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        Revoke Certificate
                      </>
                    )}
                  </button>
                </div>
              </form>
              {}
              {revocationResult && (
                <div style={{
                  backgroundColor: revocationResult.success ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${revocationResult.success ? '#bbf7d0' : '#fecaca'}`,
                  borderRadius: '8px',
                  padding: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    {revocationResult.success ? (
                      <CheckCircle size={20} style={{ color: '#16a34a' }} />
                    ) : (
                      <AlertCircle size={20} style={{ color: '#dc2626' }} />
                    )}
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: revocationResult.success ? '#166534' : '#dc2626',
                      margin: 0,
                      fontFamily: 'Roboto, sans-serif'
                    }}>
                      {revocationResult.success ? 'Certificate Revoked Successfully' : 'Revocation Failed'}
                    </h3>
                  </div>
                  <p style={{
                    color: revocationResult.success ? '#166534' : '#dc2626',
                    margin: '0 0 1rem 0',
                    fontWeight: '500',
                    fontFamily: 'Open Sans, sans-serif'
                  }}>
                    {revocationResult.message}
                  </p>
                  {revocationResult.success && revocationResult.certificate && (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '1rem',
                      borderRadius: '6px',
                      border: '1px solid #d1fae5'
                    }}>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        margin: '0 0 0.5rem 0',
                        fontFamily: 'Roboto, sans-serif'
                      }}>
                        Certificate Details:
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        fontSize: '0.75rem',
                        fontFamily: 'Open Sans, sans-serif'
                      }}>
                        <div><strong>ID:</strong> {revocationResult.certificate.id}</div>
                        <div><strong>Recipient:</strong> {revocationResult.certificate.recipientName}</div>
                        <div><strong>Course:</strong> {revocationResult.certificate.courseName}</div>
                        <div><strong>New Status:</strong> <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626'
                        }}>
                          ❌ {revocationResult.certificate.status}
                        </span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.5rem',
                marginTop: '2rem'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 1rem 0',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  How to Revoke a Certificate:
                </h4>
                <ol style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0,
                  paddingLeft: '1.25rem',
                  fontFamily: 'Open Sans, sans-serif',
                  lineHeight: '1.5'
                }}>
                  <li>Enter the exact Certificate ID you want to revoke</li>
                  <li>Click the "Revoke Certificate" button</li>
                  <li>Confirm the action when prompted</li>
                  <li>The certificate status will be updated to "Revoked" immediately</li>
                  <li>Revoked certificates cannot be restored to valid status</li>
                </ol>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '6px'
                }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#92400e',
                    margin: 0,
                    fontWeight: '500',
                    fontFamily: 'Open Sans, sans-serif'
                  }}>
                    ⚠️ <strong>Warning:</strong> Certificate revocation is permanent and cannot be undone. Use this feature carefully.
                  </p>
                </div>
              </div>
              {}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginTop: '2rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0,
                    fontFamily: 'Roboto, sans-serif'
                  }}>
                    Valid Certificates Available for Revocation:
                  </h4>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  {certificates.filter(cert => cert.status === 'Valid').length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gap: '0.75rem'
                    }}>
                      {certificates.filter(cert => cert.status === 'Valid').map(cert => (
                        <div key={cert.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px'
                        }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontFamily: 'Open Sans, sans-serif'
                          }}>
                            <strong>{cert.id}</strong> - {cert.recipientName} ({cert.courseName})
                          </div>
                          <button
                            onClick={() => setRevokeId(cert.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              fontFamily: 'Roboto, sans-serif'
                            }}
                          >
                            Select for Revocation
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#64748b',
                      margin: 0,
                      textAlign: 'center',
                      fontFamily: 'Open Sans, sans-serif'
                    }}>
                      No valid certificates available for revocation.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 1.5rem 0',
              fontFamily: 'Roboto, sans-serif'
            }}>
              System Settings
            </h2>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <Settings size={48} style={{ color: '#64748b', margin: '0 auto 1rem auto' }} />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                Settings Panel
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0,
                fontFamily: 'Open Sans, sans-serif'
              }}>
                System configuration and administrative settings will be available here.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default AdminDashboard;
