# Microplastic Detection System

An advanced AI-powered full-stack application for detecting and analyzing microplastics in water samples using computer vision and machine learning.

## 🎯 Overview

This project provides a complete solution for microplastic detection in water samples. It consists of a FastAPI backend that uses a Faster R-CNN deep learning model for detection, and a modern React frontend for visualization and analysis.

## ✨ Features

- **AI-Powered Detection**: Faster R-CNN model for accurate microplastic identification
- **Real-time Analysis**: Fast detection with confidence scores and bounding boxes
- **Interactive Visualization**: Zoom, pan, and explore detected microplastics
- **Detailed Analytics**: Comprehensive charts, statistics, and detection tables
- **Export Reports**: Download detailed JSON reports of all detections
- **Modern UI/UX**: Beautiful, responsive interface built with React and Tailwind CSS
- **RESTful API**: Clean, well-documented FastAPI backend
- **Production Ready**: Configured for deployment on Railway and Vercel

## 🏗️ Architecture

```
microplastic-app/
├── backend/          # FastAPI Python backend
│   ├── main.py      # API endpoints
│   ├── model.py     # ML model loading and inference
│   └── saved_models/ # Trained model weights
└── frontend/        # React TypeScript frontend
    ├── src/         # Source code
    └── public/      # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Backend**: Python 3.11+, pip
- **Frontend**: Node.js 18+, npm/yarn/bun
- **Model**: `saved_models/microplastic_fasterrcnn.pth` (must be present)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env.local

npm run dev
```

Frontend will be available at `http://localhost:8080`

## 📚 Documentation

- **[Backend README](./backend/README.md)** - Backend API documentation, setup, and usage
- **[Frontend README](./frontend/README.md)** - Frontend setup, development, and deployment

## 🛠️ Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI** - Modern web framework
- **PyTorch** - Deep learning framework
- **Torchvision** - Computer vision utilities
- **Pillow** - Image processing
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Query** - Data fetching

## 🌐 Deployment

This project is configured for deployment on:

- **Railway** - Backend API (Python/FastAPI)
- **Vercel** - Frontend (React/Vite)

### Quick Deployment Guide

#### 1. Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variable: `CORS_ORIGINS=*` (temporarily)
5. Copy your Railway URL

#### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_BASE_URL` = your Railway URL
4. Deploy

#### 3. Update CORS

1. Go back to Railway
2. Update `CORS_ORIGINS` with your Vercel URL
3. Redeploy

For detailed deployment instructions, see the individual README files in `backend/` and `frontend/` directories.

## 📡 API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health information

### Detection
- `POST /predict` - Upload image and get microplastic detections

See [Backend README](./backend/README.md) for complete API documentation.

## 🔧 Configuration

### Backend Environment Variables

- `CORS_ORIGINS` - Comma-separated list of allowed origins (default: `*`)
- `PORT` - Server port (default: `8000`)

### Frontend Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: `http://127.0.0.1:8000`)

## 📁 Project Structure

```
microplastic-app/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── model.py                # Model loading logic
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Docker configuration
│   ├── railway.json           # Railway config
│   ├── Procfile               # Process file
│   └── saved_models/          # Model weights
│       └── microplastic_fasterrcnn.pth
├── frontend/
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── utils/             # Utilities and API
│   │   └── types/             # TypeScript types
│   ├── public/               # Static assets
│   ├── package.json          # Dependencies
│   ├── vite.config.ts        # Vite config
│   └── vercel.json           # Vercel config
└── README.md                 # This file
```

## 🧪 Development

### Running Locally

1. **Start Backend:**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Testing

**Backend:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/image.jpg"
```

**Frontend:**
- Open http://localhost:8080
- Upload an image to test detection

## 🐛 Troubleshooting

### Backend Issues

- **Model not loading**: Verify `saved_models/microplastic_fasterrcnn.pth` exists
- **CORS errors**: Check `CORS_ORIGINS` environment variable
- **Memory issues**: PyTorch models are memory-intensive; consider upgrading resources

### Frontend Issues

- **API connection failed**: Verify `VITE_API_BASE_URL` is set correctly
- **Build errors**: Ensure Node.js v18+ and all dependencies installed
- **Environment variables**: Remember `VITE_` prefix is required

## 📝 License

This project is part of a microplastic detection system for environmental research and analysis.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions:
- Check the individual README files in `backend/` and `frontend/`
- Review deployment logs in Railway/Vercel dashboards
- Check API documentation at `/docs` endpoint

## 🎓 Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [PyTorch Documentation](https://pytorch.org/docs/)

---

**Built with ❤️ for environmental research and microplastic detection**

