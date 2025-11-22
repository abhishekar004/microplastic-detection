# Quick Git Setup Guide

## Step 1: Configure Git (Required First Time)

Run these commands with your information:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace:
- "Your Name" with your actual name (e.g., "Abhishek")
- "your.email@example.com" with your GitHub email address

## Step 2: Create Initial Commit

After configuring Git, run:

```powershell
git commit -m "Initial commit: Microplastic Detection App"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `microplastic-app` (or your preferred name)
3. Description: "AI-powered microplastic detection system"
4. Choose **Public** or **Private**
5. **DO NOT** check "Initialize with README" (we already have files)
6. Click "Create repository"

## Step 4: Connect and Push

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/microplastic-app.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: You'll be asked for credentials. Use:
- Username: Your GitHub username
- Password: A Personal Access Token (not your GitHub password)

### How to Create Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "microplastic-app-deployment"
4. Select scope: `repo` (full control)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

