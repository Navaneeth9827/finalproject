import os
import sys
sys.path.insert(0, os.path.abspath("."))
import torch
import torch.nn.functional as F
from PIL import Image

from backend.app import load_vmamba_model, INDEX_TO_CLASS, EVAL_TRANSFORM
from training.dataset import TOMATO_CLASSES, CLASS_TO_IDX

# Exact required mapping verification
EXACT_REQUIRED_MAPPING = {
    0: "Tomato___Bacterial_spot",
    1: "Tomato___Early_blight",
    2: "Tomato___Late_blight",
    3: "Tomato___Leaf_Mold",
    4: "Tomato___Septoria_leaf_spot",
    5: "Tomato___Spider_mites Two-spotted_spider_mite",
    6: "Tomato___Target_Spot",
    7: "Tomato___Tomato_mosaic_virus",
    8: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    9: "Tomato___healthy"
}

# 1. Load exact model checkpoint
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = load_vmamba_model()
model.eval()

# 2. Test Healthy Class Images (15 images)
healthy_dir = os.path.join("data", "tomato_images", "Tomato___healthy")
all_healthy_files = sorted([os.path.join(healthy_dir, f) for f in os.listdir(healthy_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])

# Take 15 diverse samples across the dataset
step = max(1, len(all_healthy_files) // 15)
test_healthy_files = all_healthy_files[::step][:15]

healthy_results = []
healthy_correct = 0
healthy_incorrect = 0

print("==========================================================================")
print("DIAGNOSTIC TEST: HEALTHY TOMATO LEAF INFERENCE (15 SAMPLES)")
print("==========================================================================")

for fpath in test_healthy_files:
    fname = os.path.basename(fpath)
    pil_img = Image.open(fpath).convert("RGB")
    tensor_img = EVAL_TRANSFORM(pil_img).unsqueeze(0).to(device)
    
    with torch.no_grad():
        output = model(tensor_img)
        probs = F.softmax(output, dim=1)
        top_prob, top_idx = torch.max(probs, dim=1)
        
    pred_idx = top_idx.item()
    conf = top_prob.item()
    pred_class_clean = INDEX_TO_CLASS[pred_idx]
    is_correct = (pred_idx == 9)
    
    if is_correct:
        healthy_correct += 1
    else:
        healthy_incorrect += 1
        
    healthy_results.append({
        "filename": fname,
        "expected": "Healthy",
        "predicted": pred_class_clean,
        "confidence": conf,
        "is_correct": is_correct
    })
    
    status_str = "[CORRECT]" if is_correct else "[INCORRECT]"
    print(f"File: {fname[:35]:<35} | Expected: Healthy | Pred: {pred_class_clean:<30} | Conf: {conf*100:6.2f}% | {status_str}")

# 3. Test 9 Disease Classes (1 sample each)
disease_results = []
disease_correct = 0

print("\n==========================================================================")
print("DIAGNOSTIC TEST: EXISTING 9 DISEASE CLASSES (1 SAMPLE EACH)")
print("==========================================================================")

for cls_dir, clean_name in TOMATO_CLASSES[:-1]: # exclude healthy
    dir_path = os.path.join("data", "tomato_images", cls_dir)
    files = [os.path.join(dir_path, f) for f in os.listdir(dir_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    if not files:
        continue
    sample_file = files[len(files)//2] # pick middle sample
    fname = os.path.basename(sample_file)
    
    pil_img = Image.open(sample_file).convert("RGB")
    tensor_img = EVAL_TRANSFORM(pil_img).unsqueeze(0).to(device)
    
    with torch.no_grad():
        output = model(tensor_img)
        probs = F.softmax(output, dim=1)
        top_prob, top_idx = torch.max(probs, dim=1)
        
    pred_idx = top_idx.item()
    conf = top_prob.item()
    pred_class_clean = INDEX_TO_CLASS[pred_idx]
    is_correct = (pred_class_clean == clean_name)
    
    if is_correct:
        disease_correct += 1
        
    disease_results.append({
        "folder": cls_dir,
        "expected": clean_name,
        "predicted": pred_class_clean,
        "confidence": conf,
        "is_correct": is_correct
    })
    
    status_str = "[CORRECT]" if is_correct else "[INCORRECT]"
    print(f"Folder: {cls_dir[:35]:<35} | Expected: {clean_name:<30} | Pred: {pred_class_clean:<30} | Conf: {conf*100:6.2f}% | {status_str}")

# Print summary
print("\n==========================================================================")
print(f"HEALTHY SUMMARY: Tested={len(test_healthy_files)}, Correct={healthy_correct}, Incorrect={healthy_incorrect}, Accuracy={(healthy_correct/len(test_healthy_files))*100:.2f}%")
print(f"DISEASE SUMMARY: Tested={len(disease_results)}, Correct={disease_correct}, Accuracy={(disease_correct/len(disease_results))*100:.2f}%")
print("==========================================================================")
