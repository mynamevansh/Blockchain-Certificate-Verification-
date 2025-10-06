import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Users, 
  Search,
  LogOut,
  ShieldCheck,
  Settings,
  BarChart3,
  Menu,
  Home,
  Award,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [verifyId, setVerifyId] = useState('');
  const [revokeId, setRevokeId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [revocationResult, setRevocationResult] = useState(null);

  // Sample certificate data for realistic workflow demonstration
  const [certificates, setCertificates] = useState([
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
    },
    {
      id: 'CERT-2024-004',
      recipientName: 'Maria Rodriguez',
      courseName: 'Data Analytics',
      issueDate: '2024-07-05',
      expiryDate: '2025-01-05',
      status: 'Valid',
      issuer: 'Dr. Robert Kim'
    }
  ]);

  // Calculate stats from certificates data
  const stats = {
    totalCertificates: certificates.length,
    activeCertificates: certificates.filter(c => c.status === 'Valid').length,
    revokedCertificates: certificates.filter(c => c.status === 'Revoked').length,
    totalUsers: 15 // Example user count
  };

  const handleSignOut = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!verifyId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    // Simulate API call
    setTimeout(() => {
      const certificate = certificates.find(c => 
        c.id.toLowerCase() === verifyId.trim().toLowerCase()
      );
      
      if (certificate) {
        setVerificationResult(certificate);
        toast.success('Certificate found and verified');
      } else {
        setVerificationResult(null);
        toast.error('Certificate not found');
      }
      setVerifying(false);
    }, 1000);
  };

  const handleRevocation = async (e) => {
    e.preventDefault();
    if (!revokeId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setRevoking(true);
    setRevocationResult(null);

    // Simulate API call
    setTimeout(() => {
      const certificateIndex = certificates.findIndex(c => 
        c.id.toLowerCase() === revokeId.trim().toLowerCase()
      );
      
      if (certificateIndex !== -1) {
        const certificate = certificates[certificateIndex];
        if (certificate.status === 'Valid') {
          // Update certificate status
          const updatedCertificates = [...certificates];
          updatedCertificates[certificateIndex] = { ...certificate, status: 'Revoked' };
          setCertificates(updatedCertificates);
          
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
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: status === 'Valid' ? '#dcfce7' : '#fee2e2',
        color: status === 'Valid' ? '#166534' : '#dc2626'
      }}>
        {status}
      </span>
    );
  };

  const StatCard = ({ icon, title, value, color }) => (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 0.5rem 0',
            fontWeight: '500',
            fontFamily: 'Open Sans, sans-serif'
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            margin: '0',
            fontFamily: 'Roboto, sans-serif'
          }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: color,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 1rem 0',
          fontFamily: 'Roboto, sans-serif'
        }}>
          {title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem', height: '120px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: `${(item.value / maxValue) * 80}px`,
                backgroundColor: item.color,
                borderRadius: '4px 4px 0 0',
                minHeight: '20px',
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600',
                paddingBottom: '4px'
              }}>
                {item.value}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginTop: '0.5rem',
                textAlign: 'center',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div style={{ padding: '2rem' }}>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          icon={<FileText size={24} style={{ color: '#3b82f6' }} />}
          title="Total Certificates"
          value={stats.totalCertificates}
          color="#eff6ff"
        />
        <StatCard
          icon={<CheckCircle size={24} style={{ color: '#10b981' }} />}
          title="Active Certificates"
          value={stats.activeCertificates}
          color="#ecfdf5"
        />
        <StatCard
          icon={<XCircle size={24} style={{ color: '#ef4444' }} />}
          title="Revoked Certificates"
          value={stats.revokedCertificates}
          color="#fef2f2"
        />
        <StatCard
          icon={<Users size={24} style={{ color: '#8b5cf6' }} />}
          title="Total Users"
          value={stats.totalUsers}
          color="#f5f3ff"
        />
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <SimpleChart
          title="Certificate Status Distribution"
          data={[
            { label: 'Valid', value: stats.activeCertificates, color: '#10b981' },
            { label: 'Revoked', value: stats.revokedCertificates, color: '#ef4444' }
          ]}
        />
        <SimpleChart
          title="Monthly Statistics"
          data={[
            { label: 'Jan', value: 12, color: '#3b82f6' },
            { label: 'Feb', value: 19, color: '#3b82f6' },
            { label: 'Mar', value: 8, color: '#3b82f6' },
            { label: 'Apr', value: 15, color: '#3b82f6' }
          ]}
        />
      </div>

      {/* Certificates Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
            fontFamily: 'Roboto, sans-serif'
          }}>
            Certificate Records
          </h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'Open Sans, sans-serif'
          }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Certificate ID
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Recipient Name
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Course Name
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Issue Date
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Expiry Date
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert, index) => (
                <tr key={cert.id} style={{
                  borderTop: index > 0 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    fontWeight: '600'
                  }}>
                    {cert.id}
                  </td>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {cert.recipientName}
                  </td>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {cert.courseName}
                  </td>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {cert.issueDate}
                  </td>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {cert.expiryDate}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {getStatusBadge(cert.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVerify = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 1.5rem 0',
          fontFamily: 'Roboto, sans-serif'
        }}>
          Verify Certificate
        </h2>
        
        <form onSubmit={handleVerification} style={{ marginBottom: '2rem' }}>
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
                Certificate ID
              </label>
              <input
                type="text"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                placeholder="Enter certificate ID (e.g., CERT-2024-001)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontFamily: 'Open Sans, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <button
              type="submit"
              disabled={verifying}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: verifying ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: verifying ? 'not-allowed' : 'pointer',
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              {verifying ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>

        {/* Verification Result */}
        {verificationResult && (
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#0c4a6e',
              margin: '0 0 1rem 0',
              fontFamily: 'Roboto, sans-serif'
            }}>
              Certificate Verified ✓
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              fontFamily: 'Open Sans, sans-serif'
            }}>
              <div>
                <strong>Certificate ID:</strong><br />
                {verificationResult.id}
              </div>
              <div>
                <strong>Recipient:</strong><br />
                {verificationResult.recipientName}
              </div>
              <div>
                <strong>Course:</strong><br />
                {verificationResult.courseName}
              </div>
              <div>
                <strong>Issue Date:</strong><br />
                {verificationResult.issueDate}
              </div>
              <div>
                <strong>Status:</strong><br />
                {getStatusBadge(verificationResult.status)}
              </div>
            </div>
          </div>
        )}

        {verificationResult === null && verifyId && !verifying && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#dc2626',
              margin: 0,
              fontWeight: '500',
              fontFamily: 'Open Sans, sans-serif'
            }}>
              Certificate not found. Please check the ID and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRevoke = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 1.5rem 0',
          fontFamily: 'Roboto, sans-serif'
        }}>
          Revoke Certificate
        </h2>
        
        <form onSubmit={handleRevocation} style={{ marginBottom: '2rem' }}>
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
                placeholder="Enter certificate ID to revoke"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontFamily: 'Open Sans, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <button
              type="submit"
              disabled={revoking}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: revoking ? '#9ca3af' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: revoking ? 'not-allowed' : 'pointer',
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              {revoking ? 'Revoking...' : 'Revoke'}
            </button>
          </div>
        </form>

        {/* Revocation Result */}
        {revocationResult && (
          <div style={{
            backgroundColor: revocationResult.success ? '#f0f9ff' : '#fef2f2',
            border: `1px solid ${revocationResult.success ? '#bae6fd' : '#fecaca'}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <p style={{
              color: revocationResult.success ? '#0c4a6e' : '#dc2626',
              margin: 0,
              fontWeight: '500',
              fontFamily: 'Open Sans, sans-serif'
            }}>
              {revocationResult.message}
            </p>
            
            {revocationResult.success && revocationResult.certificate && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Updated Status:</strong> {getStatusBadge(revocationResult.certificate.status)}
              </div>
            )}
          </div>
        )}
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
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '80px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        position: 'fixed',
        height: '100vh',
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb'
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
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0,
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  CertifyChain
                </h2>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  margin: 0,
                  fontFamily: 'Open Sans, sans-serif'
                }}>
                  Admin Dashboard
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1rem',
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

        {/* Sidebar Navigation */}
        <nav style={{ padding: '1rem' }}>
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'verify', icon: Search, label: 'Verify Certificate' },
            { id: 'revoke', icon: XCircle, label: 'Revoke Certificate' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '0.25rem',
                backgroundColor: activeSection === item.id ? '#eff6ff' : 'transparent',
                border: activeSection === item.id ? '1px solid #bfdbfe' : '1px solid transparent',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: activeSection === item.id ? '#1e40af' : '#6b7280',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Open Sans, sans-serif'
              }}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
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
                <Users size={16} style={{ color: '#6b7280' }} />
              </div>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  Administrator
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  margin: 0,
                  fontFamily: 'Open Sans, sans-serif'
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
                fontWeight: '500',
                fontFamily: 'Open Sans, sans-serif'
              }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '280px' : '80px'
      }}>
        {/* Top Navbar */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
                fontFamily: 'Roboto, sans-serif'
              }}>
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'verify' && 'Verify Certificate'}
                {activeSection === 'revoke' && 'Revoke Certificate'}
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                fontFamily: 'Open Sans, sans-serif'
              }}>
                {activeSection === 'dashboard' && 'Certificate management overview'}
                {activeSection === 'verify' && 'Verify certificate authenticity'}
                {activeSection === 'revoke' && 'Revoke and invalidate certificates'}
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#ecfdf5',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <Activity size={16} style={{ color: '#10b981' }} />
              <span style={{
                fontSize: '0.875rem',
                color: '#065f46',
                fontWeight: '500',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                System Online
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 73px)' }}>
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'verify' && renderVerify()}
          {activeSection === 'revoke' && renderRevoke()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;