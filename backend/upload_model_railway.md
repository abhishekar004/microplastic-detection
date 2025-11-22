# Uploading Model File to Railway

Since the model file is large (165MB) and not in Git, you need to upload it separately to Railway.

## Method 1: Railway Volume (Easiest)

1. **Create Volume in Railway:**
   - Go to Railway dashboard → Your Service
   - Click **Volumes** tab
   - Click **Create Volume**
   - Name: `model-storage`
   - Mount Path: `/app/saved_models`
   - Click **Create**

2. **Upload Model File:**
   - After volume is created, Railway will show file upload options
   - Upload `microplastic_fasterrcnn.pth` to the volume
   - File should be at: `/app/saved_models/microplastic_fasterrcnn.pth`

3. **Verify:**
   - Check Railway logs to ensure model loads
   - Visit: `https://your-app.up.railway.app/health`
   - Should show `"model_loaded": true`

## Method 2: Railway CLI

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link
# Select your project when prompted

# Open shell in Railway container
railway run bash

# Then you can use wget/curl to download from cloud storage
# Or use Railway's web interface to upload
```

## Method 3: Download During Build (Advanced)

Create a `download_model.sh` script:

```bash
#!/bin/bash
# Add this to your Dockerfile or create a build script

if [ ! -f "saved_models/microplastic_fasterrcnn.pth" ]; then
    echo "Downloading model file..."
    # Download from cloud storage (AWS S3, Google Cloud, etc.)
    # Example:
    # wget https://your-storage.com/model.pth -O saved_models/microplastic_fasterrcnn.pth
fi
```

Then modify `Dockerfile` to run this script during build.

## Method 4: Git LFS (If you want to include in Git)

```powershell
# Install Git LFS
# Download from: https://git-lfs.github.com/

# Initialize
git lfs install

# Track .pth files
git lfs track "*.pth"

# Add and commit
git add .gitattributes
git add backend/saved_models/microplastic_fasterrcnn.pth
git commit -m "Add model file with Git LFS"
git push
```

**Note:** Git LFS has storage limits on free GitHub accounts.

## Recommended: Method 1 (Railway Volume)

This is the simplest and most reliable method for Railway deployments.

