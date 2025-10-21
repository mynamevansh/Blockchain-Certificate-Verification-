import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/SimpleWebSocketContext';
import { certificateAPI } from '../services/api';
import blockchainService from '../services/blockchain';
import { toast } from 'react-toastify';
const Revoke = () => {
  const { user, isAuthenticated } = useAuth();
  const { emitEvent } = useWebSocket();
  const [certificateId, setCertificateId] = useState('');
  const [reason, setReason] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [userCertificates, setUserCertificates] = useState([]);
  const [loadingUserCertificates, setLoadingUserCertificates] = useState(false);
  const revocationReasons = [
    'Certificate issued in error',
    'Information on certificate is incorrect',
    'Certificate holder misconduct',
    'Institutional policy violation',
    'Security breach',
    'Administrative error',
    'Other'
  ];
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserCertificates();
    }
  }, [isAuthenticated, user]);
  const loadUserCertificates = async () => {
    setLoadingUserCertificates(true);
    try {
      const certificates = await certificateAPI.getUserCertificates(user.address);
      const activeCertificates = certificates.filter(cert => cert.status === 'active');
      setUserCertificates(activeCertificates);
    } catch (error) {
      console.error('Error loading user certificates:', error);
      const mockCertificates = [
        {
          certificateId: 'cert_1698765432_abc123',
          recipientName: 'John Doe',
          courseName: 'Computer Science Degree',
          institution: 'Tech University',
          issueDate: '2024-01-15',
          status: 'active'
        },
        {
          certificateId: 'cert_1698765433_def456',
          recipientName: 'Jane Smith',
          courseName: 'Data Science Certificate',
          institution: 'Tech University',
          issueDate: '2024-02-20',
          status: 'active'
        }
      ];
      setUserCertificates(mockCertificates);
    } finally {
      setLoadingUserCertificates(false);
    }
  };
  const searchCertificate = async () => {
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }
    setLoading(true);
    setCertificate(null);
    try {
      let cert = null;
      try {
        cert = await certificateAPI.getCertificate(certificateId);
      } catch (error) {
        console.warn('Backend lookup failed, trying blockchain:', error);
      }
      if (!cert) {
        const blockchainResult = await blockchainService.getCertificateDetails(certificateId);
        cert = {
          certificateId,
          ...blockchainResult,
          recipientName: 'Certificate Holder',
          courseName: 'Unknown Course',
          institution: 'Unknown Institution',
          issueDate: blockchainResult.issuedAt || new Date().toISOString(),
        };
      }
      if (cert) {
        if (cert.issuer && cert.issuer.toLowerCase() !== user.address.toLowerCase()) {
          toast.error('You do not have permission to revoke this certificate');
          return;
        }
        if (cert.status === 'revoked') {
          toast.warning('This certificate has already been revoked');
        }
        setCertificate(cert);
        toast.success('Certificate found');
      } else {
        toast.error('Certificate not found');
      }
    } catch (error) {
      console.error('Error searching certificate:', error);
      toast.error(error.message || 'Failed to find certificate');
    } finally {
      setLoading(false);
    }
  };
  const handleRevoke = async () => {
    if (!certificate) {
      toast.error('No certificate selected for revocation');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for revocation');
      return;
    }
    setRevoking(true);
    try {
      toast.info('Revoking certificate on blockchain...');
      const blockchainResult = await blockchainService.revokeCertificate(
        certificate.certificateId,
        reason
      );
      try {
        await certificateAPI.revokeCertificate(certificate.certificateId, reason);
      } catch (error) {
        console.warn('Backend revocation failed, blockchain revocation succeeded:', error);
      }
      emitEvent('certificateRevoked', {
        certificateId: certificate.certificateId,
        revokedBy: user.address,
        reason: reason,
        timestamp: new Date().toISOString()
      });
      toast.success('Certificate revoked successfully!');
      setCertificate({
        ...certificate,
        status: 'revoked',
        revocationReason: reason,
        revokedBy: user.address,
        revokedAt: new Date().toISOString()
      });
      loadUserCertificates();
    } catch (error) {
      console.error('Error revoking certificate:', error);
      toast.error(error.message || 'Failed to revoke certificate');
    } finally {
      setRevoking(false);
    }
  };
  const selectCertificateFromList = (cert) => {
    setCertificateId(cert.certificateId);
    setCertificate(cert);
  };
  const resetForm = () => {
    setCertificateId('');
    setReason('');
    setCertificate(null);
  };
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Connection Required</h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to revoke certificates.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Revoke Certificate</h1>
        <p className="text-gray-600">
          Revoke certificates that were issued incorrectly or need to be invalidated. 
          This action is permanent and will be recorded on the blockchain.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Active Certificates</h2>
            {loadingUserCertificates ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your certificates...</p>
              </div>
            ) : userCertificates.length > 0 ? (
              <div className="space-y-3">
                {userCertificates.map((cert) => (
                  <div
                    key={cert.certificateId}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      certificateId === cert.certificateId
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => selectCertificateFromList(cert)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{cert.recipientName}</p>
                        <p className="text-sm text-gray-600">{cert.courseName}</p>
                        <p className="text-sm text-gray-500">{cert.institution}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Issued: {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="status-active">Active</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-mono">
                      ID: {cert.certificateId}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No active certificates found</p>
                <p className="text-sm">Certificates you've issued will appear here</p>
              </div>
            )}
          </div>
        </div>
        {}
        <div className="space-y-6">
          {}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Certificate</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate ID
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="certificateId"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="input-field"
                    placeholder="cert_1234567890_abcdef"
                  />
                  <button
                    onClick={searchCertificate}
                    disabled={loading || !certificateId.trim()}
                    className="btn-secondary disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {}
          {certificate && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span>
                    {certificate.status === 'active' ? (
                      <span className="status-active">Active</span>
                    ) : (
                      <span className="status-revoked">Revoked</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-semibold">{certificate.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span>{certificate.courseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Institution:</span>
                  <span>{certificate.institution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue Date:</span>
                  <span>{new Date(certificate.issueDate).toLocaleDateString()}</span>
                </div>
                {certificate.status === 'revoked' && certificate.revocationReason && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revoked Date:</span>
                      <span>{new Date(certificate.revokedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-sm text-red-800">
                        <span className="font-semibold">Revocation Reason:</span> {certificate.revocationReason}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {}
          {certificate && certificate.status === 'active' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Revoke Certificate</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Revocation *
                  </label>
                  <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select a reason</option>
                    {revocationReasons.map((reasonOption) => (
                      <option key={reasonOption} value={reasonOption}>
                        {reasonOption}
                      </option>
                    ))}
                  </select>
                </div>
                {reason === 'Other' && (
                  <div>
                    <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Reason
                    </label>
                    <textarea
                      id="customReason"
                      value={reason === 'Other' ? '' : reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="Please provide details..."
                      required
                    />
                  </div>
                )}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-yellow-800">Warning</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Revoking a certificate is permanent and cannot be undone. 
                        This action will be recorded on the blockchain and the certificate will be marked as invalid.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleRevoke}
                    disabled={revoking || !reason.trim()}
                    className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {revoking ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Revoking...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Revoke Certificate</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Revoke;
