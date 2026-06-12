from pathlib import Path
root = Path('.')
with open('image_list.txt','w',encoding='utf-8') as out:
    for p in sorted(root.rglob('*')):
        if p.suffix.lower() in ['.jpg','.jpeg','.png']:
            out.write(str(p) + '\n')
print('written', 'image_list.txt')
