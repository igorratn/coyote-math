from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from peacock_fea import run_fea


def interp(p1, p2, v1, v2, level):
    t = 0.5 if v2 == v1 else (level - v1) / (v2 - v1)
    return (p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1]))


def contour_segments(X, Z, V, level):
    ny, nx = V.shape
    segs = []
    for j in range(ny - 1):
        for i in range(nx - 1):
            p00 = (X[j, i], Z[j, i]);     v00 = V[j, i]
            p10 = (X[j, i+1], Z[j, i+1]); v10 = V[j, i+1]
            p11 = (X[j+1, i+1], Z[j+1, i+1]); v11 = V[j+1, i+1]
            p01 = (X[j+1, i], Z[j+1, i]); v01 = V[j+1, i]
            pts = []
            if (v00 - level) * (v10 - level) < 0: pts.append(interp(p00, p10, v00, v10, level))
            if (v10 - level) * (v11 - level) < 0: pts.append(interp(p10, p11, v10, v11, level))
            if (v11 - level) * (v01 - level) < 0: pts.append(interp(p11, p01, v11, v01, level))
            if (v01 - level) * (v00 - level) < 0: pts.append(interp(p01, p00, v01, v00, level))
            if len(pts) == 2:
                segs.append((pts[0], pts[1]))
            elif len(pts) == 4:
                segs.append((pts[0], pts[1]))
                segs.append((pts[2], pts[3]))
    return segs

res = run_fea(E1=1.0, E2=100.0, nu=0.3, h=1.0, a=1.0,
              L=15.0, D=15.0, nx=320, nz=160, p0=1.0, verbose=False)
Xg, Zg = np.meshgrid(res['x_nodes'], res['z_nodes'])
V = res['sigma_zo'].reshape((res['NZ'], res['NX']))
x_min, x_max = -3.0, 3.0
z_min, z_max = 0.0, 3.0
xi = np.where((res['x_nodes'] >= x_min) & (res['x_nodes'] <= x_max))[0]
zi = np.where((res['z_nodes'] >= z_min) & (res['z_nodes'] <= z_max))[0]
X = Xg[np.ix_(zi, xi)]
Z = Zg[np.ix_(zi, xi)]
Vc = V[np.ix_(zi, xi)]
levels = [-0.20, -0.10, -0.05, 0.00, 0.05, 0.10, 0.20, 0.30, 0.40]

width, height = 1400, 1000
pad_l, pad_r, pad_t, pad_b = 100, 180, 50, 100
pw = width - pad_l - pad_r
ph = height - pad_t - pad_b
sx = lambda x: pad_l + (x - x_min) / (x_max - x_min) * pw
sy = lambda z: pad_t + (z - z_min) / (z_max - z_min) * ph

img = Image.new('RGB', (width, height), 'white')
d = ImageDraw.Draw(img)
font = ImageFont.load_default(size=22) if hasattr(ImageFont, 'load_default') else None

# Border and axes

d.rectangle([pad_l, pad_t, pad_l+pw, pad_t+ph], outline='black', width=2)
for x in range(-3, 4):
    xx = sx(x)
    d.line([xx, pad_t+ph, xx, pad_t+ph+10], fill='black', width=1)
    d.text((xx-10, pad_t+ph+18), str(x), fill='black', font=font)
for z in range(0, 4):
    yy = sy(z)
    d.line([pad_l-10, yy, pad_l, yy], fill='black', width=1)
    d.text((pad_l-35, yy-8), str(z), fill='black', font=font)
d.text((pad_l+pw/2-20, height-40), 'x/a', fill='black', font=font)
d.text((20, pad_t+ph/2), 'z/a', fill='black', font=font)

d.line([sx(-1), sy(0), sx(1), sy(0)], fill='black', width=4)

for lev in levels:
    segs = contour_segments(X, Z, Vc, lev)
    w = 3 if abs(lev) < 1e-12 else 1
    for a,b in segs:
        d.line([sx(a[0]), sy(a[1]), sx(b[0]), sy(b[1])], fill='black', width=w)

lx, ly = width - pad_r + 20, pad_t + 20
d.text((lx, ly), 'Line levels', fill='black', font=font)
for k, lev in enumerate(levels, start=1):
    y = ly + 34*k
    w = 3 if abs(lev) < 1e-12 else 1
    d.line([lx, y, lx+45, y], fill='black', width=w)
    d.text((lx+60, y-10), f'{lev:+.2f}', fill='black', font=font)

out = Path('/Users/iratnere/.openclaw/workspace/peacock_line_levels.png')
img.save(out)
print(out)
