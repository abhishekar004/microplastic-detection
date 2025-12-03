# Quick Reference - Microplastic Detection Project

## 🎯 Project in 30 Seconds
**What**: AI-powered web app that detects microplastics in water sample images  
**How**: Faster R-CNN deep learning model + React frontend + FastAPI backend  
**Why**: Automated detection with visualization and analytics

---

## 🏗️ Architecture (3 Layers)

```
Frontend (React) → Backend (FastAPI) → ML Model (Faster R-CNN)
```

---

## 🔄 Execution Flow (5 Steps)

1. **Upload** → User uploads image via drag-drop
2. **API Call** → Frontend sends image to `/predict` endpoint
3. **Processing** → Backend validates, preprocesses, runs ML model
4. **Detection** → Model returns bounding boxes + confidence scores
5. **Visualization** → Frontend renders image with boxes, charts, stats

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Web framework
- **PyTorch** - Deep learning
- **Faster R-CNN** - Object detection model
- **Pillow** - Image processing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/main.py` | API endpoints, image processing |
| `backend/model.py` | Model loading logic |
| `frontend/src/pages/Index.tsx` | Main page, file upload |
| `frontend/src/components/ImageWithDetections.tsx` | Canvas rendering, zoom/pan |
| `frontend/src/utils/api.ts` | API client functions |

---

## 🚀 How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health info
- `POST /predict` - Main detection endpoint (multipart/form-data)

---

## 🔑 Key Concepts

1. **Faster R-CNN**: Two-stage object detection (RPN + Fast R-CNN)
2. **Lazy Loading**: Model loads on first request (saves memory)
3. **Bounding Box**: `[x1, y1, x2, y2]` format
4. **Confidence Threshold**: 0.5 (50%) - filters weak predictions
5. **CORS**: Allows frontend to call backend API

---

## ✨ Features

- ✅ AI-powered detection
- ✅ Real-time analysis
- ✅ Interactive visualization (zoom/pan)
- ✅ Charts & statistics
- ✅ Report export (JSON)
- ✅ Modern UI/UX

---

## 📊 Data Flow

```
Image → Validation → Preprocessing → Model → Filtering → JSON → Visualization
```

---

## 💡 Important Points

- **Model File**: `backend/saved_models/microplastic_fasterrcnn.pth`
- **Classes**: 2 (background + microplastic)
- **Max File Size**: 10MB
- **Supported Formats**: PNG, JPG, JPEG, WEBP
- **Deployment**: Hugging Face Spaces (backend) + Vercel (frontend)

---

## 🎤 Presentation Tips

1. **Start**: Show the problem (microplastic pollution)
2. **Solution**: Demonstrate the app (upload image → see results)
3. **Architecture**: Explain 3-layer structure
4. **Technology**: Highlight ML model (Faster R-CNN)
5. **Features**: Show visualization, charts, export
6. **Future**: Mention improvements (batch processing, etc.)

---

## 🔍 Common Questions & Answers

**Q: Why Faster R-CNN?**  
A: High accuracy for object detection, proven architecture for small objects like microplastics.

**Q: Why lazy loading?**  
A: Saves memory on startup (important for free tier deployment).

**Q: How accurate is it?**  
A: Depends on training data. Confidence scores show detection certainty.

**Q: Can it detect other objects?**  
A: Model is trained specifically for microplastics. Would need retraining for other objects.

**Q: What's the processing time?**  
A: Typically 1-3 seconds depending on image size and hardware.

---

**Good luck! 🚀**

