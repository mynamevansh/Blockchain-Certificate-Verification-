import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Shield,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
const ProfessionalVerify = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('certificateId'); // 'certificateId' or 'email'
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const handleVerification = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }
    setVerifying(true);
    setVerificationResult(null);
    try {
      const certificateDatabase = {
      };
      await new Promise(resolve => setTimeout(resolve, 1000));
      const certificate = certificateDatabase[searchQuery.trim().toUpperCase()];
      if (certificate) {
        setVerificationResult({
          isValid: true,
          certificate: {
            ...certificate,
            verificationDate: new Date().toISOString()
          }
        });
        toast.success('Certificate found and verified');
      } else {
        setVerificationResult({
          isValid: false,
          error: 'Certificate not found in database. Please verify the certificate ID is correct.'
        });
        toast.error('Certificate not found');
      }
      const historyEntry = {
        query: searchQuery,
        timestamp: new Date().toISOString(),
        result: certificate ? 'Valid' : 'Not Found'
      };
      setSearchHistory(prev => [historyEntry, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification failed. Please try again.');
      setVerificationResult({
        isValid: false,
        error: 'Unable to verify certificate. Please try again later.'
      });
    } finally {
      setVerifying(false);
    }
  };
  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <TopNavbar 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          user={user}
        />
        <div className="content-area">
          {}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <Link to="/dashboard" className="btn btn-secondary">
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
              Certificate Verification
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Verify the authenticity of certificates using blockchain technology.
            </p>
          </div>
          <div className="grid grid-cols-2">
            {}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Verify Certificate</h3>
                <p className="card-subtitle">Enter certificate ID or recipient email to verify authenticity</p>
              </div>
              <div className="card-content">
                <form onSubmit={handleVerification}>
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: 'var(--text-primary)', 
                      marginBottom: 'var(--spacing-sm)' 
                    }}>
                      Search Type
                    </label>
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        backgroundColor: 'var(--background-primary)'
                      }}
                    >
                      <option value="certificateId">Certificate ID</option>
                      <option value="email">Recipient Email</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: 'var(--text-primary)', 
                      marginBottom: 'var(--spacing-sm)' 
                    }}>
                      {searchType === 'certificateId' ? 'Certificate ID' : 'Recipient Email'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={searchType === 'certificateId' ? 'text' : 'email'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                          searchType === 'certificateId' 
                            ? 'Enter certificate ID (e.g., CERT-2024-001)' 
                            : 'Enter recipient email address'
                        }
                        style={{
                          width: '100%',
                          padding: 'var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 2.5rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem'
                        }}
                      />
                      <Search 
                        size={16} 
                        style={{ 
                          position: 'absolute', 
                          left: '0.75rem', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          color: 'var(--text-muted)' 
                        }} 
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={verifying || !searchQuery.trim()}
                    style={{ width: '100%' }}
                  >
                    {verifying ? (
                      <>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          border: '2px solid transparent', 
                          borderTop: '2px solid currentColor', 
                          borderRadius: '50%', 
                          animation: 'spin 1s linear infinite' 
                        }} />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield size={16} />
                        Verify Certificate
                      </>
                    )}
                  </button>
                </form>
                {}
                {searchHistory.length > 0 && (
                  <div style={{ marginTop: 'var(--spacing-xl)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
                      Recent Searches
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                      {searchHistory.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'var(--spacing-sm)',
                            backgroundColor: 'var(--background-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setSearchQuery(item.query);
                            setSearchType(item.type);
                          }}
                        >
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {item.query}
                          </span>
                          <span className={`status-badge ${item.result === 'valid' ? 'active' : 'revoked'}`}>
                            {item.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">How It Works</h3>
                <p className="card-subtitle">Certificate verification process</p>
              </div>
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary-color)' }}>1</span>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                        Enter Certificate Details
                      </h5>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        Provide either the certificate ID or recipient's email address.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary-color)' }}>2</span>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                        Blockchain Verification
                      </h5>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        Our system checks the blockchain for certificate authenticity.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary-color)' }}>3</span>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                        Instant Results
                      </h5>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        Receive detailed verification results including certificate details.
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ 
                  marginTop: 'var(--spacing-xl)', 
                  padding: 'var(--spacing-md)', 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                    <Shield size={16} style={{ color: 'var(--success-color)' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--success-color)' }}>
                      Secure & Reliable
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                    All verifications are performed against immutable blockchain records.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {}
          {verificationResult && (
            <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  {verificationResult.isValid ? (
                    <CheckCircle size={20} style={{ color: 'var(--success-color)' }} />
                  ) : (
                    <XCircle size={20} style={{ color: 'var(--error-color)' }} />
                  )}
                  <h3 className="card-title">
                    Verification {verificationResult.isValid ? 'Successful' : 'Failed'}
                  </h3>
                </div>
                <p className="card-subtitle">
                  {verificationResult.isValid 
                    ? 'Certificate is authentic and verified' 
                    : 'Certificate could not be verified'
                  }
                </p>
              </div>
              {verificationResult.isValid && verificationResult.certificate ? (
                <div className="card-content">
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem'
                  }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-secondary)', 
                          fontWeight: '500',
                          width: '140px'
                        }}>
                          Certificate ID
                        </td>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-primary)', 
                          fontWeight: '600'
                        }}>
                          {verificationResult.certificate.id}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-secondary)', 
                          fontWeight: '500'
                        }}>
                          Recipient Name
                        </td>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-primary)', 
                          fontWeight: '600'
                        }}>
                          {verificationResult.certificate.recipientName}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-secondary)', 
                          fontWeight: '500'
                        }}>
                          Course Name
                        </td>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-primary)', 
                          fontWeight: '600'
                        }}>
                          {verificationResult.certificate.courseName}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-secondary)', 
                          fontWeight: '500'
                        }}>
                          Institution
                        </td>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-primary)', 
                          fontWeight: '600'
                        }}>
                          {verificationResult.certificate.institution}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-secondary)', 
                          fontWeight: '500'
                        }}>
                          Issue Date
                        </td>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-primary)', 
                          fontWeight: '600'
                        }}>
                          {new Date(verificationResult.certificate.issueDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit' 
                          })}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-secondary)', 
                          fontWeight: '500'
                        }}>
                          Expiry Date
                        </td>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-primary)', 
                          fontWeight: '600'
                        }}>
                          {new Date(verificationResult.certificate.expiryDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit' 
                          })}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-secondary)', 
                          fontWeight: '500'
                        }}>
                          Issuer
                        </td>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-primary)', 
                          fontWeight: '600'
                        }}>
                          {verificationResult.certificate.issuer}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-secondary)', 
                          fontWeight: '500'
                        }}>
                          Status
                        </td>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-xs)'
                        }}>
                          {verificationResult.certificate.status === 'Valid' ? (
                            <>
                              <span>✔️</span>
                              <span style={{ color: 'var(--success-color)', fontWeight: '600' }}>Valid</span>
                            </>
                          ) : (
                            <>
                              <span>❌</span>
                              <span style={{ color: 'var(--error-color)', fontWeight: '600' }}>Revoked</span>
                            </>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-secondary)', 
                          fontWeight: '500'
                        }}>
                          Verified On
                        </td>
                        <td style={{ 
                          padding: 'var(--spacing-sm) 0', 
                          color: 'var(--text-primary)', 
                          fontWeight: '600'
                        }}>
                          {new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit' 
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="card-content">
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 'var(--spacing-xl)',
                    color: 'var(--error-color)'
                  }}>
                    <AlertTriangle size={48} style={{ marginBottom: 'var(--spacing-md)' }} />
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
                      Verification Failed
                    </h4>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {verificationResult.error || 'The certificate could not be found or is invalid.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfessionalVerify;
