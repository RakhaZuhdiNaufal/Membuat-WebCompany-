import re

with open('landing.html', 'r', encoding='utf-8') as f:
    content = f.read()

style_match = re.search(r'<style>\s*\.new-footer \{.*?</style>', content, re.DOTALL)
style_block = style_match.group(0) if style_match else ''

footer_match = re.search(r'<footer class="new-footer".*?</footer>', content, re.DOTALL)
footer_block = footer_match.group(0) if footer_match else ''

new_footer_html = f'{style_block}\n\n  {footer_block}'

for filename in ['careers.html', 'contact.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        file_content = f.read()
    
    updated_content = re.sub(r'<footer class="landing-footer">.*?</footer>', new_footer_html, file_content, flags=re.DOTALL)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(updated_content)

print('Done!')
