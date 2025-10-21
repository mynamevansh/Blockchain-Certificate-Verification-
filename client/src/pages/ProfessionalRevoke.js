import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/SimpleWebSocketContext';
import { certificateAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  UserX, 
  Search, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  ArrowLeft,
  Trash2,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
const ProfessionalRevoke = () => {
  const { user } = useAuth();
  const { emitEvent } = useWebSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [revocationReason, setRevocationReason] = useState('');
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [userCertificates, setUserCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadUserCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await certificateAPI.getUserCertificates();
      setUserCertificates(response.data || []);
    } catch (error) {
      console.error('Failed to load certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadUserCertificates();
  }, [loadUserCertificates]);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }
    setSearching(true);
    setSelectedCertificate(null);
    try {
      const certificateDatabase = {
      };
      await new Promise(resolve => setTimeout(resolve, 800));
      const certificate = certificateDatabase[searchQuery.trim().toUpperCase()];
      if (certificate) {
        if (certificate.status === 'Valid') {
          setSelectedCertificate(certificate);
          toast.success('Certificate found and ready for revocation');
        } else {
          toast.error('This certificate has already been revoked');
          setSelectedCertificate(null);
        }
      } else {
        toast.error('Certificate not found in database. Please verify the certificate ID is correct.');
        setSelectedCertificate(null);
      }
    } catch (error) {
      console.error('Certificate search failed:', error);
      toast.error('Search failed. Please try again.');
      setSelectedCertificate(null);
    } finally {
      setSearching(false);
    }
  };
  const handleRevocation = async () => {
    if (!selectedCertificate || !revocationReason.trim()) {
      toast.error('Please provide a reason for revocation');
      return;
    }
    setRevoking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const updatedCertificate = {
        ...selectedCertificate,
        status: 'Revoked',
        revocationDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }),
        revocationReason: revocationReason,
        revokedBy: user?.name || 'System Administrator'
      };
      toast.success(`Certificate ${selectedCertificate.id} has been successfully revoked`);
      setUserCertificates(prev => 
        prev.map(cert => 
          cert.id === selectedCertificate.id 
            ? { ...cert, status: 'revoked' }
            : cert
        )
      );
      setSelectedCertificate(updatedCertificate);
      setConfirmationStep('completed');
      if (emitEvent) {
        emitEvent('certificateRevoked', {
          certificateId: selectedCertificate.id,
          recipientName: selectedCertificate.recipientName
        });
      }
    } catch (error) {
      console.error('Revocation failed:', error);
      toast.error('Failed to revoke certificate. Please try again.');
    } finally {
      setRevoking(false);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getStatusBadge = (status) => {
    const statusMap = {
      active: { class: 'active', text: 'Active' },
      revoked: { class: 'revoked', text: 'Revoked' },
      expired: { class: 'pending', text: 'Expired' }
    };
    const statusInfo = statusMap[status] || { class: 'pending', text: 'Unknown' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };
  const activeCertificates = userCertificates.filter(cert => cert.status === 'active');
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
              Revoke Certificate
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Revoke certificates that are no longer valid or have been compromised.
            </p>
          </div>
          <div className="grid grid-cols-2">
            {}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Find Certificate to Revoke</h3>
                <p className="card-subtitle">Enter certificate ID to locate and revoke</p>
              </div>
              <div className="card-content">
                <form onSubmit={handleSearch}>
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: 'var(--text-primary)', 
                      marginBottom: 'var(--spacing-sm)' 
                    }}>
                      Certificate ID
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter certificate ID (e.g., CERT-2024-001)"
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
                    disabled={searching || !searchQuery.trim()}
                    style={{ width: '100%', marginBottom: 'var(--spacing-lg)' }}
                  >
                    {searching ? (
                      <>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          border: '2px solid transparent', 
                          borderTop: '2px solid currentColor', 
                          borderRadius: '50%', 
                          animation: 'spin 1s linear infinite' 
                        }} />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={16} />
                        Find Certificate
                      </>
                    )}
                  </button>
                </form>
                {}
                {selectedCertificate && (
                  <div style={{ 
                    padding: 'var(--spacing-lg)', 
                    backgroundColor: 'var(--background-tertiary)', 
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                      <FileText size={20} style={{ color: 'var(--primary-color)' }} />
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Certificate Found
                      </h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ID:</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                          {selectedCertificate.id}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Recipient:</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                          {selectedCertificate.recipientName}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Course:</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                          {selectedCertificate.courseName}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status:</span>
                        {getStatusBadge(selectedCertificate.status)}
                      </div>
                    </div>
                  </div>
                )}
                {}
                {selectedCertificate && selectedCertificate.status === 'active' && (
                  <div>
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: 'var(--text-primary)', 
                        marginBottom: 'var(--spacing-sm)' 
                      }}>
                        Reason for Revocation *
                      </label>
                      <textarea
                        value={revocationReason}
                        onChange={(e) => setRevocationReason(e.target.value)}
                        placeholder="Please provide a detailed reason for revoking this certificate..."
                        rows="4"
                        style={{
                          width: '100%',
                          padding: 'var(--spacing-sm) var(--spacing-md)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    {!confirmationStep ? (
                      <button
                        className="btn btn-outline"
                        onClick={() => setConfirmationStep(true)}
                        disabled={!revocationReason.trim()}
                        style={{ width: '100%', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}
                      >
                        <UserX size={16} />
                        Proceed to Revoke
                      </button>
                    ) : (
                      <div>
                        <div style={{ 
                          padding: 'var(--spacing-md)', 
                          backgroundColor: '#fef2f2', 
                          border: '1px solid var(--error-color)', 
                          borderRadius: 'var(--radius-md)',
                          marginBottom: 'var(--spacing-md)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                            <AlertTriangle size={16} style={{ color: 'var(--error-color)' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--error-color)' }}>
                              Confirm Revocation
                            </span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                            This action cannot be undone. The certificate will be permanently revoked.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setConfirmationStep(false)}
                            style={{ flex: 1 }}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={handleRevocation}
                            disabled={revoking}
                            style={{ 
                              flex: 1, 
                              backgroundColor: 'var(--error-color)', 
                              borderColor: 'var(--error-color)' 
                            }}
                          >
                            {revoking ? (
                              <>
                                <div style={{ 
                                  width: '16px', 
                                  height: '16px', 
                                  border: '2px solid transparent', 
                                  borderTop: '2px solid currentColor', 
                                  borderRadius: '50%', 
                                  animation: 'spin 1s linear infinite' 
                                }} />
                                Revoking...
                              </>
                            ) : (
                              <>
                                <Trash2 size={16} />
                                Confirm Revoke
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {selectedCertificate && selectedCertificate.status === 'revoked' && (
                  <div style={{ 
                    padding: 'var(--spacing-md)', 
                    backgroundColor: '#fef2f2', 
                    border: '1px solid var(--error-color)', 
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <UserX size={24} style={{ color: 'var(--error-color)', marginBottom: 'var(--spacing-sm)' }} />
                    <p style={{ fontSize: '0.875rem', color: 'var(--error-color)', margin: 0 }}>
                      This certificate has already been revoked.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Active Certificates</h3>
                <p className="card-subtitle">Currently active certificates that can be revoked</p>
              </div>
              <div className="card-content">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      border: '2px solid var(--border-color)', 
                      borderTop: '2px solid var(--primary-color)', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto var(--spacing-md) auto'
                    }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Loading certificates...
                    </span>
                  </div>
                ) : activeCertificates.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {activeCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        style={{
                          padding: 'var(--spacing-md)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          backgroundColor: selectedCertificate?.id === cert.id ? '#eff6ff' : 'transparent'
                        }}
                        onClick={() => {
                          setSearchQuery(cert.id);
                          setSelectedCertificate(cert);
                          setConfirmationStep(false);
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xs)' }}>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '2px' }}>
                              {cert.id}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {cert.recipientName}
                            </div>
                          </div>
                          {getStatusBadge(cert.status)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {cert.courseName} • {formatDate(cert.issueDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <Shield size={32} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      No active certificates found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {}
          <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
            <div className="card-header">
              <h3 className="card-title">Important Information</h3>
              <p className="card-subtitle">Please read before revoking certificates</p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-3">
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fef2f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <AlertTriangle size={20} style={{ color: 'var(--error-color)' }} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                      Permanent Action
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Certificate revocation is permanent and cannot be undone.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fffbeb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={20} style={{ color: 'var(--warning-color)' }} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                      Documentation Required
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Always provide a clear reason for certificate revocation.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f0fdf4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle size={20} style={{ color: 'var(--success-color)' }} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                      Blockchain Updated
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Revocation status is immediately recorded on the blockchain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfessionalRevoke;
