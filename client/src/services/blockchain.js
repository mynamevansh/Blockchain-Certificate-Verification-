import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractConfig';
class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
    this.networkId = null;
  }
  async initialize() {
    if (!window.ethereum) {
      console.warn("MetaMask not found. Blockchain operations will use backend service.");
      return false;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const sepoliaChainId = "0xaa36a7"; 
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: sepoliaChainId }],
        });
        console.log("🟢 Switched to Sepolia network");
      } catch (switchError) {
        if (switchError.code === 4902) {
          console.log("🟡 Sepolia not added — adding network...");
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: sepoliaChainId,
                chainName: "Sepolia Test Network",
                nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } else {
          console.error("🔴 Network switch failed:", switchError);
          throw switchError;
        }
      }
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.account = await this.signer.getAddress();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      const network = await this.provider.getNetwork();
      this.networkId = network.chainId;
      console.log("⚡ Blockchain initialized");
      console.log("Connected Account:", this.account);
      console.log("Network:", this.networkId);
      if (this.networkId !== 11155111) {
        console.warn("🚨 Not on Sepolia! Contract may fail");
      }
      return true;
    } catch (error) {
      console.error("Initialization error:", error);
      throw error;
    }
  }
  async generateFileHash(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target.result;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.SHA256(wordArray);
          resolve(hash.toString(CryptoJS.enc.Hex));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject("Error reading file");
      reader.readAsArrayBuffer(file);
    });
  }
  async issueCertificate(certificateData) {
    try {
      if (!this.contract) {
        const initialized = await this.initialize();
        if (!initialized || !this.contract) {
          throw new Error("MetaMask not available. Please use the backend API to issue certificates.");
        }
      }
      const certificateId = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const tx = await this.contract.issueCertificate(
        certificateId,
        certificateData.hash,
        certificateData.ipfsCID,
        certificateData.studentId,
        certificateData.studentName,
        certificateData.issuerSignature || "",
        false 
      );
      console.log("⏳ Waiting for transaction confirmation...", tx.hash);
      await tx.wait();
      return {
        certificateId,
        txHash: tx.hash,
        wallet: this.account,
      };
    } catch (error) {
      console.error("Issue Error:", error);
      throw error;
    }
  }
  async verifyCertificate(certificateId) {
    try {
      if (!this.contract) {
        const initialized = await this.initialize();
        if (!initialized || !this.contract) {
          throw new Error("MetaMask not available. Please use the backend API to verify certificates.");
        }
      }
      const result = await this.contract.verifyCertificate(certificateId);
      const statusMap = ["unknown", "active", "revoked"];
      const status = statusMap[result[6]] || "unknown";
      return {
        certificateId,
        certificateHash: result[0],
        ipfsCID: result[1],
        studentId: result[2],
        studentName: result[3],
        issuer: result[4],
        issuedAt: new Date(result[5].toNumber() * 1000).toISOString(),
        status,
        isValid: status === "active",
      };
    } catch (error) {
      console.error("Verify Error:", error);
      throw error;
    }
  }
  async revokeCertificate(certificateId, reason = "No reason provided") {
    try {
      if (!this.contract) {
        const initialized = await this.initialize();
        if (!initialized || !this.contract) {
          throw new Error("MetaMask not available. Please use the backend API to revoke certificates.");
        }
      }
      const tx = await this.contract.revokeCertificate(certificateId);
      await tx.wait();
      return {
        certificateId,
        revokedBy: this.account,
        reason,
        timestamp: new Date().toISOString(),
        txHash: tx.hash,
      };
    } catch (error) {
      console.error("Revoke Error:", error);
      throw error;
    }
  }
  getCertificateDetails(id) {
    return this.verifyCertificate(id);
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
}
const blockchainService = new BlockchainService();
export default blockchainService;
