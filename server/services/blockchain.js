const { ethers } = require('ethers');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const contractABI = require('../../contracts/CertificateVerification.abi.json');
class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.initialized = false;
  }
  async initialize() {
    if (this.initialized && this.contract) {
      return true;
    }
    try {
      const contractAddress = process.env.CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('CONTRACT_ADDRESS not set in environment variables');
      }
      const rpcUrl = process.env.SEPOLIA_RPC_URL;
      if (!rpcUrl) {
        throw new Error('SEPOLIA_RPC_URL not set in environment variables');
      }
      const { providers, Wallet, Contract } = ethers;
      this.provider = new providers.JsonRpcProvider(rpcUrl);
      const privateKey = process.env.PRIVATE_KEY;
      if (privateKey) {
        this.signer = new Wallet(privateKey, this.provider);
        console.log('✅ Blockchain service initialized with signer:', this.signer.address);
      } else {
        console.log('⚠️ No PRIVATE_KEY found. Blockchain operations will require frontend wallet connection.');
        this.signer = this.provider;
      }
      this.contract = new Contract(contractAddress, contractABI, this.signer);
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Blockchain initialization error:', error);
      throw error;
    }
  }
  async calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  }
  async issueCertificate(certificateData) {
    try {
      await this.initialize();
      if (!this.signer || !this.signer.address) {
        throw new Error('No signer available. PRIVATE_KEY must be set in environment variables for backend issuance.');
      }
      const {
        certificateId,
        certificateHash,
        ipfsCID,
        studentId,
        studentName,
        issuerSignature = '',
        force = false
      } = certificateData;
      if (!certificateId || !certificateHash || !ipfsCID || !studentId || !studentName) {
        throw new Error('Missing required certificate data fields');
      }
      console.log('📤 Issuing certificate to blockchain...');
      console.log('Certificate ID:', certificateId);
      console.log('Student:', studentName);
      const gasEstimate = await this.contract.estimateGas.issueCertificate(
        certificateId,
        certificateHash,
        ipfsCID,
        studentId,
        studentName,
        issuerSignature,
        force
      );
      const gasLimit = gasEstimate.mul(120).div(100); 
      const tx = await this.contract.issueCertificate(
        certificateId,
        certificateHash,
        ipfsCID,
        studentId,
        studentName,
        issuerSignature,
        force,
        {
          gasLimit: gasLimit
        }
      );
      console.log('⏳ Transaction sent:', tx.hash);
      console.log('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('✅ Certificate issued successfully!');
      console.log('Transaction Hash:', receipt.transactionHash);
      console.log('Block Number:', receipt.blockNumber);
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        certificateId
      };
    } catch (error) {
      console.error('❌ Blockchain issuance error:', error);
      throw error;
    }
  }
  async verifyCertificate(certificateId) {
    try {
      await this.initialize();
      const result = await this.contract.verifyCertificate(certificateId);
      const statusMap = ['Unknown', 'Active', 'Revoked'];
      const statusIndex = typeof result[6] === 'object' && result[6].toNumber ? result[6].toNumber() : Number(result[6]);
      const status = statusMap[statusIndex] || 'Unknown';
      const issuedAtTimestamp = typeof result[5] === 'object' && result[5].toNumber ? result[5].toNumber() : Number(result[5]);
      return {
        certificateId,
        certificateHash: result[0],
        ipfsCID: result[1],
        studentId: result[2],
        studentName: result[3],
        issuerAddress: result[4],
        issuedAt: new Date(issuedAtTimestamp * 1000).toISOString(),
        status,
        isValid: status === 'Active'
      };
    } catch (error) {
      console.error('❌ Blockchain verification error:', error);
      throw error;
    }
  }
  async getStudentCertificates(studentId) {
    try {
      await this.initialize();
      const totalCertificatesResult = await this.contract.getTotalCertificates();
      const totalCertificates = typeof totalCertificatesResult === 'object' && totalCertificatesResult.toNumber 
        ? totalCertificatesResult.toNumber() 
        : Number(totalCertificatesResult);
      const certificates = [];
      for (let i = 0; i < totalCertificates; i++) {
        try {
          const certId = await this.contract.getCertificateIdByIndex(i);
          const certData = await this.verifyCertificate(certId);
          if (certData.studentId === studentId) {
            certificates.push(certData);
          }
        } catch (err) {
          continue;
        }
      }
      return certificates;
    } catch (error) {
      console.error('❌ Error fetching student certificates:', error);
      throw error;
    }
  }
  async revokeCertificate(certificateId) {
    try {
      await this.initialize();
      if (!this.signer || !this.signer.address) {
        throw new Error('No signer available. PRIVATE_KEY must be set in environment variables for backend revocation.');
      }
      console.log('📤 Revoking certificate on blockchain...');
      console.log('Certificate ID:', certificateId);
      const gasEstimate = await this.contract.estimateGas.revokeCertificate(certificateId);
      const gasLimit = gasEstimate.mul(120).div(100); 
      const tx = await this.contract.revokeCertificate(certificateId, {
        gasLimit: gasLimit
      });
      console.log('⏳ Transaction sent:', tx.hash);
      console.log('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('✅ Certificate revoked successfully!');
      console.log('Transaction Hash:', receipt.transactionHash);
      console.log('Block Number:', receipt.blockNumber);
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        certificateId
      };
    } catch (error) {
      console.error('❌ Blockchain revocation error:', error);
      throw error;
    }
  }
  async activateCertificate(certificateId) {
    try {
      await this.initialize();
      if (!this.signer || !this.signer.address) {
        throw new Error('No signer available. PRIVATE_KEY must be set in environment variables for backend activation.');
      }
      console.log('📤 Activating certificate on blockchain...');
      console.log('Certificate ID:', certificateId);
      const gasEstimate = await this.contract.estimateGas.activateCertificate(certificateId);
      const gasLimit = gasEstimate.mul(120).div(100); 
      const tx = await this.contract.activateCertificate(certificateId, {
        gasLimit: gasLimit
      });
      console.log('⏳ Transaction sent:', tx.hash);
      console.log('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('✅ Certificate activated successfully!');
      console.log('Transaction Hash:', receipt.transactionHash);
      console.log('Block Number:', receipt.blockNumber);
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        certificateId
      };
    } catch (error) {
      console.error('❌ Blockchain activation error:', error);
      throw error;
    }
  }
  async isAuthorizedIssuer(address) {
    try {
      await this.initialize();
      return await this.contract.isAuthorizedIssuer(address);
    } catch (error) {
      console.error('❌ Error checking issuer authorization:', error);
      return false;
    }
  }
}
const blockchainService = new BlockchainService();
module.exports = blockchainService;
