import CryptoJS from 'crypto-js';
class BlockchainService {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.networkId = null;
  }
  async initialize() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = window.ethereum;
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        this.account = accounts[0];
        this.networkId = await window.ethereum.request({ method: 'net_version' });
        console.log('Blockchain service initialized');
        console.log('Account:', this.account);
        console.log('Network ID:', this.networkId);
        return true;
      } catch (error) {
        console.error('Error initializing blockchain service:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask not found. Please install MetaMask to use this application.');
    }
  }
  async generateFileHash(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target.result;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.SHA512(wordArray);
          resolve(hash.toString(CryptoJS.enc.Hex));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }
  async issueCertificate(certificateData) {
    try {
      if (!this.account) {
        await this.initialize();
      }
      const certificateId = `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const transaction = {
        certificateId,
        hash: certificateData.hash,
        issuer: this.account,
        recipient: certificateData.recipient,
        metadata: certificateData.metadata,
        timestamp: new Date().toISOString(),
        status: 'active',
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock transaction hash
      };
      console.log('Certificate issued (mock):', transaction);
      return transaction;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }
  }
  async verifyCertificate(certificateHash) {
    try {
      if (!this.account) {
        await this.initialize();
      }
      const mockVerification = {
        isValid: Math.random() > 0.3, // 70% chance of being valid for demo
        certificateId: `cert_${Date.now()}`,
        status: Math.random() > 0.8 ? 'revoked' : 'active', // 20% chance of being revoked
        issuer: '0x742d35Cc6321d08e73c8d4c6C9Af2b179b3d9f3f',
        timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      };
      console.log('Certificate verification (mock):', mockVerification);
      return mockVerification;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }
  }
  async revokeCertificate(certificateId, reason) {
    try {
      if (!this.account) {
        await this.initialize();
      }
      const revocation = {
        certificateId,
        revokedBy: this.account,
        reason,
        timestamp: new Date().toISOString(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      };
      console.log('Certificate revoked (mock):', revocation);
      return revocation;
    } catch (error) {
      console.error('Error revoking certificate:', error);
      throw error;
    }
  }
  async getCertificateDetails(certificateId) {
    try {
      if (!this.account) {
        await this.initialize();
      }
      const certificate = {
        certificateId,
        hash: `0x${Math.random().toString(16).substr(2, 128)}`,
        issuer: '0x742d35Cc6321d08e73c8d4c6C9Af2b179b3d9f3f',
        recipient: '0x123456789abcdef123456789abcdef1234567890',
        status: Math.random() > 0.2 ? 'active' : 'revoked',
        issuedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      };
      console.log('Certificate details (mock):', certificate);
      return certificate;
    } catch (error) {
      console.error('Error getting certificate details:', error);
      throw error;
    }
  }
  isConnected() {
    return !!this.account;
  }
  getCurrentAccount() {
    return this.account;
  }
  getNetworkId() {
    return this.networkId;
  }
  async switchNetwork(targetNetworkId = '1') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(targetNetworkId).toString(16)}` }],
      });
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  }
}
const blockchainService = new BlockchainService();
export default blockchainService;
