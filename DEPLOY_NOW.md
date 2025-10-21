# 🚨 CRITICAL: Deploy Backend NOW

## Your Error
```
Admin login failed: APIError: Network error. Please try again.
POST http://localhost:5000/api/admin/login net::ERR_BLOCKED_BY_CLIENT
```

**Problem:** Frontend on Vercel is trying to reach `localhost:5000` which doesn't exist in production.

---

## ✅ SOLUTION (10 Minutes)

### Step 1: Deploy Backend on Render

1. **Go to:** https://render.com
2. **Sign in** with GitHub
3. **Click:** "New +" → "Web Service"
4. **Connect repo:** `mynamevansh/Blockchain-Certificate-Verification-`
5. **Configure:**
   ```
   Name: blockchain-cert-api
   Region: Oregon (US West)
   Branch: main
   Root Directory: (leave empty)
   Environment: Node
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   Plan: Free
   ```

6. **Add Environment Variables:**
   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = mongodb+srv://University_admin:admin123@cluster0.vhre5oy.mongodb.net/certificate_verification
   JWT_SECRET = blockchain_cert_secret_2024_change_this
   JWT_EXPIRE = 24h
   CLIENT_URL = https://your-vercel-url.vercel.app
   ```

7. **Click "Create Web Service"** (wait 3 minutes)

8. **Copy your URL:** `https://blockchain-cert-api-XXXX.onrender.com`

---

### Step 2: Update Vercel Environment Variables

1. **Go to:** https://vercel.com/dashboard
2. **Select your project**
3. **Settings** → **Environment Variables**
4. **Add this:**
   ```
   Key: REACT_APP_API_URL
   Value: https://blockchain-cert-api-XXXX.onrender.com/api
   ```
   (Replace XXXX with your actual Render URL)

5. **Click "Save"**

---

### Step 3: Redeploy Frontend

1. Go to **Deployments** tab in Vercel
2. Click on latest deployment
3. Click **"Redeploy"**
4. Wait 2 minutes

---

### Step 4: Test

1. **Backend:** Visit `https://your-render-url.onrender.com/health`
   - Should return: `{"success": true, "message": "Server is running"}`

2. **Frontend:** Visit your Vercel URL
   - Try logging in with:
     - Email: `admin@university.edu`
     - Password: `admin123`

---

## 🎉 Done!

Your app should now work perfectly!

**Note:** Render free tier spins down after 15 mins of inactivity. First request may take 30-60 seconds to wake up.

---

## Alternative: Railway (If Render doesn't work)

1. Go to: https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Add same environment variables
5. Deploy

Then update Vercel with Railway URL instead.
