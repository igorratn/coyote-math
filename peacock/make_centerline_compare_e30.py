from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Precomputed samples from the latest run (x=0 centerline, same tire, E2/E1=30)
rows = [
    (0.150, 0.19080, 0.31491),
    (0.273, 0.25538, 0.34646),
    (0.397, 0.27894, 0.34083),
    (0.520, 0.28124, 0.31234),
    (0.643, 0.27344, 0.27554),
    (0.767, 0.25988, 0.23409),
    (0.890, 0.24311, 0.20390),
    (1.013, 0.22564, 0.19454),
    (1.137, 0.20872, 0.20053),
    (1.260, 0.19301, 0.21033),
    (1.383, 0.19003, 0.21614),
    (1.507, 0.17878, 0.20572),
    (1.630, 0.16855, 0.19550),
    (1.753, 0.15925, 0.18571),
    (1.877, 0.15079, 0.17644),
    (2.000, 0.14309, 0.16771),
]

z = [r[0] for r in rows]
hom = [r[1] for r in rows]
lay = [r[2] for r in rows]

W, H = 1400, 1000
pad_l, pad_r, pad_t, pad_b = 120, 80, 70, 100
pw = W - pad_l - pad_r
ph = H - pad_t - pad_b
xmin, xmax = 0.0, 2.0
vmin, vmax = 0.12, 0.38
sx = lambda x: pad_l + (x - xmin)/(xmax - xmin)*pw
sy = lambda y: pad_t + (vmax - y)/(vmax - vmin)*ph

img = Image.new('RGB', (W,H), 'white')
d = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 24)
    small = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 18)
    title = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 30)
except Exception:
    font = ImageFont.load_default(); small = ImageFont.load_default(); title = ImageFont.load_default()

# axes

d.rectangle([pad_l, pad_t, pad_l+pw, pad_t+ph], outline='black', width=2)
for x in [0,0.25,0.5,0.75,1.0,1.25,1.5,1.75,2.0]:
    xx = sx(x)
    d.line([xx, pad_t+ph, xx, pad_t+ph+8], fill='black')
    d.text((xx-12, pad_t+ph+14), f'{x:g}', fill='black', font=small)
for y in [0.15,0.20,0.25,0.30,0.35]:
    yy = sy(y)
    d.line([pad_l-8, yy, pad_l, yy], fill='black')
    d.text((pad_l-72, yy-10), f'{y:.2f}', fill='black', font=small)

d.text((W//2-190, 20), 'Centerline comparison: x = 0, same tire load, E2/E1 = 30', fill='black', font=title)
d.text((W//2-40, H-45), 'z / a', fill='black', font=font)
d.text((20, H//2-20), 'σzo / p0', fill='black', font=font)

# curves
hom_pts = [(sx(x), sy(y)) for x,y in zip(z,hom)]
lay_pts = [(sx(x), sy(y)) for x,y in zip(z,lay)]
d.line(hom_pts, fill='black', width=3)
for i in range(len(lay_pts)-1):
    x1,y1 = lay_pts[i]
    x2,y2 = lay_pts[i+1]
    steps = max(2, int(((x2-x1)**2 + (y2-y1)**2)**0.5 // 10))
    for k in range(0, steps, 2):
        t1 = k/steps
        t2 = min((k+1)/steps, 1)
        xa = x1 + t1*(x2-x1)
        ya = y1 + t1*(y2-y1)
        xb = x1 + t2*(x2-x1)
        yb = y1 + t2*(y2-y1)
        d.line([xa,ya,xb,yb], fill=(200,0,0), width=3)

# sample markers for strongest differences
for zz, hv, lv in rows[:4]:
    d.ellipse([sx(zz)-4, sy(hv)-4, sx(zz)+4, sy(hv)+4], fill='black')
    d.ellipse([sx(zz)-4, sy(lv)-4, sx(zz)+4, sy(lv)+4], fill=(200,0,0))

# legend
lx, ly = 900, 130
d.line([lx,ly,lx+60,ly], fill='black', width=3)
d.text((lx+75, ly-12), 'homogeneous exact', fill='black', font=font)
for k in range(0,60,14):
    d.line([lx+k,ly+36,lx+k+8,ly+36], fill=(200,0,0), width=3)
d.text((lx+75, ly+24), 'layered FEA', fill='black', font=font)

d.rounded_rectangle([860, 210, 1320, 360], radius=8, fill='white', outline='black')
notes = [
    'Strongest layered effect is shallow:',
    'z≈0.15a: +0.1908 → +0.3149 (+65%)',
    'z≈0.273a: +0.2554 → +0.3465 (+36%)',
    'z≈0.397a: +0.2789 → +0.3408 (+22%)',
]
y = 225
for line in notes:
    d.text((880, y), line, fill='black', font=small)
    y += 30

out = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/centerline_compare_e30.png')
img.save(out)
print(out)
