from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

base = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots')
# Layered plot already exists
layered = Image.open(base / 'layered_e30_fourpoint_set.png').convert('RGB')

# Build homogeneous annotated version from existing homogeneous closed-solution plot
hom_src = Image.open(base / 'homogeneous_33L32FI34_closed_solution_labeled.png').convert('RGBA')
d = ImageDraw.Draw(hom_src)
width, height = hom_src.size
pad_l, pad_r, pad_t, pad_b = 100, 70, 50, 100
pw = width - pad_l - pad_r
ph = height - pad_t - pad_b
sx = lambda x: pad_l + (x + 3.0) / 6.0 * pw
sy = lambda z: pad_t + z / 3.0 * ph
try:
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 22)
    small = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 18)
except Exception:
    font = ImageFont.load_default(); small = ImageFont.load_default()

points = {
    'P1': (0.000, 0.500, +0.2818),
    'P2': (0.750, 0.250, -0.0346),
    'P3': (0.000, 1.500, +0.1794),
    'P4': (1.300, 0.400, -0.0588),
}
offsets = {'P1':(18,-34),'P2':(18,-34),'P3':(18,-10),'P4':(18,-34)}
for name,(x,z,s) in points.items():
    px,py=sx(x),sy(z); r=6
    d.ellipse([px-r,py-r,px+r,py+r], fill='black', outline='white', width=1)
    dx,dy=offsets[name]; tx,ty=px+dx,py+dy
    lines=[name, f'σzo/p0 = {s:+.4f}', f'({x:.3f}a, {z:.3f}a)']
    widths=[]; heights=[]
    for i,line in enumerate(lines):
        f=font if i==0 else small
        bb=d.textbbox((0,0), line, font=f)
        widths.append(bb[2]-bb[0]); heights.append(bb[3]-bb[1])
    box_w=max(widths)+12; box_h=sum(heights)+12
    d.rounded_rectangle([tx-6,ty-4,tx-6+box_w,ty-4+box_h], radius=5, fill='white', outline='black', width=1)
    y=ty
    d.text((tx,y), lines[0], fill='black', font=font); y += heights[0] + 2
    d.text((tx,y), lines[1], fill='black', font=small); y += heights[1] + 2
    d.text((tx,y), lines[2], fill='black', font=small)

hom = Image.new('RGB', hom_src.size, 'white')
hom.paste(hom_src, mask=hom_src.split()[-1])
hom_path = base / 'homogeneous_fourpoint_set.png'
hom.save(hom_path)

# Make side-by-side comparison
margin = 40
title_h = 60
W = hom.width + layered.width + margin*3
H = max(hom.height, layered.height) + title_h + margin*2
canvas = Image.new('RGB', (W,H), 'white')
dc = ImageDraw.Draw(canvas)
try:
    title_font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 30)
    body_font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 22)
except Exception:
    title_font = ImageFont.load_default(); body_font = ImageFont.load_default()

x1 = margin
x2 = margin*2 + hom.width
y = title_h + margin
canvas.paste(hom, (x1, y))
canvas.paste(layered, (x2, y))

dc.text((x1, 20), 'Homogeneous exact integral solution', fill='black', font=title_font)
dc.text((x2, 20), 'Layered FEA, same tire load, E2/E1 = 30', fill='black', font=title_font)

dc.text((x1, H - margin), 'Signs: P1+, P2-, P3+, P4-  →  N = 2', fill='black', font=body_font)
dc.text((x2, H - margin), 'Signs: P1+, P2+, P3+, P4-  →  N = 3', fill='black', font=body_font)

out = base / 'compare_homogeneous_vs_layered_e30.png'
canvas.save(out)
print(hom_path)
print(out)
