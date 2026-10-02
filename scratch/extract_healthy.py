import os
import zipfile
import shutil

zip_path = 'archive.zip'
target_dir = os.path.join('data', 'tomato_images', 'Tomato___healthy')
os.makedirs(target_dir, exist_ok=True)

with zipfile.ZipFile(zip_path, 'r') as z:
    healthy_files = [
        n for n in z.namelist()
        if n.startswith('plantvillage dataset/color/Tomato___healthy/')
        and n.lower().endswith(('.jpg', '.jpeg', '.png'))
    ]
    print(f"Extracting {len(healthy_files)} images to {target_dir}...")
    count = 0
    for fname in healthy_files:
        filename = os.path.basename(fname)
        if filename:
            with z.open(fname) as src, open(os.path.join(target_dir, filename), 'wb') as dst:
                shutil.copyfileobj(src, dst)
            count += 1
    print(f"Successfully extracted {count} images to {target_dir}")
