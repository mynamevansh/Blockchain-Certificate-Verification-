# Tamper-Proof Certificate Verification System

## 🚀 Project Overview

A blockchain-based system for secure certificate issuance, verification, and revocation using Ethereum smart contracts, IPFS storage, and real-time updates.

## 🛠️ Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js + Express
- **Blockchain**: Ethereum + Solidity Smart Contracts
- **Storage**: IPFS (InterPlanetary File System)
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO WebSockets
- **Hashing**: SHA-512

## 📁 Project Structure

```
tamper-proof-certificate-verification/
├── client/          # React.js Frontend
├── server/          # Node.js Backend
├── blockchain/      # Solidity Smart Contracts
├── docs/           # Documentation
└── README.md
```

## 🔄 Working Flow

1. **Certificate Issuance**: University uploads → SHA-512 hash → IPFS storage → Blockchain record
2. **Verification**: Upload certificate → Generate hash → Check blockchain → Validate
3. **Revocation**: Authority can revoke certificates → Status updates → Real-time notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MetaMask wallet
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tamper-proof-certificate-verification
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

4. Install blockchain dependencies:
```bash
cd ../blockchain
npm install
```

### Running the Application

1. Start the frontend:
```bash
cd client
npm start
```

2. Start the backend:
```bash
cd server
npm run dev
```

3. Deploy smart contracts (when ready):
```bash
cd blockchain
truffle migrate
```

## 🔐 Environment Variables

Create `.env` files in respective directories with:
- MongoDB connection string
- IPFS API keys
- Ethereum network configuration
- Private keys (never commit these!)

## 📚 Features

- ✅ Certificate Upload & Issuance
- ✅ Real-time Verification
- ✅ Certificate Revocation
- ✅ Blockchain Integration
- ✅ IPFS Storage
- ✅ WebSocket Updates
- ✅ Responsive UI

## 🎯 Future Enhancements

- Hyperledger Fabric integration
- Mobile application
- Batch certificate processing
- Advanced analytics dashboard

## 👥 Team

Built with ❤️ for solving real-world certificate verification challenges.