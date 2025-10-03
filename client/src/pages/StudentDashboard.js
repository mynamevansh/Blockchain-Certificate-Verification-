import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import { 
  FileText, 
  Download, 
  Eye, 
  LogOut,
  GraduationCap,
  User,
  Shield,
  ExternalLink,
  Award,
  Clock
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { hideLoading } = useLoading();
  const [certificates, setCertificates] = useState([]);
  const [student, setStudent] = useState(null);

  // Initialize student data - will be loaded from API in production
  useEffect(() => {
    // Hide loading spinner when dashboard loads
    hideLoading();
    
    // In a real application, this would fetch student data from your API
    // const studentData = fetchStudentProfile();
    // const studentCertificates = fetchStudentCertificates();
    
    // For demo purposes, keeping minimal placeholder data
    setStudent({
      id: 'student1',
      name: 'Student Name',
      email: 'student@university.edu',
      studentId: 'STU-XXXX-XXX',
      program: 'Program Name',
      enrollmentDate: new Date().toISOString().split('T')[0],
      expectedGraduation: new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString().split('T')[0]
    });
    
    setCertificates([]);
  }, [hideLoading]);

  const handleSignOut = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
    navigate('/');
  };

  const handleDownloadCertificate = (certificateId) => {
    toast.success(`Downloading certificate ${certificateId}...`);
  };

  const handleViewCertificate = (certificateId) => {
    toast.info(`Opening certificate ${certificateId} in new window...`);
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

  const getGradeBadge = (grade) => {
    const colors = {
      'A': { bg: '#dcfce7', color: '#166534' },
      'A-': { bg: '#ecfdf5', color: '#047857' },
      'B+': { bg: '#fef3c7', color: '#92400e' },
      'B': { bg: '#fef3c7', color: '#92400e' },
      'B-': { bg: '#fed7aa', color: '#c2410c' },
      'C+': { bg: '#fecaca', color: '#dc2626' },
      'C': { bg: '#fecaca', color: '#dc2626' }
    };
    
    const colorScheme = colors[grade] || { bg: '#f3f4f6', color: '#374151' };
    
    return (
      <span style={{
        display: 'inline-flex',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: colorScheme.bg,
        color: colorScheme.color
      }}>
        {grade}
      </span>
    );
  };

  if (!student) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <p style={{ color: '#64748b', fontFamily: 'Open Sans, sans-serif' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Top Navigation */}
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
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <GraduationCap size={28} style={{ color: '#10b981' }} />
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0,
              fontFamily: 'Roboto, sans-serif'
            }}>
              Student Portal
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
              fontSize: '0.875rem',
              color: '#64748b',
              fontFamily: 'Open Sans, sans-serif'
            }}>
              Welcome, {student.name}
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
      </nav>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {/* Student Info Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <User size={24} />
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: 0,
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  {student.name}
                </h2>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.875rem',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                <div>
                  <strong>Student ID:</strong><br />
                  {student.studentId}
                </div>
                <div>
                  <strong>Program:</strong><br />
                  {student.program}
                </div>
                <div>
                  <strong>Email:</strong><br />
                  {student.email}
                </div>
                <div>
                  <strong>Expected Graduation:</strong><br />
                  {new Date(student.expectedGraduation).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <Award size={40} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                {certificates.length}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                Certificates Earned
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0,
              fontFamily: 'Roboto, sans-serif'
            }}>
              Your Certificates
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#64748b',
              fontFamily: 'Open Sans, sans-serif'
            }}>
              <Clock size={16} />
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Certificates Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '1.5rem'
          }}>
            {certificates.map((cert) => (
              <div key={cert.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              }}>
                {/* Certificate Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  padding: '1.25rem',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Shield size={18} style={{ color: '#10b981' }} />
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#10b981',
                        fontFamily: 'Roboto, sans-serif'
                      }}>
                        {cert.id}
                      </span>
                    </div>
                    {getStatusBadge(cert.status)}
                  </div>
                  
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: '0 0 0.25rem 0',
                    fontFamily: 'Roboto, sans-serif'
                  }}>
                    {cert.courseName}
                  </h4>
                  
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    margin: 0,
                    fontFamily: 'Open Sans, sans-serif'
                  }}>
                    {cert.courseCode} • {cert.creditHours} Credit Hours
                  </p>
                </div>

                {/* Certificate Body */}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '0.25rem',
                        fontFamily: 'Open Sans, sans-serif'
                      }}>
                        Issue Date
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#1e293b',
                        fontFamily: 'Roboto, sans-serif'
                      }}>
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '0.25rem',
                        fontFamily: 'Open Sans, sans-serif'
                      }}>
                        Grade
                      </div>
                      <div>
                        {getGradeBadge(cert.grade)}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '0.25rem',
                        fontFamily: 'Open Sans, sans-serif'
                      }}>
                        Expires
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#1e293b',
                        fontFamily: 'Roboto, sans-serif'
                      }}>
                        {new Date(cert.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '0.25rem',
                        fontFamily: 'Open Sans, sans-serif'
                      }}>
                        Issuer
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#1e293b',
                        fontFamily: 'Roboto, sans-serif'
                      }}>
                        {cert.issuer}
                      </div>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    margin: '0 0 1rem 0',
                    lineHeight: '1.4',
                    fontFamily: 'Open Sans, sans-serif'
                  }}>
                    {cert.description}
                  </p>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <button
                      onClick={() => handleViewCertificate(cert.id)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: '#374151',
                        cursor: 'pointer',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    >
                      <Eye size={14} />
                      View
                    </button>
                    
                    <button
                      onClick={() => handleDownloadCertificate(cert.id)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem',
                        backgroundColor: '#10b981',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: 'white',
                        cursor: 'pointer',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                    >
                      <Download size={14} />
                      Download
                    </button>
                    
                    <button
                      onClick={() => toast.info('Generating verification link...')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.625rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {certificates.length === 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <FileText size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem auto' }} />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Roboto, sans-serif'
              }}>
                No Certificates Yet
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0,
                fontFamily: 'Open Sans, sans-serif'
              }}>
                Your earned certificates will appear here once they are issued by your institution.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;