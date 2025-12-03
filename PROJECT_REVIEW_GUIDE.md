# Microplastic Detection System - Project Review Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & System Design](#architecture--system-design)
3. [How the Project Works](#how-the-project-works)
4. [Execution Flow](#execution-flow)
5. [Key Technologies & Elements](#key-technologies--elements)
6. [Project Structure](#project-structure)
7. [How to Execute/Run](#how-to-executerun)
8. [Key Features](#key-features)
9. [API Endpoints](#api-endpoints)
10. [Deployment Architecture](#deployment-architecture)

---

## 🎯 Project Overview

**Microplastic Detection System** is a full-stack AI-powered web application designed to detect and analyze microplastics in water sample images using computer vision and deep learning.

### Purpose
- Automatically detect microplastics in water sample images
- Provide detailed analysis with confidence scores
- Visualize detections with bounding boxes
- Generate comprehensive reports and statistics

### Key Capabilities
- **AI-Powered Detection**: Uses Faster R-CNN deep learning model
- **Real-time Analysis**: Fast image processing and detection
- **Interactive Visualization**: Zoom, pan, and explore detected microplastics
- **Detailed Analytics**: Charts, statistics, and detection tables
- **Export Reports**: Download JSON reports of all detections

---

## 🏗️ Architecture & System Design

### High-Level Architecture

```
┌─────────────────┐         HTTP/REST API         ┌─────────────────┐
│                 │◄──────────────────────────────►│                 │
│   Frontend      │                                │    Backend      │
│   (React)       │                                │   (FastAPI)     │
│                 │                                │                 │
│  - UI/UX        │                                │  - API Server   │
│  - Visualization│                                │  - ML Model     │
│  - Charts       │                                │  - Image Proc.  │
└─────────────────┘                                └─────────────────┘
                                                           │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │  Faster R-CNN   │
                                                  │  Model (.pth)   │
                                                  └─────────────────┘
```

### Component Breakdown

#### **Frontend (React + TypeScript)**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query for API calls
- **Routing**: React Router DOM
- **Visualization**: Recharts for charts, Canvas API for image rendering

#### **Backend (Python + FastAPI)**
- **Framework**: FastAPI (modern Python web framework)
- **ML Framework**: PyTorch + Torchvision
- **Model**: Faster R-CNN ResNet50 FPN
- **Image Processing**: Pillow (PIL)
- **Server**: Uvicorn (ASGI server)

---

## 🔄 How the Project Works

### 1. **User Uploads Image**
   - User drags & drops or selects an image file (PNG, JPG, JPEG, WEBP)
   - Frontend validates file type and creates preview
   - Image is sent to backend via POST request

### 2. **Backend Processing**
   - **Image Validation**: Checks file type, size (max 10MB), dimensions
   - **Image Preprocessing**: 
     - Converts image to RGB format
     - Transforms to PyTorch tensor
     - Normalizes pixel values to [0, 1] range
   - **Model Loading**: 
     - Lazy loading (loads on first request to save memory)
     - Loads Faster R-CNN model from `saved_models/microplastic_fasterrcnn.pth`
   - **Inference**: 
     - Model processes image tensor
     - Detects microplastics with bounding boxes
     - Returns confidence scores and labels

### 3. **Detection Filtering**
   - Filters detections by confidence threshold (0.5 = 50%)
   - Validates bounding box coordinates
   - Formats results as JSON

### 4. **Frontend Visualization**
   - Receives detection results from API
   - Renders image with bounding boxes on Canvas
   - Displays statistics, charts, and detection table
   - Allows user to zoom, pan, and interact with image

### 5. **Report Generation**
   - User can download JSON report with all detection data
   - Includes timestamp, image size, detection count, and detailed bbox data

---

## 🚀 Execution Flow

### Step-by-Step Execution Process

```
1. USER ACTION
   └─> Uploads image via drag-drop or file picker
       │
       ▼
2. FRONTEND VALIDATION
   └─> Validates file type (image/*)
   └─> Creates object URL for preview
   └─> Shows loading state
       │
       ▼
3. API REQUEST
   └─> POST /predict endpoint
   └─> FormData with image file
   └─> Headers: Content-Type: multipart/form-data
       │
       ▼
4. BACKEND RECEIVES REQUEST
   └─> Validates file extension (.jpg, .jpeg, .png, .bmp, .webp)
   └─> Validates MIME type
   └─> Checks file size (max 10MB)
       │
       ▼
5. IMAGE PREPROCESSING
   └─> Opens image with PIL (Pillow)
   └─> Converts to RGB format
   └─> Validates dimensions (max 10000x10000)
   └─> Transforms to PyTorch tensor [C, H, W]
   └─> Moves tensor to device (CPU/GPU)
       │
       ▼
6. MODEL INFERENCE
   └─> Loads model (if not already loaded - lazy loading)
   └─> Sets model to eval mode
   └─> Runs inference: model([img_tensor])
   └─> Gets outputs: boxes, scores, labels
       │
       ▼
7. POST-PROCESSING
   └─> Filters by score threshold (≥0.5)
   └─> Validates bounding boxes (x1 < x2, y1 < y2)
   └─> Formats as JSON:
       {
         "width": int,
         "height": int,
         "detections": [
           {
             "bbox": [x1, y1, x2, y2],
             "score": float,
             "label": int
           }
         ]
       }
       │
       ▼
8. RESPONSE TO FRONTEND
   └─> JSON response sent back
   └─> Frontend receives data
       │
       ▼
9. VISUALIZATION
   └─> Renders image on Canvas
   └─> Draws bounding boxes with colors
   └─> Displays confidence scores
   └─> Shows statistics panel
   └─> Generates charts (bar, line, pie)
   └─> Populates detection table
       │
       ▼
10. USER INTERACTION
    └─> Can zoom/pan image
    └─> Can download JSON report
    └─> Can upload new image
```

---

## 🛠️ Key Technologies & Elements

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.11+ | Programming language |
| **FastAPI** | ≥0.104.0 | Web framework for REST API |
| **PyTorch** | Latest | Deep learning framework |
| **Torchvision** | Latest | Computer vision utilities, Faster R-CNN |
| **Pillow (PIL)** | ≥10.0.0 | Image processing |
| **Uvicorn** | ≥0.24.0 | ASGI server |
| **NumPy** | ≥1.24.0 | Numerical operations |
| **Requests** | ≥2.31.0 | HTTP client (for model download) |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 5.4.19 | Build tool & dev server |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Component library (Radix UI) |
| **React Query** | 5.83.0 | Data fetching & caching |
| **Axios** | 1.13.2 | HTTP client |
| **Recharts** | 2.15.4 | Chart library |
| **React Router** | 6.30.1 | Client-side routing |

### Machine Learning Model

- **Model Architecture**: Faster R-CNN with ResNet50 FPN backbone
- **Model File**: `backend/saved_models/microplastic_fasterrcnn.pth`
- **Classes**: 2 (background + microplastic)
- **Input**: RGB images (any size, resized by model)
- **Output**: Bounding boxes, confidence scores, labels
- **Confidence Threshold**: 0.5 (50%)

### Key Components & Files

#### Backend Files
- **`backend/main.py`**: 
  - FastAPI application setup
  - CORS configuration
  - `/predict` endpoint (main detection endpoint)
  - `/health` endpoint (health check)
  - Image validation and preprocessing
  - Model lazy loading logic

- **`backend/model.py`**: 
  - Model architecture definition
  - Model loading function
  - Custom exception handling
  - Memory optimization

- **`backend/requirements.txt`**: Python dependencies

- **`backend/saved_models/microplastic_fasterrcnn.pth`**: Trained model weights

#### Frontend Files
- **`frontend/src/pages/Index.tsx`**: 
  - Main page component
  - File upload handling
  - State management
  - Report download functionality

- **`frontend/src/components/UploadZone.tsx`**: 
  - Drag & drop file upload UI
  - File validation
  - Loading states

- **`frontend/src/components/ImageWithDetections.tsx`**: 
  - Canvas-based image rendering
  - Bounding box visualization
  - Zoom/pan functionality
  - Interactive controls

- **`frontend/src/components/StatisticsPanel.tsx`**: Statistics display

- **`frontend/src/components/Charts.tsx`**: Data visualization (bar, line, pie charts)

- **`frontend/src/components/DetectionTable.tsx`**: Tabular detection data

- **`frontend/src/utils/api.ts`**: API client functions

- **`frontend/src/types/detection.ts`**: TypeScript type definitions

---

## 📁 Project Structure

```
microplastic-detection/
├── backend/                    # Python FastAPI backend
│   ├── main.py                # FastAPI app & endpoints
│   ├── model.py               # ML model loading logic
│   ├── requirements.txt       # Python dependencies
│   ├── Procfile              # Process file for deployment
│   ├── render.yaml           # Render deployment config
│   └── saved_models/         # Model weights directory
│       └── microplastic_fasterrcnn.pth  # Trained model
│
├── frontend/                  # React TypeScript frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── Index.tsx     # Main page
│   │   │   └── NotFound.tsx  # 404 page
│   │   ├── components/       # React components
│   │   │   ├── UploadZone.tsx
│   │   │   ├── ImageWithDetections.tsx
│   │   │   ├── StatisticsPanel.tsx
│   │   │   ├── Charts.tsx
│   │   │   ├── DetectionTable.tsx
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── utils/            # Utility functions
│   │   │   └── api.ts       # API client
│   │   ├── types/           # TypeScript types
│   │   │   └── detection.ts
│   │   ├── App.tsx          # Root component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   ├── vite.config.ts      # Vite configuration
│   └── vercel.json         # Vercel deployment config
│
└── README.md                 # Project documentation
```

---

## ▶️ How to Execute/Run

### Prerequisites
- **Backend**: Python 3.11+, pip
- **Frontend**: Node.js 18+, npm/yarn/bun
- **Model File**: `backend/saved_models/microplastic_fasterrcnn.pth` must exist

### Backend Setup & Execution

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Note: PyTorch and Torchvision are installed separately
# CPU version (for Render free tier):
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Start the server
uvicorn main:app --reload --port 8000
```

**Backend will run at**: `http://localhost:8000`
**API Documentation**: `http://localhost:8000/docs` (Swagger UI)

### Frontend Setup & Execution

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file (.env.local)
echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env.local

# Start development server
npm run dev
```

**Frontend will run at**: `http://localhost:8080` (or port shown in terminal)

### Production Build

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Output in dist/ directory
```

---

## ✨ Key Features

### 1. **AI-Powered Detection**
   - Uses Faster R-CNN deep learning model
   - Pre-trained on microplastic detection dataset
   - High accuracy with confidence scores

### 2. **Real-time Analysis**
   - Fast image processing
   - Lazy model loading (saves memory)
   - Efficient inference pipeline

### 3. **Interactive Visualization**
   - Canvas-based image rendering
   - Bounding boxes with confidence scores
   - Zoom (0.5x - 3x) and pan functionality
   - Color-coded detections
   - Hover effects for better UX

### 4. **Comprehensive Analytics**
   - Statistics panel (total detections, image size)
   - Bar chart (confidence score distribution)
   - Line chart (detection trends)
   - Pie chart (confidence categories)
   - Detection table with sortable columns

### 5. **Report Export**
   - Download JSON reports
   - Includes timestamp, image metadata, all detections
   - Formatted for easy parsing

### 6. **Modern UI/UX**
   - Responsive design (mobile-friendly)
   - Drag & drop file upload
   - Loading states and animations
   - Error handling with user-friendly messages
   - Toast notifications

### 7. **Production Ready**
   - CORS configuration for cross-origin requests
   - Environment variable support
   - Health check endpoints
   - Error handling and logging
   - Memory optimization (lazy loading)

---

## 📡 API Endpoints

### 1. **GET /** - Root/Health Check
   ```json
   {
     "message": "Microplastic Detection API is running",
     "status": "healthy",
     "model_loaded": true,
     "device": "cpu"
   }
   ```

### 2. **GET /health** - Detailed Health Check
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

### 3. **POST /predict** - Main Detection Endpoint
   **Request:**
   - Method: POST
   - Content-Type: multipart/form-data
   - Body: FormData with `file` field (image file)
   
   **Response:**
   ```json
   {
     "width": 1920,
     "height": 1080,
     "detections": [
       {
         "bbox": [100.5, 200.3, 150.7, 250.9],
         "score": 0.95,
         "label": 1
       }
     ]
   }
   ```

### 4. **GET /cors-test** - CORS Configuration Test
   Returns CORS settings for debugging

---

## 🌐 Deployment Architecture

### Production Deployment

**Backend (Hugging Face Spaces)**
- Platform: Hugging Face Spaces
- SDK: Docker
- Runtime: Python 3.11+
- Port: 7860 (default Hugging Face port)
- Environment Variables:
  - `CORS_ORIGINS`: Frontend URL(s)
  - `PORT`: 7860
  - `FORCE_CPU`: "true" (optional, for CPU-only mode)
- **Benefits**:
  - Free GPU/CPU resources
  - Automatic HTTPS
  - Easy model hosting
  - Built-in version control
  - Ideal for ML applications

**Frontend (Vercel.com)**
- Platform: Vercel
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL`: Backend API URL (Hugging Face Space URL or Render URL)

### Key Deployment Considerations

1. **Model File Size**: Large model file requires Git LFS
2. **Memory Limits**: Hugging Face Spaces provides free tier with GPU/CPU options
3. **CORS Configuration**: Must match frontend URL exactly
4. **Environment Variables**: Must be set in deployment platform
5. **Build-time vs Runtime**: Frontend env vars must start with `VITE_`
6. **Hugging Face Spaces**: Provides excellent ML infrastructure ideal for ML model deployment

---

## 🔑 Important Concepts to Explain

### 1. **Faster R-CNN Model**
   - **What**: Two-stage object detection model
   - **How**: 
     - Stage 1: Region Proposal Network (RPN) generates candidate regions
     - Stage 2: Fast R-CNN classifies and refines bounding boxes
   - **Why**: High accuracy for object detection tasks

### 2. **Lazy Loading**
   - **What**: Model loads only on first request
   - **Why**: Saves memory on startup (important for deployment platforms)
   - **How**: Global variable `model` is None initially, loaded in `get_or_load_model()`

### 3. **Image Preprocessing**
   - Converts image to RGB format
   - Transforms to PyTorch tensor [C, H, W]
   - Normalizes pixel values to [0, 1]
   - Moves to appropriate device (CPU/GPU)

### 4. **Bounding Box Format**
   - Format: `[x1, y1, x2, y2]`
   - Coordinates: Top-left (x1, y1) and bottom-right (x2, y2)
   - Normalized: Values are in pixel coordinates

### 5. **Confidence Threshold**
   - Filters weak predictions (< 50% confidence)
   - Improves accuracy by removing false positives
   - Configurable via `SCORE_THRESHOLD` constant

### 6. **CORS (Cross-Origin Resource Sharing)**
   - Allows frontend (different origin) to call backend API
   - Configured via `CORSMiddleware` in FastAPI
   - Production: Specific origins, Development: Wildcard (*)

---

## 📊 Data Flow Diagram

```
User Image
    │
    ▼
[Frontend: UploadZone]
    │ (FormData)
    ▼
[API: POST /predict]
    │
    ▼
[Backend: Image Validation]
    │
    ▼
[Backend: Image Preprocessing]
    │ (PIL → Tensor)
    ▼
[Backend: Model Inference]
    │ (Faster R-CNN)
    ▼
[Backend: Post-processing]
    │ (Filter & Format)
    ▼
[JSON Response]
    │
    ▼
[Frontend: Visualization]
    │
    ▼
[Canvas Rendering]
    │
    ▼
[Charts & Statistics]
    │
    ▼
User Sees Results
```

---

## 🎓 Key Points for Review Presentation

1. **Problem Statement**: Need for automated microplastic detection in water samples
2. **Solution**: AI-powered web application using deep learning
3. **Technology Stack**: Modern full-stack (React + FastAPI + PyTorch)
4. **Architecture**: Separation of concerns (frontend/backend)
5. **ML Model**: Faster R-CNN for object detection
6. **Features**: Real-time detection, visualization, analytics, reporting
7. **Deployment**: Production-ready (Render + Vercel)
8. **Scalability**: Lazy loading, memory optimization
9. **User Experience**: Modern UI, drag-drop, interactive visualization
10. **Future Enhancements**: Batch processing, model retraining, database integration

---

## 🔍 Testing the Application

### Manual Testing Steps

1. **Start Backend**: `cd backend && uvicorn main:app --reload`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Open Browser**: Navigate to `http://localhost:8080`
4. **Upload Image**: Drag & drop or click to select an image
5. **View Results**: Check detections, charts, and statistics
6. **Test Features**: Zoom, pan, download report

### API Testing (curl)

```bash
# Health check
curl http://localhost:8000/health

# Prediction (replace with actual image path)
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/image.jpg"
```

---

## 📝 Summary

This project demonstrates:
- **Full-stack development** (React + FastAPI)
- **Deep learning integration** (PyTorch, Faster R-CNN)
- **Computer vision** (Image processing, object detection)
- **Modern web development** (TypeScript, Vite, Tailwind)
- **Production deployment** (Render, Vercel)
- **Best practices** (Type safety, error handling, CORS, lazy loading)

The system provides an end-to-end solution for microplastic detection, from image upload to detailed analysis and reporting.

---

**Good luck with your review! 🚀**

