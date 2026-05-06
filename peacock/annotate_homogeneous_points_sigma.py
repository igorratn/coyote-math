from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

img_path = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/homogeneous_33L32FI34_closed_solution_labeled.png')
out_path = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/homogeneous_33L32FI34_closed_solution_labeled_points_sigma.png')
img = Image.open(img_path).convert('RGBA')
d = ImageDraw.Draw(img)
width, height = img.size
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
    'P1': (0.00, 0.50, +0.2818),
    'P2': (0.95, 0.25, -0.0696),
    'P3': (0.00, 1.50, +0.1794),
    'P4': (1.50, 0.50, -0.0515),
}
offsets = {
    'P1': (18, -34),
    'P2': (16, -34),
    'P3': (18, -10),
    'P4': (18, -34),
}
for name, (x, z, s) in points.items():
    px, py = sx(x), sy(z)
    r = 6
    d.ellipse([px-r, py-r, px+r, py+r], fill='black', outline='white', width=1)
    dx, dy = offsets[name]
    tx, ty = px + dx, py + dy
    lines = [name, f'σzo/p0 = {s:+.4f}', f'({x:.2f}a, {z:.2f}a)']
    # estimate label box
    widths = []; heights = []
    for i, line in enumerate(lines):
        f = font if i == 0 else small
        bb = d.textbbox((0, 0), line, font=f)
        widths.append(bb[2]-bb[0]); heights.append(bb[3]-bb[1])
    box_w = max(widths) + 12
    box_h = sum(heights) + 12
    d.rounded_rectangle([tx-6, ty-4, tx-6+box_w, ty-4+box_h], radius=5, fill='white', outline='black', width=1)
    y = ty
    d.text((tx, y), lines[0], fill='black', font=font); y += heights[0] + 2
    d.text((tx, y), lines[1], fill='black', font=small); y += heights[1] + 2
    d.text((tx, y), lines[2], fill='black', font=small)

flat = Image.new('RGB', img.size, 'white')
flat.paste(img, mask=img.split()[-1])
flat.save(out_path)
print(out_path)
