# 🚀 Deployment Summary - Microplastic Detection App

## ✅ Recommendation: Railway + Vercel

**Backend:** Railway.app (Recommended)
- ✅ Already configured with `railway.json` and `Dockerfile`
- ✅ Simpler setup, auto-detects Python/Docker
- ✅ Free tier: $5 credit/month (sufficient for this project)

**Frontend:** Vercel
- ✅ Perfect for React/Vite apps
- ✅ FREE for personal projects
- ✅ Auto-deploys on Git push
- ✅ Already configured with `vercel.json`

---

## 📝 Step-by-Step Deployment

### Part 1: Backend (Railway) - ~10 minutes

1. **Go to Railway:**
   - Visit: https://railway.app
   - Sign up/Login with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `microplastic-detection`

3. **Configure Service:**
   - Railway auto-creates a service
   - Click on the service → **Settings**
   - Set **Root Directory** to: `backend`
   - Railway will auto-detect Dockerfile

4. **Set Environment Variables:**
   - Go to **Variables** tab
   - Add:
     ```
     CORS_ORIGINS=*
     ```
   - (We'll update this after frontend is deployed)

5. **Deploy:**
   - Railway automatically starts building
   - Wait 5-10 minutes for first build
   - Copy your Railway URL: `https://xxx.up.railway.app`

6. **Upload Model File:**
   - Go to **Volumes** tab
   - Click **Create Volume**
   - Name: `model-storage`
   - Mount Path: `/app/saved_models`
   - Upload `microplastic_fasterrcnn.pth` file
   - See `backend/upload_model_railway.md` for details

7. **Verify Backend:**
   - Visit: `https://your-app.up.railway.app/health`
   - Should show: `"model_loaded": true`

---

### Part 2: Frontend (Vercel) - ~5 minutes

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import `microplastic-detection` repository

3. **Configure:**
   - **Root Directory:** `frontend` (click "Edit" to set)
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` (auto)
   - **Output Directory:** `dist` (auto)

4. **Environment Variables:**
   - Click **Environment Variables**
   - Add:
     - **Name:** `VITE_API_BASE_URL`
     - **Value:** Your Railway URL (from Part 1, step 5)
     - **Environments:** ✅ Production, ✅ Preview, ✅ Development

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your Vercel URL: `https://xxx.vercel.app`

---

### Part 3: Update CORS - ~2 minutes

1. **Go back to Railway:**
   - Open your service → **Variables**

2. **Update CORS:**
   - Find `CORS_ORIGINS`
   - Change from: `*`
   - To: Your Vercel URL (e.g., `https://xxx.vercel.app`)
   - Railway will auto-redeploy

3. **Test:**
   - Visit your Vercel URL
   - Try uploading an image
   - Check browser console for errors

---

## 🎯 Quick Reference

### Backend URLs
- **Railway Dashboard:** https://railway.app
- **Your Backend:** `https://xxx.up.railway.app`
- **Health Check:** `https://xxx.up.railway.app/health`
- **API Docs:** `https://xxx.up.railway.app/docs`

### Frontend URLs
- **Vercel Dashboard:** https://vercel.com
- **Your Frontend:** `https://xxx.vercel.app`

### Environment Variables

**Railway (Backend):**
```
CORS_ORIGINS=https://your-app.vercel.app
PORT=8000
```

**Vercel (Frontend):**
```
VITE_API_BASE_URL=https://your-app.up.railway.app
```

---

## ⚠️ Important Notes

1. **Model File:**
   - The model file (165MB) is NOT in Git
   - Must be uploaded separately to Railway
   - Use Railway Volume (see `backend/upload_model_railway.md`)

2. **CORS:**
   - Start with `CORS_ORIGINS=*` for testing
   - Update to your Vercel URL after deployment
   - Never use `*` in production for security

3. **First Deployment:**
   - Backend build: 5-10 minutes (installing PyTorch)
   - Frontend build: 2-3 minutes
   - Subsequent deployments are faster

---

## 🧪 Testing Checklist

- [ ] Backend health check returns `model_loaded: true`
- [ ] Backend API docs accessible at `/docs`
- [ ] Frontend loads without errors
- [ ] Image upload works
- [ ] Detections display correctly
- [ ] No CORS errors in browser console

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Railway (Backend) | Free Tier | $5 credit/month |
| Vercel (Frontend) | Free Tier | FREE ✅ |
| **Total** | | **$0-5/month** |

**Note:** Railway's free tier should be sufficient for this project. You'll only pay if you exceed the $5 credit.

---

## 🆘 Troubleshooting

### Backend Issues

**Problem:** Model not loading
- **Solution:** Verify model file is in Railway volume at `/app/saved_models/`
- Check Railway logs for file path errors

**Problem:** Build fails
- **Solution:** Check Railway build logs
- Verify `requirements.txt` and `Dockerfile` are correct
- Ensure root directory is set to `backend`

**Problem:** CORS errors
- **Solution:** Verify `CORS_ORIGINS` includes your Vercel URL
- Check it's not set to `*` (security risk)

### Frontend Issues

**Problem:** API calls failing
- **Solution:** Verify `VITE_API_BASE_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend URL is accessible

**Problem:** Build fails
- **Solution:** Check Vercel build logs
- Verify `package.json` dependencies
- Ensure root directory is set to `frontend`

---

## 📚 Additional Resources

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/
- **Detailed Guide:** See `DEPLOYMENT_STEPS.md`

---

## ✅ Success Criteria

Your deployment is successful when:
1. ✅ Backend health check shows `model_loaded: true`
2. ✅ Frontend loads and displays correctly
3. ✅ Image upload works end-to-end
4. ✅ Detections are displayed with bounding boxes
5. ✅ No errors in browser console or server logs

---

## 🎉 Next Steps

After successful deployment:
1. **Custom Domains** (optional)
   - Add custom domain in Railway/Vercel settings
2. **Monitoring**
   - Set up alerts for deployment failures
   - Monitor usage in Railway/Vercel dashboards
3. **Optimization**
   - Enable caching if needed
   - Optimize model loading time
   - Consider CDN for static assets

---

**Ready to deploy?** Start with `QUICK_DEPLOY.md` for the fastest path! 🚀

