# 🚀 Quick Deployment Guide

## TL;DR - Deploy in 10 Minutes

### Backend (Railway) - 5 minutes
1. Go to https://railway.app → Login with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `microplastic-detection` repository
4. Set **Root Directory** to: `backend`
5. Add environment variable: `CORS_ORIGINS=*`
6. Wait for deployment (5-10 min)
7. Copy your Railway URL: `https://xxx.up.railway.app`

### Frontend (Vercel) - 3 minutes
1. Go to https://vercel.com → Login with GitHub
2. Click "Add New" → "Project"
3. Import `microplastic-detection` repository
4. Set **Root Directory** to: `frontend`
5. Add environment variable:
   - Name: `VITE_API_BASE_URL`
   - Value: Your Railway URL from step 7
6. Click "Deploy"
7. Copy your Vercel URL: `https://xxx.vercel.app`

### Update CORS - 2 minutes
1. Go back to Railway
2. Update `CORS_ORIGINS` to your Vercel URL (remove `*`)
3. Done! ✅

---

## ⚠️ Important: Model File Upload

Your model file (`backend/saved_models/microplastic_fasterrcnn.pth`) is **NOT** in Git.

### Option 1: Railway Volume (Recommended)
1. In Railway dashboard → Your Service → **Volumes**
2. Click **Create Volume**
3. Name: `model-storage`
4. Mount Path: `/app/saved_models`
5. After volume is created, upload the `.pth` file via Railway's file manager

### Option 2: Railway CLI
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# You'll need to use Railway's web interface to upload the file
# Or use: railway run bash (then upload via other method)
```

### Option 3: Download Script (Advanced)
Create a script that downloads the model from cloud storage during build.

---

## 🎯 Which Platform?

**Railway vs Render:**
- ✅ **Use Railway** - Already configured, simpler setup
- Render is good but requires more manual configuration

**Why Railway:**
- Your project has `railway.json` and `Dockerfile` ready
- Auto-detects Python/Docker
- Faster deployments
- Better for this use case

---

## 📋 Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Backend URL copied
- [ ] Model file uploaded to Railway
- [ ] Backend health check works: `/health` endpoint
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] Frontend URL copied
- [ ] CORS updated in Railway
- [ ] Test image upload works

---

## 🧪 Quick Test

After deployment, test:

```bash
# Test backend
curl https://your-backend.up.railway.app/health

# Should return JSON with model_loaded: true
```

Then visit your Vercel URL and try uploading an image!

---

## 💰 Cost

- **Railway**: Free tier ($5 credit/month) - Should be enough
- **Vercel**: FREE for personal projects ✅
- **Total**: $0-5/month (likely FREE)

---

## 🆘 Need Help?

See `DEPLOYMENT_STEPS.md` for detailed instructions.

