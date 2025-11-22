# Microplastic Detection API - Backend

A FastAPI-based REST API for detecting microplastics in images using a Faster R-CNN deep learning model.

## Overview

This backend service provides an AI-powered endpoint for microplastic detection in water sample images. It uses PyTorch and a pre-trained Faster R-CNN model to identify and locate microplastics with bounding boxes and confidence scores.

## Features

- **AI-Powered Detection**: Faster R-CNN model for accurate microplastic detection
- **RESTful API**: Clean FastAPI endpoints with automatic documentation
- **Image Validation**: Comprehensive file validation (type, size, dimensions)
- **CORS Support**: Configurable CORS for frontend integration
- **Health Checks**: Built-in health check endpoints
- **Error Handling**: Robust error handling and logging

## Technologies

- **Python 3.11+** - Programming language
- **FastAPI** - Modern, fast web framework
- **PyTorch** - Deep learning framework
- **Torchvision** - Computer vision utilities
- **Pillow (PIL)** - Image processing
- **Uvicorn** - ASGI server

## Prerequisites

- Python 3.11 or higher
- pip package manager
- Model weights file: `saved_models/microplastic_fasterrcnn.pth`

## Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ensure model file exists:**
   - Make sure `saved_models/microplastic_fasterrcnn.pth` is present in the backend directory

## Running the Server

### Development Mode

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
```

The server will use the `PORT` environment variable if set, otherwise defaults to 8000.

## API Endpoints

### Health Check

**GET** `/`
```json
{
  "message": "Microplastic Detection API is running",
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu"
}
```

**GET** `/health`
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

### Prediction

**POST** `/predict`

Upload an image file to detect microplastics.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing the image

**Response:**
```json
{
  "width": 1920,
  "height": 1080,
  "detections": [
    {
      "bbox": [100, 150, 200, 250],
      "score": 0.95,
      "label": 1
    }
  ]
}
```

**Response Fields:**
- `width`: Image width in pixels
- `height`: Image height in pixels
- `detections`: Array of detected microplastics
  - `bbox`: Bounding box coordinates `[x1, y1, x2, y2]`
  - `score`: Confidence score (0.0 to 1.0)
  - `label`: Detection label (1 = microplastic)

## Configuration

### Environment Variables

- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins (default: `*`)
  - Example: `CORS_ORIGINS=https://example.com,https://app.vercel.app`
  - For development: `CORS_ORIGINS=http://localhost:8080`
- `PORT`: Server port (default: `8000`)

### Model Configuration

- **Model Path**: `saved_models/microplastic_fasterrcnn.pth`
- **Score Threshold**: 0.5 (configurable in `main.py`)
- **Max File Size**: 10MB
- **Allowed Formats**: JPG, JPEG, PNG, BMP, WEBP

## API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── main.py              # FastAPI application and endpoints
├── model.py             # Model loading and inference logic
├── requirements.txt     # Python dependencies
├── render.yaml         # Render deployment configuration
├── Procfile            # Process file for Render
└── saved_models/       # Model weights directory
    └── microplastic_fasterrcnn.pth
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful prediction
- `400 Bad Request`: Invalid file format, size, or dimensions
- `503 Service Unavailable`: Model not loaded
- `500 Internal Server Error`: Server error during processing

## Deployment

### Render

This backend is configured for deployment on Render:

1. Push code to GitHub (with model file via Git LFS)
2. Connect repository to Render
3. Set root directory to `backend`
4. Add environment variables:
   - `CORS_ORIGINS`: Your frontend URL
5. Deploy

See [RENDER_DEPLOYMENT.md](../RENDER_DEPLOYMENT.md) for detailed deployment instructions.

## Development

### Testing the API

Using curl:

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/image.jpg"
```

Using Python:

```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

## Troubleshooting

### Model Not Loading

- Verify `saved_models/microplastic_fasterrcnn.pth` exists
- Check file permissions
- Review server logs for detailed error messages

### Memory Issues

- PyTorch models can be memory-intensive
- Consider using CPU instead of GPU if memory is limited
- Reduce image size or batch processing if needed

### CORS Errors

- Ensure `CORS_ORIGINS` includes your frontend URL
- Check that URLs match exactly (including protocol)
- Restart server after changing environment variables

## License

This project is part of a microplastic detection system for environmental research and analysis.

