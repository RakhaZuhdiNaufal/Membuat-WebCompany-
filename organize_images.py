import os
import glob
import re
import shutil

assets_dir = 'assets'
if not os.path.exists(assets_dir):
    os.makedirs(assets_dir)

# 1. Collect all images
images = []
for ext in ['*.jpg', '*.png', '*.jpeg']:
    images.extend(glob.glob(ext))

if not images:
    print("No images found to move.")
else:
    # 2. Move images to assets/
    for img in images:
        src_path = img
        dst_path = os.path.join(assets_dir, img)
        shutil.move(src_path, dst_path)
        print(f"Moved {img} to {dst_path}")

    # 3. Update HTML files
    html_files = glob.glob('*.html')
    html_files.append('README.md') # Update README too
    
    for file in html_files:
        if not os.path.exists(file):
            continue
            
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Replace for each image
        for img in images:
            # Match src="image.jpg", src='image.jpg', url('image.jpg'), url("image.jpg"), url(image.jpg), etc.
            # We must be careful not to replace things that are already assets/image.jpg
            
            # Simple replacement for typical HTML and CSS
            # Using regex with word boundaries to avoid replacing parts of words
            
            # 1. src="img"
            content = re.sub(rf'src=["\']{re.escape(img)}["\']', f'src="assets/{img}"', content)
            
            # 2. url("img") or url('img') or url(img)
            content = re.sub(rf'url\([\'"]?{re.escape(img)}[\'"]?\)', f"url('assets/{img}')", content)
            
            # 3. README markdown syntax ![alt](img)
            content = re.sub(rf'\]\({re.escape(img)}\)', f'](assets/{img})', content)
            
            # 4. Sometimes data-img="img" etc, just fallback replace if it's exact
            # For simplicity, if it's exactly the filename in quotes and doesn't have a / before it
            content = re.sub(rf'(?<!/)["\']{re.escape(img)}["\']', f'"assets/{img}"', content)

        if content != original_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated image links in {file}")

print("Done organizing images.")
