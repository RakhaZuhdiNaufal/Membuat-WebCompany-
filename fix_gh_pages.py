import os
import re

# 1. Rename files
if os.path.exists('Index.html'):
    os.rename('Index.html', 'menu.html')
if os.path.exists('landing.html'):
    os.rename('landing.html', 'index.html')

print("Renamed files.")

# 2. Update HTML links in all files
html_files = ['index.html', 'menu.html', 'about.html', 'careers.html']

for file in html_files:
    if not os.path.exists(file):
        print(f"Skipping {file} - not found.")
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace links
    content = content.replace('href="Index.html"', 'href="menu.html"')
    content = content.replace('href="landing.html"', 'href="index.html"')
    # Also catch lowercase just in case
    content = content.replace('href="index.html"', 'href="index.html"') # if any already were lowercase
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated HTML links.")
