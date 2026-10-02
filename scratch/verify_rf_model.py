import os
import joblib
import json
import pandas as pd
import numpy as np

base_dir = os.path.join("market price 1-20261002T015252Z-1-001", "market price 1")
model_path = os.path.join(base_dir, "models", "random_forest", "random_forest_model.pkl")
features_path = os.path.join(base_dir, "models", "random_forest", "random_forest_features.pkl")
metrics_path = os.path.join(base_dir, "models", "random_forest", "random_forest_metrics.json")

print("--- Step 1: Checking File Existence ---")
exists = os.path.exists(model_path)
print("File exists:", exists)

if exists:
    size_bytes = os.path.getsize(model_path)
    size_mb = size_bytes / (1024 * 1024)
    print(f"File Path: {os.path.abspath(model_path)}")
    print(f"File Size: {size_bytes} bytes ({size_mb:.2f} MB)")
    
    print("\n--- Step 2: Testing Model Load with joblib ---")
    model = joblib.load(model_path)
    print("Model successfully loaded with joblib!")
    print("Model Type:", type(model).__name__)
    
    features = joblib.load(features_path)
    print("Features list loaded with joblib!")
    
    expected_n_features = getattr(model, "n_features_in_", len(features))
    features_count = len(features)
    
    print(f"Model Expected Feature Count: {expected_n_features}")
    print(f"Features File Count: {features_count}")
    print("Features Count Match:", expected_n_features == features_count)
    
    print("\n--- Step 3: Running Minimal Prediction Test ---")
    # Build dummy single sample with required 19 feature columns
    dummy_input = pd.DataFrame([{col: 1.0 for col in features}])
    test_pred = model.predict(dummy_input)
    print("Sample Input:", dummy_input.to_dict(orient="records"))
    print("Test Prediction Result:", test_pred[0], "INR/quintal")
    print("Prediction Completed Successfully: True")
    
    print("\n--- Step 4: Model Evaluation Metrics ---")
    with open(metrics_path, "r") as f:
        metrics = json.load(f)
    print("Metrics:", json.dumps(metrics, indent=2))
