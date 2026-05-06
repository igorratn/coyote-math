from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

inp = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/overlay_homogeneous_vs_layered_e30.png')
out = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/overlay_homogeneous_vs_layered_e30_labeled.png')
img = Image.open(inp).convert('RGB')
d = ImageDraw.Draw(img)
try:
    title = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 24)
    body = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 18)
    big = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 32)
except Exception:
    title = ImageFont.load_default(); body = ImageFont.load_default(); big = ImageFont.load_default()

# Legend box
x0, y0 = 1120, 150
w, h = 310, 280
d.rounded_rectangle([x0, y0, x0+w, y0+h], radius=8, fill='white', outline='black', width=2)
d.text((x0+15, y0+12), 'Contour levels', fill='black', font=title)
levels = ['-0.10', '-0.05', '0.00', '+0.05', '+0.10', '+0.20', '+0.30']
for i, lev in enumerate(levels):
    y = y0 + 55 + i*28
    # solid black sample
    sw = 3 if lev == '0.00' else 1
    d.line([x0+20, y, x0+70, y], fill='black', width=sw)
    # red dashed sample
    for k in range(0, 50, 12):
        d.line([x0+95+k, y, x0+95+k+7, y], fill=(200,0,0), width=2 if lev != '0.00' else 3)
    d.text((x0+175, y-11), lev, fill='black', font=body)

d.text((x0+20, y0+h-56), 'black solid = homogeneous exact', fill='black', font=body)
d.text((x0+20, y0+h-30), 'red dashed = layered FEA', fill='black', font=body)

# Sign markers in broad regions
for pos, txt in [((540, 500), '+'), ((1010, 520), '+'), ((1030, 700), '−'), ((1220, 650), '−')]:
    d.rounded_rectangle([pos[0]-18, pos[1]-18, pos[0]+18, pos[1]+18], radius=6, fill='white', outline='black')
    d.text((pos[0]-9, pos[1]-18), txt, fill='black', font=big)

# Note for zero contour
note = 'The thick contour corresponds to 0.00'
d.rounded_rectangle([1040, 445, 1430, 485], radius=6, fill='white', outline='black')
d.text((1055, 452), note, fill='black', font=body)

img.save(out)
print(out)
