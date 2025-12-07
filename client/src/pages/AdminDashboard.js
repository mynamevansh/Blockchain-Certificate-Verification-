import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  LogOut,
  Plus,
  ShieldCheck,
  Upload,
  CheckCircle,
  Award,
  Wallet,
  AlertCircle,
  Trash2,
  Menu,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../constants';
import { resolveIPFS } from '../utils/ipfs';
import CertificateQRCode from '../components/CertificateQRCode';
// import StatusBadge from '../components/ui/StatusBadge'; // unused
import DashboardCard from '../components/ui/DashboardCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import CertificateCard from '../components/ui/CertificateCard';
import ThemeToggle from '../components/ui/ThemeToggle';
import blockchainService from '../services/blockchain';
const SEPOLIA_CHAIN_ID = '0xaa36a7';
const SEPOLIA_CHAIN_ID_DECIMAL = 11155111;
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('issue');
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [activating, setActivating] = useState(false);
  const [revokeModal, setRevokeModal] = useState({ open: false, certificate: null });
  const [activateModal, setActivateModal] = useState({ open: false, certificate: null });
  const [filterTab, setFilterTab] = useState('all');
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  // const [currentChainId, setCurrentChainId] = useState(null); // unused variable
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [formData, setFormData] = useState({
    file: null,
    studentId: '',
    course: '',
    degree: '',
    university: 'University of Excellence',
    gpa: '',
    graduationDate: '',
    dean: 'Dr. John Anderson',
    registrar: 'Mary Johnson'
  });
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  const checkNetwork = async () => {
    if (!isMetaMaskInstalled()) return;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      // setCurrentChainId(chainId); // unused
      const isSepolia = chainId === SEPOLIA_CHAIN_ID || parseInt(chainId, 16) === SEPOLIA_CHAIN_ID_DECIMAL;
      setIsCorrectNetwork(isSepolia);
      return isSepolia;
    } catch (error) {
      console.error('Error checking network:', error);
      setIsCorrectNetwork(false);
      return false;
    }
  };
  const switchToSepolia = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask not installed');
      return false;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          toast.error('Failed to add Sepolia network to MetaMask');
          return false;
        }
      } else {
        console.error('Error switching network:', switchError);
        toast.error('Failed to switch to Sepolia network');
        return false;
      }
    }
  };
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask not installed. Please install MetaMask to continue.');
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsWalletConnected(true);
        const isSepolia = await checkNetwork();
        if (!isSepolia) {
          toast.warning('Please switch to Sepolia network in MetaMask');
        } else {
          toast.success(`Connected: ${formatAddress(address)}`);
        }
        console.log('✅ Connected Account:', address);
        console.log('✅ Network:', isSepolia ? 'Sepolia' : 'Other');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        toast.error('User denied connection request');
      } else if (error.code === -32002) {
        toast.error('Connection request already pending. Please check MetaMask.');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };
  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsWalletConnected(false);
    // setCurrentChainId(null); // unused
    setIsCorrectNetwork(false);
    toast.info('Wallet disconnected');
  };
  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      return;
    }
    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          setIsWalletConnected(true);
          const isSepolia = await checkNetwork();
          console.log('✅ Wallet already connected');
          console.log('✅ Selected Account:', address);
          console.log('✅ Network:', isSepolia ? 'Sepolia' : 'Other');
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    };
    checkConnection();
    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        toast.info(`Account changed: ${formatAddress(accounts[0])}`);
        console.log('✅ Account changed:', accounts[0]);
      } else {
        disconnectWallet();
      }
    };
    const handleChainChanged = (chainId) => {
      // setCurrentChainId(chainId); // unused
      const isSepolia = chainId === SEPOLIA_CHAIN_ID || parseInt(chainId, 16) === SEPOLIA_CHAIN_ID_DECIMAL;
      setIsCorrectNetwork(isSepolia);
      if (isSepolia) {
        toast.success('Switched to Sepolia network');
      } else {
        toast.warning('Please switch to Sepolia network in MetaMask');
      }
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkNetwork]);
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const role = localStorage.getItem('role');
    if (!token) {
      navigate('/auth');
      return;
    }
    if (role !== 'admin' && role !== 'super_admin') {
      navigate('/student-dashboard');
      return;
    }
    fetchStudents();
    if (activeTab === 'certificates') {
      fetchCertificates();
    }
  }, [navigate, activeTab]);
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/certificates/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/certificates/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFormData({ ...formData, file });
    }
  };
  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setFormData({ ...formData, studentId });
  };
  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    if (!isWalletConnected || !walletAddress) {
      toast.error('Please connect your MetaMask wallet first');
      return;
    }
    if (!isCorrectNetwork) {
      const switchNetwork = window.confirm('Please switch to Sepolia network in MetaMask. Would you like to switch now?');
      if (switchNetwork) {
        const switched = await switchToSepolia();
        if (!switched) return;
      } else {
        return;
      }
    }
    if (!formData.file) {
      toast.error('Please select a PDF file');
      return;
    }
    if (!formData.studentId) {
      toast.error('Please select a student');
      return;
    }
    setIssuing(true);
    try {
      toast.info('📝 Generating certificate hash...');
      const fileHash = await blockchainService.generateFileHash(formData.file);
      console.log('Generated File Hash:', fileHash);
      toast.info('☁️ Uploading to IPFS...');
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.file);
      formDataToSend.append('studentId', formData.studentId);
      formDataToSend.append('course', formData.course || 'Blockchain Certification');
      formDataToSend.append('degree', formData.degree || 'Certificate of Achievement');
      formDataToSend.append('university', formData.university);
      if (formData.gpa) formDataToSend.append('gpa', formData.gpa);
      if (formData.graduationDate) formDataToSend.append('graduationDate', formData.graduationDate);
      formDataToSend.append('dean', formData.dean);
      formDataToSend.append('registrar', formData.registrar);
      formDataToSend.append('certificateHash', fileHash); 
      const uploadResponse = await fetch(`${API_BASE_URL}/api/certificates/upload-ipfs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || 'Failed to upload to IPFS');
      }
      const ipfsCID = uploadData.data?.ipfsCID || uploadData.ipfsCID;
      if (!ipfsCID) {
        throw new Error('IPFS CID not received from server');
      }
      console.log('IPFS CID:', ipfsCID);
      const selectedStudent = students.find(s => s.studentId === formData.studentId);
      if (!selectedStudent) {
        throw new Error('Student not found');
      }
      toast.info('🔐 Waiting for blockchain confirmation...');
      const blockchainResult = await blockchainService.issueCertificate({
        hash: fileHash,
        ipfsCID: ipfsCID,
        studentId: formData.studentId,
        studentName: selectedStudent.name,
        issuerSignature: walletAddress
      });
      console.log('Blockchain Result:', blockchainResult);
      toast.success(`✅ Certificate on blockchain! TX: ${blockchainResult.txHash.substring(0, 10)}...`);
      toast.info('💾 Saving to database...');
      const finalResponse = await fetch(`${API_BASE_URL}/api/certificates/issue`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: formData.studentId,
          course: formData.course || 'Blockchain Certification',
          degree: formData.degree || 'Certificate of Achievement',
          university: formData.university,
          gpa: formData.gpa,
          graduationDate: formData.graduationDate,
          dean: formData.dean,
          registrar: formData.registrar,
          ipfsCID: ipfsCID,
          certificateHash: fileHash,
          certificateId: blockchainResult.certificateId,
          transactionHash: blockchainResult.txHash,
          issuerWallet: blockchainResult.wallet
        })
      });
      const finalData = await finalResponse.json();
      if (!finalResponse.ok) {
        console.warn('Database save failed, but certificate is on blockchain:', blockchainResult.txHash);
        throw new Error(finalData.message || 'Failed to save certificate to database');
      }
      if (finalData.success) {
        toast.success('🎉 Certificate issued successfully on blockchain and database!');
        setFormData({
          file: null,
          studentId: '',
          course: '',
          degree: '',
          university: 'University of Excellence',
          gpa: '',
          graduationDate: '',
          dean: 'Dr. John Anderson',
          registrar: 'Mary Johnson'
        });
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
        if (activeTab === 'certificates') {
          fetchCertificates();
        }
      }
    } catch (error) {
      console.error('Issue error:', error);
      if (error.code === 4001) {
        toast.error('❌ Transaction rejected by user');
      } else if (error.message.includes('MetaMask')) {
        toast.error('❌ ' + error.message);
      } else {
        toast.error(error.message || 'Failed to issue certificate');
      }
    } finally {
      setIssuing(false);
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
  const handleRevokeCertificate = async () => {
    if (!revokeModal.certificate) return;
    const certificate = revokeModal.certificate;
    if (!isWalletConnected || !walletAddress) {
      toast.error('Please connect your MetaMask wallet first');
      setRevokeModal({ open: false, certificate: null });
      return;
    }
    if (!isCorrectNetwork) {
      toast.error('Please switch to Sepolia network in MetaMask');
      setRevokeModal({ open: false, certificate: null });
      return;
    }
    setRevoking(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/certificates/revoke/${certificate.certificateId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Revoked by admin'
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to revoke certificate');
      }
      if (data.success) {
        toast.success('Certificate revoked successfully!');
        setRevokeModal({ open: false, certificate: null });
        fetchCertificates();
      }
    } catch (error) {
      console.error('Revoke error:', error);
      toast.error(error.message || 'Failed to revoke certificate');
    } finally {
      setRevoking(false);
    }
  };
  const openRevokeModal = (certificate) => {
    if (certificate.status === 'Revoked') {
      toast.warning('Certificate is already revoked');
      return;
    }
    setRevokeModal({ open: true, certificate });
  };
  const handleActivateCertificate = async () => {
    if (!activateModal.certificate) return;
    const certificate = activateModal.certificate;
    if (!isWalletConnected || !walletAddress) {
      toast.error('Please connect your MetaMask wallet first');
      setActivateModal({ open: false, certificate: null });
      return;
    }
    if (!isCorrectNetwork) {
      toast.error('Please switch to Sepolia network in MetaMask');
      setActivateModal({ open: false, certificate: null });
      return;
    }
    setActivating(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/certificates/activate/${certificate.certificateId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to activate certificate');
      }
      if (data.success) {
        toast.success('Certificate activated successfully!');
        setActivateModal({ open: false, certificate: null });
        fetchCertificates();
      }
    } catch (error) {
      console.error('Activate error:', error);
      toast.error(error.message || 'Failed to activate certificate');
    } finally {
      setActivating(false);
    }
  };
  const openActivateModal = (certificate) => {
    if (certificate.status === 'Valid') {
      toast.warning('Certificate is already active');
      return;
    }
    if (certificate.status !== 'Revoked') {
      toast.warning('Certificate must be revoked to activate');
      return;
    }
    setActivateModal({ open: true, certificate });
  };
  const getFilteredCertificates = () => {
    if (filterTab === 'active') {
      return certificates.filter(cert => cert.status === 'Valid');
    } else if (filterTab === 'revoked') {
      return certificates.filter(cert => cert.status === 'Revoked');
    }
    return certificates;
  };
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/auth');
  };
  const selectedStudent = students.find(s => s.studentId === formData.studentId);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {}
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-2xl z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-72' : 'w-20'
      }`}>
        {}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <ShieldCheck size={24} className="text-white" />
            </div>
            {sidebarOpen && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CertifyChain
              </h1>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {}
        <nav className="p-4 space-y-2">
          {[
            { id: 'issue', icon: Plus, label: 'Issue Certificate' },
            { id: 'certificates', icon: Award, label: 'All Certificates' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'certificates') fetchCertificates();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        {}
        <div className="absolute bottom-4 left-4 right-4">
          <AnimatedButton
            variant="danger"
            size="md"
            onClick={handleSignOut}
            icon={<LogOut size={18} />}
            fullWidth
          >
            {sidebarOpen && 'Logout'}
          </AnimatedButton>
        </div>
      </div>
      {}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeTab === 'issue' ? 'Issue Certificate' : 'Certificate Management'}
            </h2>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {!isMetaMaskInstalled() ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">MetaMask not installed</span>
                </div>
              ) : !isWalletConnected ? (
                <AnimatedButton
                  variant="primary"
                  size="sm"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  icon={<Wallet size={18} />}
                >
                  {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                </AnimatedButton>
              ) : (
                <div className="flex items-center gap-3">
                  {!isCorrectNetwork && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                      <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Wrong Network</span>
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        onClick={switchToSepolia}
                      >
                        Switch
                      </AnimatedButton>
                    </div>
                  )}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                    isCorrectNetwork 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-sm font-medium ${
                      isCorrectNetwork 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {formatAddress(walletAddress)}
                    </span>
                    <button
                      onClick={disconnectWallet}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {}
        <div className="p-8">
          {activeTab === 'issue' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <DashboardCard>
                <form onSubmit={handleIssueCertificate} className="space-y-6">
                  {}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Upload Certificate PDF *
                    </label>
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                      formData.file 
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-blue-400'
                    }`}>
                      <input
                        id="file-input"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="file-input" className="cursor-pointer">
                        <Upload size={48} className={`mx-auto mb-3 ${formData.file ? 'text-green-600' : 'text-gray-400'}`} />
                        {formData.file ? (
                          <div>
                            <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
                            <p className="font-semibold text-green-700 dark:text-green-300">{formData.file.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Click to upload PDF</p>
                            <p className="text-sm text-gray-500 mt-1">Max size: 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  {}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Select Student *
                    </label>
                    <select
                      value={formData.studentId}
                      onChange={handleStudentChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">-- Select Student --</option>
                      {students.map(student => (
                        <option key={student.studentId} value={student.studentId}>
                          {student.name} ({student.studentId})
                        </option>
                      ))}
                    </select>
                    {selectedStudent && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Email: {selectedStudent.email}
                      </p>
                    )}
                  </div>
                  {}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Course
                      </label>
                      <input
                        type="text"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        placeholder="e.g., Blockchain Certification"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        placeholder="e.g., Certificate of Achievement"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  {}
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={issuing || !formData.file || !formData.studentId || !isWalletConnected || !isCorrectNetwork}
                    fullWidth
                    icon={issuing ? null : <Upload size={20} />}
                  >
                    {issuing 
                      ? 'Issuing Certificate...' 
                      : !isWalletConnected 
                        ? 'Connect Wallet to Issue Certificate'
                        : !isCorrectNetwork
                          ? 'Switch to Sepolia Network'
                          : 'Issue Certificate to Blockchain'}
                  </AnimatedButton>
                </form>
              </DashboardCard>
              {}
              <DashboardCard className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <ShieldCheck size={20} />
                  How it works:
                </h3>
                <ol className="text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                  <li>Upload the certificate PDF file</li>
                  <li>Select a student (only Shashank, Shreyas, or Vansh)</li>
                  <li>Click "Issue Certificate" - the system will:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Upload PDF to Pinata IPFS</li>
                      <li>Calculate SHA-256 hash</li>
                      <li>Store on blockchain</li>
                    </ul>
                  </li>
                </ol>
              </DashboardCard>
            </div>
          )}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              {}
              <div className="flex gap-2 border-b-2 border-gray-200 dark:border-gray-700">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'active', label: 'Active' },
                  { id: 'revoked', label: 'Revoked' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id)}
                    className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                      filterTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {}
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
                    <div key={cert._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CertificateCard
                        certificate={cert}
                        onView={handleViewCertificate}
                        onRevoke={openRevokeModal}
                        onActivate={openActivateModal}
                        showQR={<CertificateQRCode certificateId={cert.certificateId} />}
                        isRevoking={revoking}
                        isActivating={activating}
                        isAdmin={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {}
      {revokeModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <DashboardCard className="max-w-md w-full animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Revoke Certificate</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to revoke this certificate? This action will:
            </p>
            <ul className="text-gray-600 dark:text-gray-400 mb-6 space-y-2 list-disc list-inside">
              <li>Mark the certificate as revoked on the blockchain</li>
              <li>Update the certificate status in the database</li>
              <li>Make the certificate invalid for verification</li>
            </ul>
            {revokeModal.certificate && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <strong>Certificate ID:</strong> {revokeModal.certificate.certificateId}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <strong>Student:</strong> {revokeModal.certificate.studentName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Course:</strong> {revokeModal.certificate.course}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <AnimatedButton
                variant="secondary"
                onClick={() => setRevokeModal({ open: false, certificate: null })}
                disabled={revoking}
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                variant="danger"
                onClick={handleRevokeCertificate}
                disabled={revoking}
                icon={<Trash2 size={18} />}
              >
                {revoking ? 'Revoking...' : 'Confirm Revoke'}
              </AnimatedButton>
            </div>
          </DashboardCard>
        </div>
      )}
      {}
      {activateModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <DashboardCard className="max-w-md w-full animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Activate Certificate</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to activate this certificate? This action will:
            </p>
            <ul className="text-gray-600 dark:text-gray-400 mb-6 space-y-2 list-disc list-inside">
              <li>Mark the certificate as active on the blockchain</li>
              <li>Update the certificate status in the database</li>
              <li>Make the certificate valid for verification again</li>
            </ul>
            {activateModal.certificate && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <strong>Certificate ID:</strong> {activateModal.certificate.certificateId}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <strong>Student:</strong> {activateModal.certificate.studentName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Course:</strong> {activateModal.certificate.course}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <AnimatedButton
                variant="secondary"
                onClick={() => setActivateModal({ open: false, certificate: null })}
                disabled={activating}
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                variant="success"
                onClick={handleActivateCertificate}
                disabled={activating}
                icon={<CheckCircle size={18} />}
              >
                {activating ? 'Activating...' : 'Confirm Activate'}
              </AnimatedButton>
            </div>
          </DashboardCard>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;