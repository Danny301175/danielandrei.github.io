from pathlib import Path
import re

html_files = list(Path('.').glob('galeria*.html'))
print('Files to process:', len(html_files))
for html in html_files:
    text = html.read_text(encoding='utf-8')
    new = re.sub(r'(src=")([^"]+?)\.(jpe?g|png)(")', r'\1\2.webp\4', text, flags=re.IGNORECASE)
    if text != new:
        html.write_text(new, encoding='utf-8')
        print('updated', html)
