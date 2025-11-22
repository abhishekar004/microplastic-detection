# 🚀 Quick Deploy - Render + Vercel

## TL;DR - Deploy in 15 Minutes

### Backend (Render) - 10 minutes
1. Go to https://render.com → Login with GitHub
2. Click "New +" → "Web Service"
3. Connect your `microplastic-detection` repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Environment Variables:
   - `CORS_ORIGINS=*`
6. Click "Create Web Service"
7. Wait for deployment (5-10 min)
8. Copy URL: `https://xxx.onrender.com`

### Frontend (Vercel) - 3 minutes
1. Go to https://vercel.com → Login with GitHub
2. Click "Add New" → "Project"
3. Import `microplastic-detection` repo
4. **Root Directory:** `frontend`
5. Environment Variable:
   - `VITE_API_BASE_URL` = Your Render URL
6. Click "Deploy"
7. Copy URL: `https://xxx.vercel.app`

### Update CORS - 2 minutes
1. Go back to Render
2. Update `CORS_ORIGINS` to your Vercel URL
3. Done! ✅

---

## ⚠️ Model File Upload

Render doesn't have volumes. Use **Git LFS**:

```powershell
# Install Git LFS: https://git-lfs.github.com/
git lfs install
git lfs track "*.pth"
git lfs track "backend/saved_models/*.pth"
git add .gitattributes
git add backend/saved_models/microplastic_fasterrcnn.pth
git commit -m "Add model file with Git LFS"
git push origin main
```

Render will rebuild automatically.

---

## 📋 Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Model file added via Git LFS
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_BASE_URL` set
- [ ] CORS updated
- [ ] Test image upload

---

## 💰 Cost: FREE

- Render: Free tier (750 hours/month)
- Vercel: Free for personal projects
- **Total: $0/month** ✅

---

## 🆘 Quick Troubleshooting

**Service sleeping?** Free tier sleeps after 15min. First request takes ~30s.

**Model not loading?** Check if file is in Git LFS and pushed.

**CORS errors?** Verify `CORS_ORIGINS` has your Vercel URL.

See `DEPLOY_RENDER.md` for detailed guide.

