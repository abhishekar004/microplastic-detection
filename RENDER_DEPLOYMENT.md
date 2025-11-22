# 🚀 Complete Render Deployment Guide

This guide will help you deploy your Microplastic Detection App to Render (backend) and Vercel (frontend).

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account
- ✅ Code pushed to GitHub repository
- ✅ Model file ready: `backend/saved_models/microplastic_fasterrcnn.pth`
- ✅ About 20-30 minutes

---

## 🎯 Step 1: Set Up Git LFS for Model File (IMPORTANT!)

Since Render doesn't have persistent volumes, we need to include the model file in Git using Git LFS.

### 1.1 Install Git LFS

**Windows:**
1. Download from: https://git-lfs.github.com/
2. Run the installer
3. Restart your terminal/PowerShell

**Verify installation:**
```powershell
git lfs version
```

### 1.2 Initialize Git LFS

```powershell
# Navigate to your project directory
cd C:\Users\abhis\OneDrive\Desktop\microplastic-app

# Initialize Git LFS
git lfs install
```

### 1.3 Track Model Files

The `.gitattributes` file is already configured, but verify it exists:

```powershell
# Check if .gitattributes exists
cat .gitattributes
# Should show: *.pth filter=lfs diff=lfs merge=lfs -text
```

If it doesn't exist or is missing, create it:
```powershell
git lfs track "*.pth"
git lfs track "backend/saved_models/*.pth"
```

### 1.4 Add Model File to Git

```powershell
# Add .gitattributes (if you just created it)
git add .gitattributes

# Force-add the model file (needed because .gitignore ignores .pth files)
git add -f backend/saved_models/microplastic_fasterrcnn.pth

# Commit
git commit -m "Add model file with Git LFS"

# Push to GitHub
git push origin main
```

### 1.5 Verify Git LFS Tracking

```powershell
# Check if file is tracked by LFS
git lfs ls-files

# Should show: backend/saved_models/microplastic_fasterrcnn.pth
```

**✅ Model file is now ready for deployment!**

---

## 🌐 Step 2: Deploy Backend to Render

### 2.1 Sign Up / Login to Render

1. Go to **https://render.com**
2. Click **"Get Started for Free"** or **"Log In"**
3. **Sign in with GitHub** (recommended)
4. Authorize Render to access your GitHub repositories

### 2.2 Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. If not connected, click **"Connect account"** and authorize
4. Find and select your repository
5. Click **"Connect"**

### 2.3 Configure the Service

Fill in these settings:

**Basic Settings:**
- **Name:** `microplastic-backend` (or your choice)
- **Region:** Choose closest to you (e.g., `Oregon (US West)`)
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend` ⚠️ **IMPORTANT!**

**Build & Deploy:**
- **Runtime:** `Python 3`
- **Build Command:** `pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu && pip install -r requirements.txt`
  - ⚠️ **IMPORTANT:** This installs CPU-only PyTorch (~200MB) instead of full version (~1GB+) to fit within 512MB free tier
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Plan:**
- Select **"Free"** plan (sufficient for this project)

### 2.4 Set Environment Variables

Scroll down to **"Environment Variables"** section:

Click **"Add Environment Variable"** and add:

1. **First Variable:**
   - **Key:** `CORS_ORIGINS`
   - **Value:** `*` (we'll update this later)
   - Click **"Save"**

2. **Second Variable (IMPORTANT for free tier):**
   - **Key:** `FORCE_CPU`
   - **Value:** `true` (forces CPU mode, saves memory)
   - Click **"Save"**

3. **Third Variable (optional):**
   - **Key:** `PORT`
   - **Value:** `10000` (Render sets this automatically, but you can specify)
   - Click **"Save"**

### 2.5 Create the Service

1. Scroll to bottom
2. Click **"Create Web Service"**
3. Render will start building automatically
4. **First build takes 5-10 minutes** (installing PyTorch and dependencies)

### 2.6 Wait for Deployment

- Watch the build logs in real-time
- Build process:
  1. Installing dependencies (this takes longest - PyTorch is large)
  2. Building service
  3. Starting service
- Wait for status to show **"Live"** ✅

### 2.7 Get Your Backend URL

1. Once deployed, Render shows your service URL at the top
2. It will be like: `https://microplastic-backend.onrender.com`
3. **Copy this URL** - you'll need it for frontend!

### 2.8 Test Backend

1. Visit: `https://your-service.onrender.com/health`
2. Should return JSON with model status
3. If model isn't loaded yet, check logs (see troubleshooting)

**✅ Backend deployed!**

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up / Login to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. **Sign in with GitHub** (recommended)
4. Authorize Vercel to access your GitHub

### 3.2 Import Project

1. Click **"Add New"** → **"Project"**
2. Find your repository
3. Click **"Import"**

### 3.3 Configure Project

Vercel will auto-detect Vite. Configure:

1. **Root Directory:**
   - Click **"Edit"** next to Root Directory
   - Change from `/` to: `frontend`
   - Click **"Continue"**

2. **Framework Preset:** Should be "Vite" (auto-detected) ✅

3. **Build Settings:**
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅
   - Install Command: `npm install` ✅

### 3.4 Set Environment Variable

**This is critical!**

