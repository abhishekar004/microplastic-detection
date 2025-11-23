import io
import os
import logging
from typing import Tuple
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torchvision.transforms as T

from model import load_trained_model, ModelLoadError

# ---------- Logging ----------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------- Config ----------
# Force CPU mode on Render free tier (saves memory)
FORCE_CPU = os.getenv("FORCE_CPU", "false").lower() == "true"
DEVICE = torch.device("cpu" if FORCE_CPU or not torch.cuda.is_available() else "cuda")
WEIGHTS_PATH = "saved_models/microplastic_fasterrcnn.pth"
SCORE_THRESHOLD = 0.5  # filter weak predictions
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB max file size
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/bmp", "image/webp"}

# CORS origins - in production, set this to your frontend URL
# For development, you can use "*" or specific origins like "http://localhost:8080"
# For production, use comma-separated list: "https://app.vercel.app,https://app2.vercel.app"
cors_origins_env = os.getenv("CORS_ORIGINS", "*")
if cors_origins_env == "*":
    CORS_ORIGINS = ["*"]
else:
    # Split by comma and strip whitespace from each origin
    CORS_ORIGINS = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
    # Validate: if empty list, fall back to wildcard (but log warning)
    if not CORS_ORIGINS:
        logger.warning(f"CORS_ORIGINS environment variable is empty or invalid, falling back to '*'")
        CORS_ORIGINS = ["*"]

logger.info(f"CORS configured with origins: {CORS_ORIGINS}")

# ---------- App ----------
app = FastAPI(
    title="Microplastic Detection API",
    description="AI-powered microplastic detection using Faster R-CNN",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ---------- Load model lazily (on first request) to save memory on startup ----------
# This helps with Render free tier 512MB limit
model = None
model_loading = False
model_load_error = None

def get_or_load_model():
    """Get or load the model (lazy loading for memory efficiency)."""
    global model, model_loading, model_load_error
    
    if model is not None:
        return model
    
    if model_loading:
        # Model is currently loading, wait a bit
        import time
        time.sleep(0.1)
        return get_or_load_model()
    
    if model_load_error is not None:
        raise ModelLoadError(model_load_error)
    
    # Start loading
    model_loading = True
    try:
        if not os.path.exists(WEIGHTS_PATH):
            raise FileNotFoundError(f"Model weights file not found at {WEIGHTS_PATH}")
        logger.info(f"Loading model from {WEIGHTS_PATH} on device: {DEVICE}")
        model = load_trained_model(WEIGHTS_PATH, DEVICE)
        logger.info("Model loaded successfully")
        return model
    except (FileNotFoundError, ModelLoadError, Exception) as e:
        error_msg = f"Failed to load model: {str(e)}"
        logger.error(error_msg)
        model_load_error = error_msg
        raise ModelLoadError(error_msg)
    finally:
        model_loading = False

# Simple transform: to tensor (like in training)
transform = T.Compose([
    T.ToTensor(),   # converts to [C,H,W] float32 in [0,1]
])


def validate_image_file(file: UploadFile) -> None:
    """Validate uploaded file is an image."""
    # Check file extension
    if file.filename:
        file_ext = os.path.splitext(file.filename.lower())[1]
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
            )
    
    # Check MIME type
    if file.content_type and file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid MIME type. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}"
        )


def prepare_image(image_bytes: bytes) -> Tuple[torch.Tensor, Tuple[int, int]]:
    """
    Prepare image for model inference.
    Returns: (tensor, (width, height))
    """
    try:
        # Validate file size
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )
        
        # Open and validate image
        try:
            image = Image.open(io.BytesIO(image_bytes))
            # Verify it's actually an image
            image.verify()
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid or corrupted image file: {str(e)}"
            )
        
        # Reopen for processing (verify() closes the image)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Validate image dimensions
        width, height = image.size
        if width == 0 or height == 0:
            raise HTTPException(
                status_code=400,
                detail="Image has invalid dimensions"
            )
        
        if width > 10000 or height > 10000:
            raise HTTPException(
                status_code=400,
                detail="Image dimensions too large. Maximum: 10000x10000 pixels"
            )
        
        tensor = transform(image)
        return tensor, (width, height)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error preparing image: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error processing image: {str(e)}"
        )


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an image file and returns bounding boxes + labels + scores.
    
    Returns:
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
    """
    # Load model on first request (lazy loading)
    try:
        current_model = get_or_load_model()
    except ModelLoadError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Model not available: {str(e)}"
        )
    
    try:
        # Validate file
        validate_image_file(file)
        
        # Read file contents
        contents = await file.read()
        
        # Preprocess image
        img_tensor, (width, height) = prepare_image(contents)
        img_tensor = img_tensor.to(DEVICE)

        # Model inference
        try:
            with torch.no_grad():
                outputs = current_model([img_tensor])
        except Exception as e:
            logger.error(f"Model inference error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error during model inference: {str(e)}"
            )

        # Extract results
        output = outputs[0]
        boxes = output["boxes"].cpu().numpy()
        scores = output["scores"].cpu().numpy()
        labels = output["labels"].cpu().numpy()

        # Filter by score and format results
        filtered = []
        for box, score, label in zip(boxes, scores, labels):
            if score < SCORE_THRESHOLD:
                continue
            x1, y1, x2, y2 = box.tolist()
            # Ensure coordinates are valid
            if x1 >= x2 or y1 >= y2:
                logger.warning(f"Skipping invalid bbox: [{x1}, {y1}, {x2}, {y2}]")
                continue
            filtered.append({
                "bbox": [float(x1), float(y1), float(x2), float(y2)],
                "score": float(score),
                "label": int(label),
            })

        logger.info(f"Processed image {width}x{height}, found {len(filtered)} detections")
        
        return {
            "width": int(width),
            "height": int(height),
            "detections": filtered,
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in /predict: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.get("/")
def root():
    """Health check endpoint."""
    model_loaded = model is not None
    return {
        "message": "Microplastic Detection API is running",
        "status": "healthy" if model_loaded else "degraded",
        "model_loaded": model_loaded,
        "device": str(DEVICE),
        "note": "Model loads on first request to save memory" if not model_loaded else None
    }


@app.get("/health")
def health_check():
    """Detailed health check endpoint."""
    model_loaded = model is not None
    return {
        "status": "healthy" if model_loaded else "degraded",
        "model_loaded": model_loaded,
        "model_path": WEIGHTS_PATH,
        "model_exists": os.path.exists(WEIGHTS_PATH) if WEIGHTS_PATH else False,
        "device": str(DEVICE),
        "cuda_available": torch.cuda.is_available(),
        "lazy_loading": True,
        "note": "Model loads on first /predict request to save memory" if not model_loaded else None
    }
