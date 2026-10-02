import json
from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

print("=" * 70)
print("RUNNING COMPREHENSIVE INTEGRATION VERIFICATION")
print("=" * 70)

# 1. Health Endpoint
r_health = client.get("/api/health")
print("\n1. Health Check:", r_health.status_code)
assert r_health.status_code == 200, "Health check failed!"

# 2. Price Prediction Endpoints
r_markets = client.get("/api/price/markets")
print("2. Price Markets:", r_markets.status_code, "Count:", len(r_markets.json().get("markets", [])))
assert r_markets.status_code == 200

r_commodities = client.get("/api/price/commodities")
print("3. Price Commodities:", r_commodities.status_code, r_commodities.json().get("commodities"))
assert r_commodities.status_code == 200

r_current = client.get("/api/price/current?market=Bengaluru%20APMC&commodity=Onion")
print("4. Current Market Price:", r_current.status_code, "Status:", r_current.json().get("status"))
assert r_current.status_code == 200

r_predict_post = client.post("/api/price/predict", json={"market": "Bengaluru APMC", "commodity": "Onion"})
print("5. 7-Day Price Predict (POST):", r_predict_post.status_code)
assert r_predict_post.status_code == 200
pred_data = r_predict_post.json()
assert pred_data.get("status") == "success"
assert len(pred_data.get("forecast", [])) == 7
print("   - Market:", pred_data.get("market"))
print("   - Current Modal Price:", pred_data.get("current_price", {}).get("modal_price"), pred_data.get("current_price", {}).get("unit"))
print("   - Day 1 Forecast:", pred_data["forecast"][0]["date"], "-> ₹", pred_data["forecast"][0]["predicted_price_quintal"], "/quintal (₹", pred_data["forecast"][0]["predicted_price_kg"], "/kg)")
print("   - Overall Trend:", pred_data.get("summary", {}).get("overall_trend_label"))

r_predict_kolar = client.get("/api/price/predict?market=Kolar&commodity=Tomato")
print("6. 7-Day Price Predict for Kolar + Tomato (GET):", r_predict_kolar.status_code)
assert r_predict_kolar.status_code == 200
kolar_data = r_predict_kolar.json()
assert kolar_data.get("status") == "success"
assert len(kolar_data.get("forecast", [])) == 7
print("   - Market:", kolar_data.get("market"))
print("   - Day 1 Forecast:", kolar_data["forecast"][0]["date"], "-> ₹", kolar_data["forecast"][0]["predicted_price_quintal"], "/quintal")

# 3. Verify Disease Detection & Community endpoints still work untouched
r_warning = client.post("/api/community/generate-warning", json={
    "crop_name": "Tomato",
    "disease_name": "Early Blight",
    "district": "Kolar"
})
print("7. Community Groq Warning Endpoint:", r_warning.status_code, "Title:", r_warning.json().get("warning_title"))
assert r_warning.status_code == 200

print("\n" + "=" * 70)
print("ALL VERIFICATION CHECKS PASSED PERFECTLY!")
print("=" * 70)
