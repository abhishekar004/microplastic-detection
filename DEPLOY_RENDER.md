# 🚀 Deploy to Render + Vercel - Step by Step

Complete guide for deploying backend to Render and frontend to Vercel.

---

## 🎯 Why Render?

✅ **Pros:**
- More generous free tier (750 hours/month)
- Good for long-running services
- Free SSL certificates
- Simple configuration

✅ **Perfect for this project:**
- FastAPI works great on Render
- Easy environment variable management
- Good documentation

---

## 📋 Pre-Deployment Checklist

Before we start:
- [x] ✅ Code pushed to GitHub (already done!)
- [ ] Model file ready: `backend/saved_models/microplastic_fasterrcnn.pth`
- [ ] GitHub account logged in
- [ ] About 15-20 minutes of time

---

## 🎯 Step 1: Deploy Backend to Render (10 minutes)

### 1.1 Go to Render
👉 **Open:** https://render.com

### 1.2 Sign Up / Login
- Click "Get Started for Free" or "Log In"
- **Sign in with GitHub** (recommended)
- Authorize Render to access your GitHub

### 1.3 Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if not already connected
4. Find and select your repository: `microplastic-detection`
5. Click **"Connect"**

### 1.4 Configure the Service

Fill in these settings:

**Basic Settings:**
- **Name:** `microplastic-backend` (or your choice)
- **Region:** Choose closest to you (e.g., `Oregon (US West)`)
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend` ⚠️ **IMPORTANT!**

**Build & Deploy:**
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Plan:**
- Select **"Free"** plan (sufficient for this project)

### 1.5 Set Environment Variables
Scroll down to **"Environment Variables"** section:

Click **"Add Environment Variable"** and add:

1. **First Variable:**
   - **Key:** `CORS_ORIGINS`
   - **Value:** `*`
   - Click **"Save"**

2. **Second Variable (optional but recommended):**
   - **Key:** `PORT`
   - **Value:** `10000` (Render uses this port)
   - Click **"Save"**

### 1.6 Create the Service
1. Scroll to bottom
2. Click **"Create Web Service"**
3. Render will start building automatically
4. **First build takes 5-10 minutes** (installing PyTorch)

### 1.7 Wait for Deployment
- Watch the build logs
- Build process:
  1. Installing dependencies (this takes longest)
  2. Building service
  3. Starting service
- Wait for status to show **"Live"** ✅

### 1.8 Get Your Backend URL
1. Once deployed, Render shows your service URL
2. It will be like: `https://microplastic-backend.onrender.com`
3. **Copy this URL** - you'll need it for frontend!

### 1.9 Upload Model File (IMPORTANT!)

Your model file needs to be uploaded. Render doesn't have volumes like Railway, so we have options:

**Option A: Git LFS (Recommended for Render)**
```powershell
# Install Git LFS if not installed
# Download from: https://git-lfs.github.com/

# Initialize Git LFS
git lfs install

# Track .pth files
git lfs track "*.pth"
git lfs track "backend/saved_models/*.pth"

# Add the model file
git add .gitattributes
git add backend/saved_models/microplastic_fasterrcnn.pth

# Commit and push
git commit -m "Add model file with Git LFS"
git push origin main
```

Render will automatically rebuild after push.

**Option B: Download Script (Alternative)**
Create a script that downloads the model during build (see Step 1.10)

**Option C: Render Disk (Paid Feature)**
- Only available on paid plans
- Not recommended for free tier

### 1.10 Alternative: Download Model During Build

If Git LFS doesn't work, create a download script:

**Create `backend/download_model.sh`:**
```bash
#!/bin/bash
# Download model file if it doesn't exist
if [ ! -f "saved_models/microplastic_fasterrcnn.pth" ]; then
    echo "Model file not found. Please upload it manually or use Git LFS."
    echo "For now, creating placeholder directory..."
    mkdir -p saved_models
    # You can add wget/curl command here to download from cloud storage
fi
```

**Update `requirements.txt` or create a build script** (see troubleshooting section)

### 1.11 Test Backend
1. Visit: `https://your-service.onrender.com/health`
2. Should return JSON
3. If model isn't uploaded yet, `model_loaded` will be `false` - that's okay for now

**✅ Backend Step Complete!** 
**Save your Render URL:** `https://________________.onrender.com`

---

## 🎨 Step 2: Deploy Frontend to Vercel (5 minutes)

### 2.1 Go to Vercel
👉 **Open:** https://vercel.com

### 2.2 Sign Up / Login
- Click "Sign Up" or "Log In"
- **Sign in with GitHub** (recommended)
- Authorize Vercel to access your GitHub

### 2.3 Import Project
1. Click **"Add New"** → **"Project"**
2. Find your repository: `microplastic-detection`
3. Click **"Import"**

### 2.4 Configure Project
Vercel will auto-detect Vite. Now configure:

1. **Root Directory:**
   - Click **"Edit"** next to Root Directory
   - Change from `/` to: `frontend`
   - Click **"Continue"**

2. **Framework Preset:** Should be "Vite" (auto-detected) ✅

3. **Build Settings:**
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅
   - Install Command: `npm install` ✅

### 2.5 Set Environment Variable
**This is critical!**

