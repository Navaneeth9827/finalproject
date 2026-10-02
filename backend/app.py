import os
import io
import json
import torch
import torch.nn.functional as F
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
from dotenv import load_dotenv

# Load environment variables from .env and frontend/.env if present
load_dotenv()
frontend_env_path = os.path.join(os.path.dirname(__file__), "..", "frontend", ".env")
if os.path.exists(frontend_env_path):
    load_dotenv(frontend_env_path)

from model.vmamba import build_vssm_tiny
from backend.ood_validator import validator
from backend.disease_data import TOMATO_DISEASE_KNOWLEDGE

app = FastAPI(title="Smart Crop Advisory System API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and configuration
MODEL = None
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CONFIDENCE_THRESHOLD = 0.70 # Configurable threshold for low confidence

INDEX_TO_CLASS = {
    0: "Bacterial Spot",
    1: "Early Blight",
    2: "Late Blight",
    3: "Leaf Mold",
    4: "Septoria Leaf Spot",
    5: "Spider Mites – Two-Spotted Spider Mite",
    6: "Target Spot",
    7: "Tomato Mosaic Virus",
    8: "Tomato Yellow Leaf Curl Virus",
    9: "Healthy"
}

EVAL_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def load_vmamba_model():
    global MODEL
    model_path = os.path.join("model", "best_model.pth")
    model = build_vssm_tiny(num_classes=10)
    
    if os.path.exists(model_path):
        checkpoint = torch.load(model_path, map_location=DEVICE)
        model.load_state_dict(checkpoint["model_state_dict"])
        print(f"Loaded trained fine-tuned VMamba model from {model_path}")
    else:
        # Load pretrained backbone if best_model.pth not yet finished
        ckpt_path = "vssm_tiny_0230_ckpt_epoch_262.pth"
        if os.path.exists(ckpt_path):
            checkpoint = torch.load(ckpt_path, map_location=DEVICE)
            state_dict = checkpoint.get("model", checkpoint)
            adapted = {}
            for k, v in state_dict.items():
                if not k.startswith("classifier.head."):
                    new_k = k.replace("downsample.1.", "downsample.conv.").replace("downsample.3.", "downsample.norm.")
                    adapted[new_k] = v
            model.load_state_dict(adapted, strict=False)
            print(f"Loaded pretrained backbone from {ckpt_path}")
            
    model = model.to(DEVICE)
    model.eval()
    MODEL = model
    return MODEL

@app.on_event("startup")
def startup_event():
    load_vmamba_model()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "device": str(DEVICE),
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU",
        "confidence_threshold": CONFIDENCE_THRESHOLD,
        "model_loaded": MODEL is not None
    }

@app.post("/api/predict")
async def predict_disease(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only image files (JPEG/PNG) are accepted.")
    
    try:
        image_bytes = await file.read()
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process uploaded image: {str(e)}")

    # 1. Explicit Out-of-Scope / Leaf Quality Validation
    is_valid, validation_msg = validator.validate(pil_img)
    if not is_valid:
        return {
            "status": "unable_to_detect",
            "uncertain": True,
            "message": validation_msg
        }

    # 2. VMamba Model Inference
    if MODEL is None:
        load_vmamba_model()

    input_tensor = EVAL_TRANSFORM(pil_img).unsqueeze(0).to(DEVICE)
    
    with torch.no_grad():
        outputs = MODEL(input_tensor)
        probs = F.softmax(outputs, dim=1)
        top_prob, top_idx = torch.max(probs, dim=1)

    predicted_idx = top_idx.item()
    confidence = float(top_prob.item())
    predicted_disease = INDEX_TO_CLASS.get(predicted_idx, "Unknown Disease")

    # 3. Low Confidence Handling
    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "status": "uncertain",
            "uncertain": True,
            "disease": predicted_disease,
            "confidence": round(confidence, 4),
            "message": "Result is uncertain. Please upload a clearer image or consult an agricultural expert."
        }

    # 4. Healthy Prediction Handling (No disease_knowledge, community, or Groq warning)
    if predicted_disease == "Healthy":
        return {
            "status": "success",
            "uncertain": False,
            "disease": "Healthy",
            "is_healthy": True,
            "confidence": round(confidence, 4),
            "message": "The tomato leaf appears healthy. No disease detected."
        }

    # 5. Fetch Matching Disease Knowledge for Disease Predictions
    disease_info = TOMATO_DISEASE_KNOWLEDGE.get(predicted_disease, {
        "crop_name": "Tomato",
        "disease_name": predicted_disease,
        "symptoms": "Please consult your local extension office.",
        "source": "ICAR Agricultural Advisory"
    })

    return {
        "status": "success",
        "uncertain": False,
        "disease": predicted_disease,
        "confidence": round(confidence, 4),
        "disease_info": disease_info
    }

# ----------------------------------------------------
# COMMUNITY GROQ WARNING GENERATION ENDPOINT
# ----------------------------------------------------

from typing import Optional, Dict
from pydantic import BaseModel
from backend.groq_service import generate_community_warning

class GenerateWarningRequest(BaseModel):
    crop_name: str = "Tomato"
    disease_name: str
    district: str = "Kolar"
    disease_info: Optional[Dict] = None

@app.post("/api/community/generate-warning")
def generate_warning_endpoint(req: GenerateWarningRequest):
    disease_info = req.disease_info or TOMATO_DISEASE_KNOWLEDGE.get(req.disease_name, {
        "crop_name": req.crop_name,
        "disease_name": req.disease_name,
        "what_is_it": f"A common crop infection affecting {req.crop_name}.",
        "symptoms": "Visual leaf spots or abnormal growth.",
        "what_to_do_now": "Prune infected leaves and isolate affected plants."
    })

    warning = generate_community_warning(
        crop_name=req.crop_name,
        disease_name=req.disease_name,
        district=req.district,
        disease_info=disease_info
    )

    return {
        "status": "success",
        "warning_title": warning.get("warning_title", req.disease_name),
        "warning_message": warning.get("warning_message", "")
    }

@app.get("/api/reports")
def get_evaluation_reports():
    reports_path = os.path.join("reports", "metrics.json")
    if os.path.exists(reports_path):
        with open(reports_path, "r") as f:
            data = json.load(f)
        return data
    else:
        return {
            "status": "pending",
            "message": "Model evaluation metrics pending completed training."
        }

# ----------------------------------------------------
# PRICE PREDICTION ENDPOINTS
# ----------------------------------------------------

from backend.price_service import (
    get_available_markets,
    get_available_commodities,
    fetch_current_mandi_price,
    run_price_prediction,
)

class PricePredictRequest(BaseModel):
    market: str = "Bengaluru APMC"
    commodity: str = "Onion"

@app.get("/api/price/markets")
def get_price_markets():
    return {"status": "success", "markets": get_available_markets()}

@app.get("/api/price/commodities")
def get_price_commodities(market: Optional[str] = None):
    return {"status": "success", "commodities": get_available_commodities(market)}

@app.get("/api/price/current")
def get_price_current(market: str = "Bengaluru APMC", commodity: str = "Onion"):
    price_info = fetch_current_mandi_price(market, commodity)
    if not price_info:
        return {
            "status": "unavailable",
            "message": f"Live Mandi price currently unavailable for {market} ({commodity})."
        }
    return {"status": "success", "data": price_info}

@app.post("/api/price/predict")
def predict_price_post(req: PricePredictRequest):
    try:
        res = run_price_prediction(req.market, req.commodity)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/price/predict")
def predict_price_get(market: str = "Bengaluru APMC", commodity: str = "Onion"):
    try:
        res = run_price_prediction(market, commodity)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



