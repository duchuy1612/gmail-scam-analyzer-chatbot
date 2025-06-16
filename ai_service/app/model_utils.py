from pathlib import Path
from typing import Optional
import joblib

MODEL_PATH = Path(__file__).resolve().parent / "model.joblib"
_model = None

def load_model(path: Optional[str] = None):
    """Load the trained classifier from disk."""
    global _model
    if _model is None:
        model_file = Path(path) if path else MODEL_PATH
        if not model_file.exists():
            raise FileNotFoundError(f"Model file not found at {model_file}")
        _model = joblib.load(model_file)
    return _model