1. Scroll down to **"Environment Variables"**
2. Click **"Add"**
3. Add:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** Your Render URL from Step 1.8
     - Example: `https://microplastic-backend.onrender.com`
   - **Environments:** Check all (Production, Preview, Development)
4. Click **"Save"**

### 2.6 Deploy
1. Click **"Deploy"** button
2. Wait 2-3 minutes for build
3. Vercel will show build progress

### 2.7 Get Your Frontend URL
1. After deployment, Vercel shows your URL
2. It will be like: `https://xxx.vercel.app`
3. **Copy this URL** - you'll need it for CORS!

**✅ Frontend Step Complete!**
**Save your Vercel URL:** `https://________________.vercel.app`

---

## 🔄 Step 3: Update CORS (2 minutes)

### 3.1 Go Back to Render
👉 Go back to: https://render.com

### 3.2 Update CORS Variable
1. Open your web service
2. Go to **"Environment"** tab
3. Find `CORS_ORIGINS` variable
4. Click **"Edit"** (pencil icon)
5. Change value from: `*`
6. To: Your Vercel URL from Step 2.7
   - Example: `https://xxx.vercel.app`
7. Click **"Save Changes"**

### 3.3 Render Auto-Redeploys
- Render will automatically redeploy
- Wait 2-3 minutes
- Status will show "Live" again ✅

**✅ CORS Step Complete!**

---

## 🧪 Step 4: Test Everything

### 4.1 Test Backend
```bash
# Visit in browser or use curl:
https://your-service.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "model_loaded": true,
  ...
}
```

### 4.2 Test API Docs
Visit: `https://your-service.onrender.com/docs`
- Should show FastAPI Swagger UI
- Try the `/predict` endpoint

### 4.3 Test Frontend
1. Visit your Vercel URL
2. Page should load
3. Try uploading an image
4. Check browser console (F12) for errors

### 4.4 Verify Model is Loaded
1. Go to Render → Your Service → **"Logs"**
2. Look for: `"Model loaded successfully"`
3. If you see errors about model file, upload it (Step 1.9)

---

## ✅ Success Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL obtained
- [ ] Model file uploaded (via Git LFS or other method)
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL obtained
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] `CORS_ORIGINS` updated in Render
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Image upload works end-to-end

---

## 🆘 Troubleshooting

### Backend Issues

**Build fails:**
- Check Render build logs
- Verify root directory is `backend`
- Check `requirements.txt` is correct
- Verify build command: `pip install -r requirements.txt`
- Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Model not loading:**
- Verify model file is in repository (if using Git LFS)
- Check file path: `saved_models/microplastic_fasterrcnn.pth`
- Check Render logs for file path errors
- Ensure model file is committed and pushed

**Service goes to sleep (Free tier):**
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Consider upgrading to paid plan for always-on service

**CORS errors:**
- Verify `CORS_ORIGINS` has your Vercel URL (not `*`)
- Check Render redeployed after variable change
- Wait for service to be "Live" before testing

**Memory issues:**
- PyTorch uses significant memory
- Free tier has 512MB RAM limit
- If you hit limits, consider:
  - Using CPU-only PyTorch build
  - Optimizing model loading
  - Upgrading to paid plan

### Frontend Issues

**Build fails:**
- Check Vercel logs
- Verify root directory is `frontend`
- Check `package.json` dependencies

**API calls fail:**
- Verify `VITE_API_BASE_URL` is set correctly
- Check it matches your Render URL exactly (no trailing slash)
- Check browser console for errors
- Verify Render service is "Live" (not sleeping)

**CORS errors:**
- Verify `CORS_ORIGINS` in Render includes your Vercel URL
- Check Render has redeployed
- Wait for service to be fully live

**Slow API responses:**
- First request after sleep takes ~30 seconds (cold start)
- Subsequent requests are faster
- Consider upgrading to paid plan for always-on service

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| Render (Backend) | Free | FREE ✅ | 750 hours/month, sleeps after 15min |
| Vercel (Frontend) | Free | FREE ✅ | Unlimited for personal projects |
| **Total** | | **FREE** | Perfect for development/testing |

**Note:** 
- Render free tier services sleep after inactivity (cold start ~30s)
- For production, consider Render's $7/month plan for always-on service
- Vercel free tier is excellent and sufficient

---

## 🔧 Advanced: Always-On Service (Optional)

If you want your Render service to never sleep:

1. Go to Render → Your Service → **Settings**
2. Scroll to **"Auto-Deploy"** section
3. Upgrade to **"Starter"** plan ($7/month)
4. Service will stay awake 24/7

---

## 📚 Additional Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/
- **Git LFS:** https://git-lfs.github.com/

---

## 🎉 You're Done!

Once everything is working:
1. ✅ Share your app URL with others
2. ✅ Monitor usage in Render/Vercel dashboards
3. ✅ Set up custom domains (optional)
4. ✅ Celebrate! 🎊

---

## 📝 Quick Reference

### Render Service Settings
- **Name:** `microplastic-backend`
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `CORS_ORIGINS=https://your-app.vercel.app`
  - `PORT=10000`

### Vercel Settings
- **Root Directory:** `frontend`
- **Framework:** Vite
- **Environment Variables:**
  - `VITE_API_BASE_URL=https://your-service.onrender.com`

---

**Ready? Let's start with Step 1!** 🚀

