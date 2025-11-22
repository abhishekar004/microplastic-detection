# Complete Deployment Guide - Microplastic Detection App

## 🎯 Railway vs Render Comparison

### **Railway.app** (Recommended for this project)
✅ **Pros:**
- Simpler setup, auto-detects Python/Docker
- Better for Docker deployments (you have Dockerfile)
- Faster deployments
- Free tier: $5 credit/month
- Better documentation for FastAPI
- Easier environment variable management

❌ **Cons:**
- Free tier limited (but sufficient for this project)
- Less generous free tier than Render

### **Render.com**
✅ **Pros:**
- More generous free tier (750 hours/month)
- Good for long-running services
- Free SSL certificates

❌ **Cons:**
- More configuration needed
- Slightly slower deployments
- More complex setup for Docker

### **Recommendation: Use Railway.app**
Your project has a Dockerfile and Railway configuration already set up, making Railway the better choice.

---

## 📦 Step 1: Prepare Model File for Deployment

Since the model file is not in Git, you need to upload it separately:

### Option A: Upload via Railway Dashboard (Recommended)
1. After deploying, use Railway's file upload feature
2. Or use Railway CLI to upload the file

### Option B: Use Railway Volume (Best for large files)
1. Create a volume in Railway
2. Upload model file to the volume
3. Mount it in your service

### Option C: Host model file separately
- Upload to cloud storage (AWS S3, Google Cloud Storage)
- Download during deployment

**For now, we'll use Option A (simplest).**

---

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Sign Up / Login
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up/login with your GitHub account

### 2.2 Deploy from GitHub
1. Click "Deploy from GitHub repo"
2. Select your repository: `microplastic-detection`
3. Railway will detect it's a Python project

### 2.3 Configure Service
1. Railway will create a service automatically
2. Click on the service to open settings
3. Go to **Settings** → **Root Directory**
4. Set Root Directory to: `backend`
5. Railway will auto-detect your Dockerfile

### 2.4 Set Environment Variables
1. Go to **Variables** tab
2. Add these environment variables:
   ```
   CORS_ORIGINS=*
   PORT=8000
   ```
   (We'll update CORS_ORIGINS after frontend is deployed)

### 2.5 Deploy
1. Railway will automatically start building
2. Wait for build to complete (5-10 minutes for first build)
3. Once deployed, Railway will provide a URL like: `https://your-app.up.railway.app`

### 2.6 Upload Model File
**Important:** Your model file needs to be in the deployment.

**Method 1: Using Railway CLI (Recommended)**
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Upload model file
railway run bash
# Then inside the container:
# You'll need to upload the file via Railway dashboard or use a different method
```

**Method 2: Add to Git temporarily (Quick Fix)**
Since the model is needed for deployment, you can:
1. Temporarily add it to Git LFS
2. Or create a script to download it during build

**Method 3: Use Railway Volume**
1. In Railway dashboard, go to your service
2. Click **Volumes** → **Create Volume**
3. Name it: `model-storage`
4. Mount path: `/app/saved_models`
5. Upload your model file to the volume

**For now, let's create a deployment script that handles this:**

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up / Login
1. Go to https://vercel.com
2. Sign up/login with your GitHub account

### 3.2 Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository: `microplastic-detection`
3. Vercel will auto-detect it's a Vite project

### 3.3 Configure Project
1. **Root Directory:** Set to `frontend`
2. **Framework Preset:** Vite (auto-detected)
3. **Build Command:** `npm run build` (auto-detected)
4. **Output Directory:** `dist` (auto-detected)
5. **Install Command:** `npm install` (auto-detected)

### 3.4 Set Environment Variables
1. Click **Environment Variables**
2. Add:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** Your Railway backend URL (e.g., `https://your-app.up.railway.app`)
   - **Environments:** Production, Preview, Development (check all)

### 3.5 Deploy
1. Click **Deploy**
2. Wait for build to complete (2-3 minutes)
3. Vercel will provide a URL like: `https://your-app.vercel.app`

---

## 🔄 Step 4: Update CORS Configuration

After both are deployed:

1. Go back to Railway dashboard
2. Go to your service → **Variables**
3. Update `CORS_ORIGINS`:
   - Remove: `*`
   - Add: Your Vercel URL (e.g., `https://your-app.vercel.app`)
4. Railway will automatically redeploy

---

## 📝 Step 5: Upload Model File to Railway

### Option 1: Using Railway CLI
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project (select your project when prompted)
railway link

# Upload model file (you'll need to use Railway's file system or volume)
```

### Option 2: Create a Download Script
We can create a script that downloads the model during deployment if hosted elsewhere.

### Option 3: Use Railway Volume (Best)
1. In Railway dashboard → Your Service → **Volumes**
2. Click **Create Volume**
3. Name: `model-storage`
4. Mount Path: `/app/saved_models`
5. After volume is created, you can upload files via Railway's interface

---

## ✅ Verification Checklist

- [ ] Backend deployed to Railway
- [ ] Backend URL obtained (e.g., `https://xxx.up.railway.app`)
- [ ] Model file uploaded to Railway (via volume or other method)
- [ ] Backend health check works: `https://your-backend.up.railway.app/health`
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL obtained (e.g., `https://xxx.vercel.app`)
- [ ] Environment variable `VITE_API_BASE_URL` set in Vercel
- [ ] CORS_ORIGINS updated in Railway with frontend URL
- [ ] Test image upload on deployed frontend
- [ ] Verify API responses work

---

## 🧪 Testing Your Deployment

### Test Backend
```bash
# Health check
curl https://your-backend.up.railway.app/health

# Should return:
# {
#   "status": "healthy",
#   "model_loaded": true,
#   ...
# }
```

### Test Frontend
1. Visit your Vercel URL
2. Try uploading an image
3. Check browser console for errors
4. Verify API calls are going to correct backend URL

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Model not loading**
- Solution: Ensure model file is in `/app/saved_models/` in Railway
- Check Railway logs for file path errors

**Problem: Build fails**
- Check Railway build logs
- Verify `requirements.txt` is correct
- Ensure Dockerfile is in `backend/` directory

**Problem: CORS errors**
- Verify `CORS_ORIGINS` includes your Vercel URL
- Check it's not set to `*` in production (security risk)

### Frontend Issues

**Problem: API calls failing**
- Verify `VITE_API_BASE_URL` is set correctly in Vercel
- Check browser console for CORS errors
- Ensure backend URL is accessible

**Problem: Build fails**
- Check Vercel build logs
- Verify `package.json` dependencies
- Ensure `vite.config.ts` is correct

---

## 📊 Cost Estimation

### Railway (Backend)
- Free tier: $5 credit/month
- This project: ~$3-5/month (depending on usage)
- Model loading: May use more memory

### Vercel (Frontend)
- Free tier: Unlimited for personal projects
- This project: **FREE** ✅

### Total Estimated Cost
- **$0-5/month** (likely free if within Railway's free tier)

---

## 🚀 Quick Start Commands

### Railway CLI (if using)
```powershell
# Install
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Open dashboard
railway open
```

---

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/
- Railway Python Guide: https://docs.railway.app/guides/python

---

## 🎉 Next Steps After Deployment

1. **Set up custom domains** (optional)
   - Railway: Add custom domain in settings
   - Vercel: Add custom domain in project settings

2. **Monitor your app**
   - Railway: Check metrics in dashboard
   - Vercel: View analytics

3. **Set up alerts** (optional)
   - Configure email notifications for deployment failures

4. **Optimize**
   - Enable caching if needed
   - Optimize model loading time
   - Consider CDN for static assets

