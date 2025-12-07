import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FileText,
  Download,
  Eye,
  LogOut,
  GraduationCap,
  Shield,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { API_BASE_URL } from '../constants';
import { resolveIPFS } from '../utils/ipfs';
import CryptoJS from 'crypto-js';
import CertificateQRCode from '../components/CertificateQRCode';
import StatusBadge from '../components/ui/StatusBadge';
import DashboardCard from '../components/ui/DashboardCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import CertificateCard from '../components/ui/CertificateCard';
import ThemeToggle from '../components/ui/ThemeToggle';
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [user, setUser] = useState(null);
  const [filterTab, setFilterTab] = useState('all');
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const role = localStorage.getItem('role') || localStorage.getItem('userType');
    const userData = localStorage.getItem('user') || localStorage.getItem('user_data');
    if (!token) {
      navigate('/auth');
      return;
    }
    if (role !== 'student') {
      navigate('/admin-dashboard');
      return;
    }
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    fetchCertificates();
  }, [navigate]);
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user') || localStorage.getItem('user_data');
      let studentId = null;
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          studentId = parsed.studentId || parsed.id;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      if (!studentId) {
        studentId = localStorage.getItem('studentId');
      }
      if (!studentId) {
        toast.error('Student ID not found');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/certificates/student/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.data || []);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to fetch certificates');
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };
  const handleViewCertificate = (certificate) => {
    const cid = certificate.ipfsHash || certificate.ipfsCID;
    if (cid) {
      window.open(resolveIPFS(cid), '_blank');
    } else {
      toast.error('Certificate PDF not available');
    }
  };
  const handleDownloadCertificate = async (certificate) => {
    try {
      const cid = certificate.ipfsHash || certificate.ipfsCID;
      if (!cid) {
        toast.error('Certificate PDF not available');
        return;
      }
      const ipfsUrl = resolveIPFS(cid);
      const response = await fetch(ipfsUrl);
      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${certificate.certificateId || 'certificate'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate');
    }
  };
  const handleVerifyAuthenticity = async (certificate) => {
    try {
      setVerifying(true);
      setVerifyResult(null);
      const cid = certificate.ipfsCID || certificate.ipfsHash;
      if (!cid) {
        toast.error('Certificate CID not found');
        return;
      }
      const ipfsUrl = resolveIPFS(cid);
      const response = await fetch(ipfsUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch certificate PDF');
      }
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const hash = CryptoJS.SHA256(wordArray);
      const calculatedHash = hash.toString(CryptoJS.enc.Hex);
      const blockchainHash = certificate.certificateHash || certificate.fileHash;
      const hashMatch = calculatedHash.toLowerCase() === blockchainHash?.toLowerCase();
      const isActive = certificate.status === 'Active' || certificate.status === 'Valid';
      const isRevoked = certificate.status === 'Revoked' || certificate.status === 'revoked';
      setVerifyResult({
        certificateId: certificate.certificateId,
        calculatedHash,
        blockchainHash,
        hashMatch,
        isActive,
        isRevoked,
        isValid: hashMatch && isActive && !isRevoked,
        message: hashMatch && isActive && !isRevoked
          ? '✓ Certificate is authentic'
          : hashMatch && isRevoked
            ? '✗ Certificate has been revoked'
            : hashMatch && !isActive
              ? '✗ Certificate has been revoked'
              : '✗ Fake PDF File - Hash mismatch'
      });
      if (hashMatch && isActive) {
        toast.success('Certificate is authentic!');
      } else if (hashMatch) {
        toast.warning('Certificate has been revoked');
      } else {
        toast.error('Fake PDF File - Hash mismatch');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify certificate');
      setVerifyResult({
        error: true,
        message: 'Failed to verify certificate: ' + error.message
      });
    } finally {
      setVerifying(false);
    }
  };
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    localStorage.removeItem('user_data');
    localStorage.removeItem('studentId');
    navigate('/auth');
  };
  const getFilteredCertificates = () => {
    if (filterTab === 'active') {
      return certificates.filter(cert => cert.status === 'Valid' || cert.status === 'Active');
    } else if (filterTab === 'revoked') {
      return certificates.filter(cert => cert.status === 'Revoked' || cert.status === 'revoked');
    }
    return certificates;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      { }
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Student Dashboard
                </h1>
                {user && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <User size={14} />
                    {user.name} ({user.studentId})
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <AnimatedButton
                variant="danger"
                size="sm"
                onClick={handleSignOut}
                icon={<LogOut size={18} />}
              >
                Sign Out
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
      { }
      <div className="max-w-7xl mx-auto px-8 py-8">
        { }
        <DashboardCard className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">My Certificates</h2>
              <p className="text-blue-100">
                View and verify your blockchain-verified certificates
              </p>
            </div>
            <div className="hidden md:block">
              <Shield size={64} className="text-white/20" />
            </div>
          </div>
        </DashboardCard>
        { }
        <div className="mb-6 flex gap-2 border-b-2 border-gray-200 dark:border-gray-700">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'revoked', label: 'Revoked' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${filterTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        { }
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading certificates...</p>
          </div>
        ) : getFilteredCertificates().length === 0 ? (
          <DashboardCard className="text-center py-12">
            <Award size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              {filterTab === 'active' ? 'No active certificates' :
                filterTab === 'revoked' ? 'No revoked certificates' :
                  'No certificates issued yet'}
            </p>
          </DashboardCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredCertificates().map((cert, index) => (
              <div key={cert.certificateId || index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CertificateCard
                  certificate={cert}
                  onView={handleViewCertificate}
                  onDownload={handleDownloadCertificate}
                  onVerify={handleVerifyAuthenticity}
                  showQR={<CertificateQRCode certificateId={cert.certificateId} />}
                  isVerifying={verifying}
                  isAdmin={false}
                />
              </div>
            ))}
          </div>
        )}
        { }
        {verifyResult && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <DashboardCard className="max-w-2xl w-full animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Verification Result
                </h2>
                <button
                  onClick={() => setVerifyResult(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle size={24} className="text-gray-500" />
                </button>
              </div>
              {verifyResult.error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
                  <p className="text-red-700 dark:text-red-300">{verifyResult.message}</p>
                </div>
              ) : (
                <>
                  <div className={`rounded-xl p-6 mb-6 ${verifyResult.isValid
                      ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
                      : verifyResult.isRevoked
                        ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800'
                    }`}>
                    <div className="flex items-center gap-4 mb-4">
                      {verifyResult.isValid ? (
                        <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
                      ) : verifyResult.isRevoked ? (
                        <XCircle size={48} className="text-red-600 dark:text-red-400" />
                      ) : (
                        <AlertCircle size={48} className="text-yellow-600 dark:text-yellow-400" />
                      )}
                      <div>
                        <h3 className={`text-xl font-bold ${verifyResult.isValid
                            ? 'text-green-700 dark:text-green-300'
                            : verifyResult.isRevoked
                              ? 'text-red-700 dark:text-red-300'
                              : 'text-yellow-700 dark:text-yellow-300'
                          }`}>
                          {verifyResult.message}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Certificate ID: {verifyResult.certificateId}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Calculated Hash (from PDF)
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-xs break-all">
                        {verifyResult.calculatedHash}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Blockchain Hash (stored)
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-xs break-all">
                        {verifyResult.blockchainHash}
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${verifyResult.hashMatch
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                      }`}>
                      <p className={`font-semibold ${verifyResult.hashMatch
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                        }`}>
                        Hash Match: {verifyResult.hashMatch ? '✓ Yes' : '✗ No'}
                      </p>
                      {!verifyResult.hashMatch && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                          The PDF file has been tampered with or is not the original certificate.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </DashboardCard>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentDashboard;
