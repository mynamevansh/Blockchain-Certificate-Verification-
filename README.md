# 🔐 Blockchain Certificate Verification System

A secure, tamper-proof certificate verification platform enabling universities to issue digital certificates with instant verification for students and employers.

## 🚀 Live Demo

- **Frontend:** [Vercel Deployment](https://blockchain-certificate-verification.vercel.app)
- **Backend API:** [Render Deployment](https://blockchain-certificate-verification-sj2j.onrender.com)

## ✨ Features

- **Admin Dashboard:** Issue and manage certificates
- **Student Portal:** View and download certificates
- **Certificate Verification:** Instantly verify certificate authenticity
- **Secure Authentication:** JWT-based auth with role management
- **Responsive Design:** Modern UI optimized for all devices
- **RESTful API:** Clean, documented backend architecture

## 🛠️ Tech Stack

**Frontend:** React 18.3, React Router v6, Axios, Tailwind CSS  
**Backend:** Node.js, Express 5.1, MongoDB Atlas, JWT Authentication  
**Deployment:** Vercel (Frontend), Render (Backend)

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/mynamevansh/Blockchain-Certificate-Verification-.git
cd blockchain-certificate-verification
```

2. **Install dependencies**
```bash
npm install
cd client && npm install
```

3. **Configure environment variables**

Create `.env` in the `server` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

Create `.env` in the `client` folder:
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

4. **Run the application**

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd client
npm start
```

## 📁 Project Structure

```
blockchain-certify/
├── client/              # React frontend
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── styles/      # CSS files
├── server/              # Express backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── middleware/      # Auth middleware
└── vercel.json          # Vercel deployment config
```

## 🔐 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/users/login` - User login
- `POST /api/admin/register` - Register admin
- `POST /api/users/register` - Register user

### Certificates
- `GET /api/certificates/admin` - Get all certificates (Admin)
- `GET /api/certificates/user` - Get user certificates
- `POST /api/certificates/upload` - Upload certificate
- `POST /api/certificates/verify` - Verify certificate

## 🚀 Deployment

**Frontend (Vercel):**
- Connected to GitHub for auto-deployment
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `build`

**Backend (Render):**
- Deployed as a web service
- Environment variables configured in Render dashboard

## 🔮 Future Enhancements

- [ ] Integrate blockchain smart contracts for on-chain storage
- [ ] Add multi-university support
- [ ] Implement advanced analytics dashboard
- [ ] Add email notifications for certificate issuance
- [ ] Support for bulk certificate uploads
- [ ] QR code generation for certificates

## 👨‍💻 Author

**Vansh Ranawat**  
GitHub: [@mynamevansh](https://github.com/mynamevansh)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

⭐ **Star this repo if you find it helpful!**
