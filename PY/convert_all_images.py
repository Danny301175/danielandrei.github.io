from pathlib import Path
from PIL import Image
import sys
root = Path('.')
count = 0
for p in sorted(root.rglob('*')):
    if p.suffix.lower() in ['.jpg', '.jpeg', '.png'] and p.is_file():
        out = p.with_suffix('.webp')
        if out.exists():
            continue
        try:
            img = Image.open(p)
            img = img.convert('RGB')
            img.save(out, 'WEBP', quality=80, method=6)
            print('converted', p, '->', out)
            count += 1
        except Exception as e:
            print('failed', p, e)
            sys.exit(1)
print('total converted', count)
