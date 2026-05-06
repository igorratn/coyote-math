from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

img_path = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/homogeneous_33L32FI34_closed_solution_labeled.png')
out_path = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/homogeneous_33L32FI34_closed_solution_labeled_points.png')

img = Image.open(img_path).convert('RGBA')
d = ImageDraw.Draw(img)

# Canvas mapping from the render script
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
    font = ImageFont.load_default()
    small = ImageFont.load_default()

# Homogeneous closed-solution problem points
points = {
    'P1': (0.00, 0.50),
    'P2': (0.95, 0.25),
    'P3': (0.00, 1.50),
    'P4': (1.50, 0.50),
}

# offsets tuned to keep labels readable
offsets = {
    'P1': (18, -26),
    'P2': (16, -24),
    'P3': (18, -8),
    'P4': (18, -24),
}

for name, (x, z) in points.items():
    px, py = sx(x), sy(z)
    r = 6
    d.ellipse([px-r, py-r, px+r, py+r], fill='black', outline='white', width=1)
    dx, dy = offsets[name]
    tx, ty = px + dx, py + dy
    bbox = d.textbbox((tx, ty), name, font=font)
    d.rounded_rectangle([bbox[0]-5, bbox[1]-3, bbox[2]+5, bbox[3]+3], radius=4, fill='white', outline='black', width=1)
    d.text((tx, ty), name, fill='black', font=font)
    # small coordinate note
    coord = f'({x:.2f}a, {z:.2f}a)'
    cb = d.textbbox((tx, ty+22), coord, font=small)
    d.rounded_rectangle([cb[0]-4, cb[1]-2, cb[2]+4, cb[3]+2], radius=3, fill='white')
    d.text((tx, ty+22), coord, fill='black', font=small)

flat = Image.new('RGB', img.size, 'white')
flat.paste(img, mask=img.split()[-1])
flat.save(out_path)
print(out_path)
