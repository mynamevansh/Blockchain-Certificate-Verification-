# Backend Deployment Guide

## Problem
Your frontend is deployed on Vercel, but the backend API is not deployed anywhere. The frontend is trying to connect to `http://localhost:5000` which doesn't exist in production.

## Solution: Deploy Backend Server

### Option 1: Render (Recommended - Free Tier Available)

1. **Go to Render**: https://render.com
2. **Sign up/Login** with your GitHub account
3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `mynamevansh/Blockchain-Certificate-Verification-`
   - Configure:
     - **Name**: `blockchain-cert-api`
     - **Region**: Oregon (US West)
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Environment**: `Node`
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Plan**: Free

4. **Add Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://University_admin:admin123@cluster0.vhre5oy.mongodb.net/certificate_verification`
   - `JWT_SECRET` = `your_super_secret_jwt_key_here_change_this_in_production`
   - `JWT_EXPIRE` = `24h`
   - `CLIENT_URL` = `https://your-vercel-app.vercel.app` (replace with your actual Vercel URL)

5. **Deploy**: Click "Create Web Service"

6. **Get Your API URL**: After deployment, copy the URL (e.g., `https://blockchain-cert-api.onrender.com`)

### Option 2: Railway (Alternative - Free Trial)

1. **Go to Railway**: https://railway.app
2. **Login** with GitHub
3. **New Project** → Deploy from GitHub repo
4. **Select** your repository
5. **Add Environment Variables** (same as above)
6. **Configure**:
   - Root Directory: `server`
   - Start Command: `npm start`
7. **Deploy**

### Option 3: Vercel Serverless Functions (More Complex)

This requires restructuring your Express app as serverless functions. Not recommended for this project.

---

## After Backend Deployment

### Step 1: Update Frontend Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add these variables:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api` (replace with your actual backend URL)
   - **Environments**: Production, Preview, Development

4. Add WebSocket URL (if needed):
   - **Key**: `REACT_APP_WS_URL`
   - **Value**: `https://your-backend-url.onrender.com`

5. Click **Save**

### Step 2: Redeploy Frontend

After adding environment variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** → Redeploy with existing Build Cache

OR push any change to GitHub to trigger auto-deployment.

---

## Update CORS in Backend (After Deployment)

Once you know your Vercel URL, update `server/server.js`:

```javascript
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://your-vercel-app.vercel.app',  // Add your Vercel URL
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Then commit and push to trigger redeployment.

---

## Quick Test

After both deployments:

1. Test backend: `https://your-backend-url.onrender.com/health`
   - Should return: `{"success": true, "message": "Server is running successfully"}`

2. Test frontend: Open your Vercel URL and try logging in

---

## Important Notes

- **Render Free Tier**: Spins down after 15 minutes of inactivity. First request may take 30-60 seconds.
- **MongoDB Atlas**: Ensure IP whitelist allows connections (0.0.0.0/0 for any IP)
- **Environment Variables**: Never commit `.env` files to GitHub
- **HTTPS**: Both Render and Vercel provide free SSL certificates

---

## Troubleshooting

### "Network Error" or "ERR_BLOCKED_BY_CLIENT"
- Backend not deployed or wrong API URL in Vercel env variables
- Check: `console.log(process.env.REACT_APP_API_URL)` in frontend

### "CORS Error"
- Update CORS origins in `server/server.js` to include your Vercel URL
- Redeploy backend after updating

### "Connection Refused"
- Check if backend is running: Visit `/health` endpoint
- Verify MongoDB connection string in backend env variables

### "Slow Response on First Request"
- Normal for Render free tier (cold start)
- Consider upgrading to paid tier or keeping service warm with cron jobs
