import os
import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor


class ModelLoadError(Exception):
    """Custom exception for model loading errors."""
    pass


NUM_CLASSES = 2  # background + microplastic


def get_model(num_classes: int = NUM_CLASSES):
    """Create and return a Faster R-CNN model."""
    try:
        model = fasterrcnn_resnet50_fpn(weights="DEFAULT")
        in_features = model.roi_heads.box_predictor.cls_score.in_features
        model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
        return model
    except Exception as e:
        raise ModelLoadError(f"Failed to create model: {str(e)}")


def load_trained_model(weights_path: str, device: torch.device):
    """
    Load a trained model from weights file with memory optimization.
    
    Args:
        weights_path: Path to the model weights file
        device: Device to load the model on (cpu or cuda)
    
    Returns:
        Loaded and evaluated model
    
    Raises:
        ModelLoadError: If model loading fails
    """
    # Check if file exists
    if not os.path.exists(weights_path):
        raise ModelLoadError(f"Model weights file not found: {weights_path}")
    
    # Check if file is readable
    if not os.access(weights_path, os.R_OK):
        raise ModelLoadError(f"Model weights file is not readable: {weights_path}")
    
    try:
        # Create model architecture first
        model = get_model()
        
        # Load weights directly to device to avoid double memory usage
        # Use weights_only=True for security and memory efficiency (PyTorch 2.0+)
        try:
            # Try loading with weights_only first (more memory efficient)
            try:
                state_dict = torch.load(weights_path, map_location=device, weights_only=True)
            except TypeError:
                # Fallback for older PyTorch versions
                state_dict = torch.load(weights_path, map_location=device)
        except Exception as e:
            raise ModelLoadError(f"Failed to load weights file (may be corrupted): {str(e)}")
        
        # Load state dict into model
        try:
            model.load_state_dict(state_dict)
        except Exception as e:
            raise ModelLoadError(f"State dict does not match model architecture: {str(e)}")
        
        # Clear state_dict from memory before moving model
        del state_dict
        
        # Move to device and set to eval mode
        model.to(device)
        model.eval()
        
        # Clear cache if on CPU (helps with memory)
        if device.type == 'cpu':
            torch.cuda.empty_cache() if torch.cuda.is_available() else None
        
        return model
    
    except ModelLoadError:
        raise
    except Exception as e:
        raise ModelLoadError(f"Unexpected error loading model: {str(e)}")
