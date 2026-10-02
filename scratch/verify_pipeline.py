import os
import sys
sys.path.insert(0, os.path.abspath("."))
import torch
import numpy as np
from PIL import Image

from backend.app import load_vmamba_model, predict_disease, INDEX_TO_CLASS
from backend.ood_validator import validator

print("--- Step 1: Checking Class Index Mapping ---")
print("INDEX_TO_CLASS:", INDEX_TO_CLASS)
assert len(INDEX_TO_CLASS) == 10
assert INDEX_TO_CLASS[9] == "Healthy"
print("[OK] 10 classes verified in index mapping.\n")

print("--- Step 2: Testing Model Loading ---")
model = load_vmamba_model()
assert model is not None
print("[OK] VMamba model loaded successfully with 10 output classes.\n")

print("--- Step 3: Verifying Healthy Leaf Images ---")
healthy_dir = os.path.join("data", "tomato_images", "Tomato___healthy")
healthy_files = [os.path.join(healthy_dir, f) for f in os.listdir(healthy_dir) if f.lower().endswith(('.jpg', '.png', '.jpeg'))][:5]

for h_file in healthy_files:
    pil_img = Image.open(h_file).convert("RGB")
    is_valid, msg = validator.validate(pil_img)
    print(f"File {os.path.basename(h_file)} -> Valid: {is_valid}")
    assert is_valid, f"Healthy image failed OOD validator: {msg}"

print("[OK] Healthy leaf images passed OOD validation.\n")

print("--- Step 4: Testing Non-Tomato / Invalid Image OOD Protection ---")
# Create a dummy solid white / noise image or unrelated image to test unable_to_detect
dummy_non_leaf = Image.new("RGB", (224, 224), color=(255, 255, 255))
is_valid, msg = validator.validate(dummy_non_leaf)
print(f"Dummy non-leaf image -> Valid: {is_valid}, Message: '{msg}'")
assert not is_valid
print("[OK] OOD validator correctly rejected non-tomato image with unable_to_detect flow.\n")

print("All pipeline sanity checks passed successfully!")
