import os
import json
import urllib.request

folder = os.path.join('data', 'tomato_images', 'Tomato___Early_blight')
file_path = os.path.join(folder, os.listdir(folder)[0])

with open(file_path, 'rb') as f:
    content = f.read()

boundary = '===BOUNDARY==='
body = bytearray()
body.extend(f'--{boundary}\r\n'.encode('utf-8'))
body.extend(b'Content-Disposition: form-data; name="file"; filename="leaf.jpg"\r\n')
body.extend(b'Content-Type: image/jpeg\r\n\r\n')
body.extend(content)
body.extend(f'\r\n--{boundary}--\r\n'.encode('utf-8'))

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/predict',
    data=body,
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
)

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print("End-to-End API Prediction Response:")
        print(json.dumps(res, indent=2))
except Exception as e:
    print("API Error:", e)
