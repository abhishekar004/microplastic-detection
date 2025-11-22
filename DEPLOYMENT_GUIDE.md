# Deployment Guide - Microplastic Detection App

## Prerequisites

### 1. Install Git (if not already installed)

**For Windows:**
- Download from: https://git-scm.com/download/win
- Or use winget: `winget install Git.Git`
- Or use Chocolatey: `choco install git`

After installation, restart your terminal/PowerShell.

### 2. Create a GitHub Account
- Go to https://github.com and create an account if you don't have one

## Step-by-Step: Push to GitHub

### Step 1: Initialize Git Repository

Open PowerShell in your project directory and run:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Microplastic Detection App"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - Repository name: `microplastic-app` (or your preferred name)
   - Description: "AI-powered microplastic detection system"
   - Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

### Step 3: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/microplastic-app.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

You'll be prompted for your GitHub username and password (use a Personal Access Token, not your password).

### Step 4: Create GitHub Personal Access Token (if needed)

If you're asked for a password, you need a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "microplastic-app-deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Use this token as your password when pushing

## Important Notes

### Model File Size
- The model file (`backend/saved_models/microplastic_fasterrcnn.pth`) might be large
- GitHub has a 100MB file size limit
- If the file is larger than 100MB, you have two options:
  1. **Use Git LFS (Large File Storage)** - Recommended for large model files
  2. **Exclude from Git** - Upload separately to Railway/Render

**To use Git LFS:**
```powershell
# Install Git LFS (if not installed)
# Download from: https://git-lfs.github.com/

# Initialize Git LFS
git lfs install

# Track .pth files
git lfs track "*.pth"

# Add the .gitattributes file
git add .gitattributes

# Add and commit as usual
git add .
git commit -m "Add model file with Git LFS"
```

**To exclude from Git:**
- Uncomment the line in `.gitignore`: `backend/saved_models/*.pth`
- Upload the model file separately to your deployment platform

## Deployment Platforms

### Backend: Railway.app or Render

**Railway.app:**
1. Go to https://railway.app
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to: `backend`
6. Add environment variable: `CORS_ORIGINS=*` (temporarily)
7. Railway will auto-detect Python and deploy
8. Copy your Railway URL (e.g., `https://your-app.railway.app`)

**Render:**
1. Go to https://render.com
2. Sign up/login with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `CORS_ORIGINS=*`
7. Deploy and copy your Render URL

### Frontend: Vercel

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variable:
   - Name: `VITE_API_BASE_URL`
   - Value: Your Railway/Render backend URL (e.g., `https://your-app.railway.app`)
7. Click "Deploy"

### Update CORS After Deployment

Once both are deployed:

1. Go back to Railway/Render
2. Update `CORS_ORIGINS` environment variable:
   - Remove `*`
   - Add your Vercel URL: `https://your-app.vercel.app`
3. Redeploy the backend

## Quick Checklist

- [ ] Git installed and configured
- [ ] GitHub account created
- [ ] Repository initialized locally
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Model file handled (Git LFS or excluded)
- [ ] Backend deployed to Railway/Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS updated with frontend URL
- [ ] Test the deployed application

## Troubleshooting

### Git Issues
- **"git is not recognized"**: Install Git and restart terminal
- **Authentication failed**: Use Personal Access Token instead of password
- **Large file error**: Use Git LFS or exclude the file

### Deployment Issues
- **Build fails**: Check logs in Railway/Vercel dashboard
- **CORS errors**: Verify `CORS_ORIGINS` includes your frontend URL
- **Model not found**: Ensure model file is included in deployment (or uploaded separately)

## Need Help?

- Git documentation: https://git-scm.com/doc
- GitHub guides: https://guides.github.com
- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs

