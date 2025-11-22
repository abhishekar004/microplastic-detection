# 🚀 Let's Deploy Your App - Step by Step

Follow these steps in order. I'll guide you through each one.

---

## 📋 Pre-Deployment Checklist

Before we start, make sure you have:
- [x] ✅ Code pushed to GitHub (already done!)
- [ ] Model file ready: `backend/saved_models/microplastic_fasterrcnn.pth`
- [ ] GitHub account logged in
- [ ] About 15-20 minutes of time

---

## 🎯 Step 1: Deploy Backend to Railway (10 minutes)

### 1.1 Go to Railway
👉 **Open:** https://railway.app

### 1.2 Sign Up / Login
- Click "Start a New Project" or "Login"
- **Sign in with GitHub** (recommended)
- Authorize Railway to access your GitHub

### 1.3 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select: `microplastic-detection` (or your repo name)
4. Click **"Deploy Now"**

### 1.4 Configure the Service
Railway will auto-create a service. Now configure it:

1. **Click on the service** (it will have a random name)
2. Go to **Settings** tab
3. Find **"Root Directory"**
4. Click **"Edit"** and set to: `backend`
5. Click **"Save"**

### 1.5 Set Environment Variables
1. Go to **Variables** tab
2. Click **"New Variable"**
3. Add:
   - **Name:** `CORS_ORIGINS`
   - **Value:** `*`
   - Click **"Add"**

### 1.6 Wait for Deployment
- Railway will start building automatically
- **First build takes 5-10 minutes** (installing PyTorch)
- Watch the build logs
- Wait for status to show "Active" ✅

### 1.7 Get Your Backend URL
1. Go to **Settings** tab
2. Find **"Domains"** section
3. Railway provides a URL like: `https://xxx.up.railway.app`
4. **Copy this URL** - you'll need it for frontend!

### 1.8 Upload Model File (IMPORTANT!)
Your model file needs to be uploaded:

**Option A: Railway Volume (Recommended)**
1. Go to **Volumes** tab
2. Click **"Create Volume"**
3. Name: `model-storage`
4. Mount Path: `/app/saved_models`
5. Click **"Create"**
6. After volume is created, you'll see upload options
7. Upload your `microplastic_fasterrcnn.pth` file
8. File should be at: `/app/saved_models/microplastic_fasterrcnn.pth`

**Option B: If Volume doesn't work**
- We'll use Railway CLI or another method
- See `backend/upload_model_railway.md` for alternatives

### 1.9 Test Backend
1. Visit: `https://your-app.up.railway.app/health`
2. Should return JSON with `"model_loaded": true` or `false`
3. If `false`, model file isn't uploaded yet - that's okay, we'll fix it

**✅ Backend Step Complete!** 
**Save your Railway URL:** `https://________________.up.railway.app`

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
   - **Value:** Your Railway URL from Step 1.7
     - Example: `https://xxx.up.railway.app`
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

### 3.1 Go Back to Railway
👉 Go back to: https://railway.app

### 3.2 Update CORS Variable
1. Open your service
2. Go to **Variables** tab
3. Find `CORS_ORIGINS`
4. Click **"Edit"** (or the pencil icon)
5. Change value from: `*`
6. To: Your Vercel URL from Step 2.7
   - Example: `https://xxx.vercel.app`
7. Click **"Save"**

### 3.3 Railway Auto-Redeploys
- Railway will automatically redeploy
- Wait 1-2 minutes
- Status will show "Active" again ✅

**✅ CORS Step Complete!**

---

## 🧪 Step 4: Test Everything

### 4.1 Test Backend
```bash
# Visit in browser or use curl:
https://your-backend.up.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "model_loaded": true,
  ...
}
```

### 4.2 Test Frontend
1. Visit your Vercel URL
2. Page should load
3. Try uploading an image
4. Check browser console (F12) for errors

### 4.3 Verify Model is Loaded
1. Go to Railway → Your Service → **Logs**
2. Look for: `"Model loaded successfully"`
3. If you see errors about model file, upload it (Step 1.8)

---

## ✅ Success Checklist

- [ ] Backend deployed to Railway
- [ ] Backend URL obtained
- [ ] Model file uploaded (or in progress)
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL obtained
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] `CORS_ORIGINS` updated in Railway
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Image upload works end-to-end

---

## 🆘 If Something Goes Wrong

### Backend Issues

**Build fails:**
- Check Railway logs
- Verify root directory is `backend`
- Check `requirements.txt` is correct

**Model not loading:**
- Verify model file is uploaded to volume
- Check file path: `/app/saved_models/microplastic_fasterrcnn.pth`
- Check Railway logs for errors

**CORS errors:**
- Verify `CORS_ORIGINS` has your Vercel URL (not `*`)
- Check Railway redeployed after variable change

### Frontend Issues

**Build fails:**
- Check Vercel logs
- Verify root directory is `frontend`
- Check `package.json` dependencies

**API calls fail:**
- Verify `VITE_API_BASE_URL` is set correctly
- Check it matches your Railway URL exactly
- Check browser console for errors

**CORS errors:**
- Verify `CORS_ORIGINS` in Railway includes your Vercel URL
- Check Railway has redeployed

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Detailed Guide:** See `DEPLOYMENT_STEPS.md`

---

## 🎉 You're Done!

Once everything is working:
1. ✅ Share your app URL with others
2. ✅ Monitor usage in Railway/Vercel dashboards
3. ✅ Set up custom domains (optional)
4. ✅ Celebrate! 🎊

---

**Ready? Let's start with Step 1!** 🚀

