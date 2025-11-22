# Uploading Model File to Render

Since Render doesn't have persistent volumes like Railway, you need to include the model file in your Git repository using **Git LFS** (Large File Storage).

## Method 1: Git LFS (Recommended)

### Step 1: Install Git LFS

**Windows:**
1. Download from: https://git-lfs.github.com/
2. Run the installer
3. Restart your terminal/PowerShell

**Verify installation:**
```powershell
git lfs version
```

### Step 2: Initialize Git LFS

```powershell
# Navigate to your project
cd C:\Users\abhis\OneDrive\Desktop\microplastic-app

# Initialize Git LFS
git lfs install
```

### Step 3: Track .pth Files

```powershell
# Track all .pth files
git lfs track "*.pth"

# Also track in specific directory
git lfs track "backend/saved_models/*.pth"

# This creates/updates .gitattributes file
```

### Step 4: Add Model File

**Important:** Since `.gitignore` ignores `*.pth` files, you need to force-add:

```powershell
# Add the .gitattributes file first
git add .gitattributes

# Force-add the model file (it will use LFS)
# The -f flag is needed because .gitignore ignores .pth files
git add -f backend/saved_models/microplastic_fasterrcnn.pth

# Commit
git commit -m "Add model file with Git LFS"

# Push to GitHub
git push origin main
```

**Note:** The `-f` flag forces Git to add the file even though it's in `.gitignore`. Git LFS will still handle it correctly.

### Step 5: Verify

```powershell
# Check if file is tracked by LFS
git lfs ls-files

# Should show: backend/saved_models/microplastic_fasterrcnn.pth
```

### Step 6: Render Auto-Rebuilds

- Render will detect the push
- Automatically rebuild your service
- Model file will be available at: `saved_models/microplastic_fasterrcnn.pth`

---

## Method 2: Download During Build (Advanced)

If Git LFS doesn't work or you prefer not to use it:

### Create Download Script

**Create `backend/download_model.sh`:**
```bash
#!/bin/bash
set -e

MODEL_PATH="saved_models/microplastic_fasterrcnn.pth"

if [ ! -f "$MODEL_PATH" ]; then
    echo "Model file not found. Downloading..."
    mkdir -p saved_models
    
    # Option 1: Download from cloud storage (AWS S3, Google Cloud, etc.)
    # wget https://your-storage.com/model.pth -O "$MODEL_PATH"
    
    # Option 2: Download from GitHub Releases
    # wget https://github.com/yourusername/repo/releases/download/v1.0/model.pth -O "$MODEL_PATH"
    
    # Option 3: Use curl
    # curl -L https://your-storage.com/model.pth -o "$MODEL_PATH"
    
    echo "Model download complete."
else
    echo "Model file already exists."
fi
```

### Update Build Process

**Option A: Modify requirements.txt (not recommended)**
- Not ideal for large files

**Option B: Use Render Build Script**

Create `backend/build.sh`:
```bash
#!/bin/bash
set -e

# Install dependencies
pip install -r requirements.txt

# Download model if needed
if [ -f "download_model.sh" ]; then
    bash download_model.sh
fi
```

Then in Render:
- **Build Command:** `bash build.sh`

**Option C: Use Python Script**

Create `backend/setup_model.py`:
```python
import os
import urllib.request

MODEL_PATH = "saved_models/microplastic_fasterrcnn.pth"

if not os.path.exists(MODEL_PATH):
    os.makedirs("saved_models", exist_ok=True)
    # Download from cloud storage
    # urllib.request.urlretrieve("https://your-storage.com/model.pth", MODEL_PATH)
    print("Model downloaded")
else:
    print("Model already exists")
```

Then in Render:
- **Build Command:** `python setup_model.py && pip install -r requirements.txt`

---

## Method 3: GitHub Releases (Alternative)

1. Create a GitHub Release
2. Upload model file as release asset
3. Download during build using wget/curl

**Build Command:**
```bash
pip install -r requirements.txt && \
mkdir -p saved_models && \
wget https://github.com/yourusername/repo/releases/download/v1.0/microplastic_fasterrcnn.pth -O saved_models/microplastic_fasterrcnn.pth
```

---

## Method 4: Cloud Storage (Best for Production)

1. Upload model to:
   - AWS S3
   - Google Cloud Storage
   - Azure Blob Storage
   - Or any cloud storage

2. Download during build:
```bash
# Example with AWS S3
pip install -r requirements.txt && \
mkdir -p saved_models && \
aws s3 cp s3://your-bucket/model.pth saved_models/microplastic_fasterrcnn.pth
```

---

## Recommended: Method 1 (Git LFS)

**Why Git LFS?**
- ✅ Simplest for Render
- ✅ No additional setup needed
- ✅ Works with free tier
- ✅ Automatic on every deploy

**Limitations:**
- GitHub free tier: 1GB LFS storage, 1GB/month bandwidth
- Your model: ~165MB (well within limits) ✅

---

## Troubleshooting

### Git LFS Not Working

**Problem:** File still too large
- **Solution:** Verify LFS is tracking the file:
  ```powershell
  git lfs ls-files
  ```

**Problem:** Render can't find model
- **Solution:** Check file path in code matches: `saved_models/microplastic_fasterrcnn.pth`
- Check Render logs for file path errors

**Problem:** Build timeout
- **Solution:** Git LFS download during build might timeout
- Consider using cloud storage instead

### Alternative: Use Render Disk (Paid)

If you upgrade to Render's paid plan:
- You can use Render Disk (persistent storage)
- Upload model file via Render dashboard
- Mount at: `/app/saved_models`

---

## Verification

After deployment:

1. **Check Render Logs:**
   - Look for: `"Model loaded successfully"`
   - Or errors about missing file

2. **Test Health Endpoint:**
   ```bash
   curl https://your-service.onrender.com/health
   ```
   Should show: `"model_loaded": true`

3. **Check File in Container:**
   - Use Render Shell (if available)
   - Or check logs for file path

---

## Summary

**For Render, use Git LFS:**
1. Install Git LFS
2. Track `.pth` files
3. Add model file
4. Commit and push
5. Render rebuilds automatically

**That's it!** 🎉