1. Scroll down to **"Environment Variables"**
2. Click **"Add"**
3. Add:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** Your Render URL from Step 2.7
     - Example: `https://microplastic-backend.onrender.com`
   - **Environments:** Check all (Production, Preview, Development)
4. Click **"Save"**

### 3.5 Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build
3. Vercel will show build progress

### 3.6 Get Your Frontend URL

1. After deployment, Vercel shows your URL
2. It will be like: `https://xxx.vercel.app`
3. **Copy this URL** - you'll need it for CORS!

**✅ Frontend deployed!**

---

## 🔄 Step 4: Update CORS Configuration

After both are deployed:

1. Go back to **Render Dashboard**
2. Open your web service
3. Go to **"Environment"** tab
4. Find `CORS_ORIGINS` variable
5. Click **"Edit"** (pencil icon)
6. Change value from: `*`
7. To: Your Vercel URL from Step 3.6
   - Example: `https://xxx.vercel.app`
8. Click **"Save Changes"**

### 4.1 Render Auto-Redeploys

- Render will automatically redeploy
- Wait 2-3 minutes
- Status will show "Live" again ✅

**✅ CORS configured!**

---

## 🧪 Step 5: Test Everything

### 5.1 Test Backend

```bash
# Visit in browser or use curl:
https://your-service.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "saved_models/microplastic_fasterrcnn.pth",
  "model_exists": true,
  "device": "cpu",
  "cuda_available": false
}
```

### 5.2 Test API Docs

Visit: `https://your-service.onrender.com/docs`
- Should show FastAPI Swagger UI
- Try the `/predict` endpoint

### 5.3 Test Frontend

1. Visit your Vercel URL
2. Page should load without errors
3. Try uploading an image
4. Check browser console (F12) for errors
5. Verify API calls are working

### 5.4 Verify Model is Loaded

1. Go to Render → Your Service → **"Logs"**
2. Look for: `"Model loaded successfully"`
3. If you see errors about model file, check Git LFS setup

---

## ✅ Success Checklist

- [ ] Git LFS installed and configured
- [ ] Model file added to Git with LFS
- [ ] Model file pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Backend URL obtained
- [ ] Backend health check works (`/health` endpoint)
- [ ] Model loaded successfully (check logs)
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL obtained
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] `CORS_ORIGINS` updated in Render with frontend URL
- [ ] Frontend loads without errors
- [ ] Image upload works end-to-end
- [ ] API responses work correctly

---

## 🆘 Troubleshooting

### Backend Issues

**Build fails:**
- Check Render build logs
- Verify root directory is `backend`
- Check `requirements.txt` is correct
- Verify build command includes CPU-only PyTorch: `pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu && pip install -r requirements.txt`
- Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Model not loading:**
- Verify model file is in Git LFS: `git lfs ls-files`
- Check file path: `saved_models/microplastic_fasterrcnn.pth`
- Check Render logs for file path errors
- Ensure model file is committed and pushed
- Verify `.gitattributes` is configured correctly

**Service goes to sleep (Free tier):**
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- This is normal behavior for free tier
- Consider upgrading to paid plan ($7/month) for always-on service

**CORS errors:**
- Verify `CORS_ORIGINS` has your Vercel URL (not `*`)
- Check Render redeployed after variable change
- Wait for service to be "Live" before testing
- Check browser console for exact CORS error message

**Memory issues (Out of memory / 512MB limit):**
- ⚠️ **Common issue on Render free tier**
- **Solution 1:** Ensure you're using CPU-only PyTorch in build command:
  - Build Command: `pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu && pip install -r requirements.txt`
- **Solution 2:** Add `FORCE_CPU=true` environment variable
- **Solution 3:** Check Render logs - if build fails during `pip install`, it's likely PyTorch size
- **Solution 4:** If still failing, consider:
  - Upgrading to Render Starter plan ($7/month) - 512MB → 2GB RAM
  - Or use alternative deployment (Railway, Fly.io, etc.)

**Build timeout:**
- Git LFS download during build might timeout
- Consider using cloud storage instead (see `backend/upload_model_render.md`)

### Frontend Issues

**Build fails:**
- Check Vercel logs
- Verify root directory is `frontend`
- Check `package.json` dependencies
- Verify `vite.config.ts` is correct

**API calls fail:**
- Verify `VITE_API_BASE_URL` is set correctly
- Check it matches your Render URL exactly (no trailing slash)
- Check browser console for errors
- Verify Render service is "Live" (not sleeping)
- Wait for cold start if service was sleeping

**CORS errors:**
- Verify `CORS_ORIGINS` in Render includes your Vercel URL
- Check Render has redeployed
- Wait for service to be fully live
- Check exact error in browser console

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
2. Scroll to **"Plan"** section
3. Upgrade to **"Starter"** plan ($7/month)
4. Service will stay awake 24/7
5. No cold starts!

---

## 📚 Additional Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/
- **Git LFS:** https://git-lfs.github.com/
- **Detailed Model Upload Guide:** `backend/upload_model_render.md`

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
  - `PORT=10000` (optional)

### Vercel Settings
- **Root Directory:** `frontend`
- **Framework:** Vite
- **Environment Variables:**
  - `VITE_API_BASE_URL=https://your-service.onrender.com`

---

**Ready? Start with Step 1!** 🚀

