from pathlib import Path
from collections import defaultdict
import math
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


def kpt(p, tol=1e-6):
    return (round(p[0] / tol) * tol, round(p[1] / tol) * tol)


def stitch_polylines(segs, tol=1e-6):
    neighbors = defaultdict(list)
    points = {}
    for idx, (a, b) in enumerate(segs):
        ka, kb = kpt(a, tol), kpt(b, tol)
        points[ka] = a
        points[kb] = b
        neighbors[ka].append((idx, kb))
        neighbors[kb].append((idx, ka))

    used = set()
    polylines = []

    def walk(start_key, first_seg_idx=None):
        line = [points[start_key]]
        current = start_key
        prev_seg = first_seg_idx
        while True:
            candidates = [(idx, nxt) for idx, nxt in neighbors[current] if idx not in used]
            if not candidates:
                break
            idx, nxt = candidates[0]
            used.add(idx)
            line.append(points[nxt])
            current = nxt
        return line

    endpoints = [k for k, lst in neighbors.items() if len(lst) == 1]
    for ep in endpoints:
        if any(idx not in used for idx, _ in neighbors[ep]):
            polylines.append(walk(ep))

    for idx, (a, b) in enumerate(segs):
        if idx in used:
            continue
        used.add(idx)
        ka, kb = kpt(a, tol), kpt(b, tol)
        line = [points[ka], points[kb]]
        # extend forward
        current = kb
        while True:
            cands = [(j, nxt) for j, nxt in neighbors[current] if j not in used]
            if not cands:
                break
            j, nxt = cands[0]
            used.add(j)
            line.append(points[nxt])
            current = nxt
        # extend backward
        current = ka
        prefix = []
        while True:
            cands = [(j, nxt) for j, nxt in neighbors[current] if j not in used]
            if not cands:
                break
            j, nxt = cands[0]
            used.add(j)
            prefix.append(points[nxt])
            current = nxt
        polylines.append(list(reversed(prefix)) + line)
    return [p for p in polylines if len(p) >= 2]


def polyline_length(poly):
    return sum(math.hypot(poly[i+1][0]-poly[i][0], poly[i+1][1]-poly[i][1]) for i in range(len(poly)-1))


def point_and_angle_at(poly, frac=0.5):
    total = polyline_length(poly)
    target = total * frac
    acc = 0.0
    for i in range(len(poly)-1):
        a, b = poly[i], poly[i+1]
        seglen = math.hypot(b[0]-a[0], b[1]-a[1])
        if acc + seglen >= target and seglen > 0:
            t = (target - acc) / seglen
            x = a[0] + t * (b[0]-a[0])
            y = a[1] + t * (b[1]-a[1])
            ang = math.degrees(math.atan2(b[1]-a[1], b[0]-a[0]))
            if ang > 90 or ang < -90:
                ang += 180
            return (x, y, ang)
        acc += seglen
    a, b = poly[-2], poly[-1]
    ang = math.degrees(math.atan2(b[1]-a[1], b[0]-a[0]))
    if ang > 90 or ang < -90:
        ang += 180
    return (poly[-1][0], poly[-1][1], ang)


def load_font(size):
    for p in [
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Supplemental/Helvetica.ttf',
        '/System/Library/Fonts/SFNS.ttf',
    ]:
        try:
            return ImageFont.truetype(p, size=size)
        except Exception:
            pass
    return ImageFont.load_default()


res = run_fea(E1=1.0, E2=100.0, nu=0.3, h=1.0, a=1.0,
              L=15.0, D=15.0, nx=640, nz=320, p0=1.0, verbose=False)
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

# Build contours
contours = {}
for lev in levels:
    segs = contour_segments(X, Z, Vc, lev)
    polys = stitch_polylines(segs)
    polys.sort(key=polyline_length, reverse=True)
    contours[lev] = polys

width, height = 1400, 1000
pad_l, pad_r, pad_t, pad_b = 100, 70, 50, 100
pw = width - pad_l - pad_r
ph = height - pad_t - pad_b
sx = lambda x: pad_l + (x - x_min) / (x_max - x_min) * pw
sy = lambda z: pad_t + (z - z_min) / (z_max - z_min) * ph

# SVG
svg_parts = []
svg_parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">')
svg_parts.append('<rect width="100%" height="100%" fill="white"/>')
svg_parts.append(f'<rect x="{pad_l}" y="{pad_t}" width="{pw}" height="{ph}" fill="none" stroke="black" stroke-width="2"/>')
for x in range(-3,4):
    xx = sx(x)
    svg_parts.append(f'<line x1="{xx:.1f}" y1="{pad_t+ph}" x2="{xx:.1f}" y2="{pad_t+ph+10}" stroke="black"/>')
    svg_parts.append(f'<text x="{xx:.1f}" y="{pad_t+ph+34}" font-size="22" text-anchor="middle" fill="black">{x}</text>')
for z in range(0,4):
    yy = sy(z)
    svg_parts.append(f'<line x1="{pad_l-10}" y1="{yy:.1f}" x2="{pad_l}" y2="{yy:.1f}" stroke="black"/>')
    svg_parts.append(f'<text x="{pad_l-18}" y="{yy+8:.1f}" font-size="22" text-anchor="end" fill="black">{z}</text>')
svg_parts.append(f'<text x="{pad_l + pw/2:.1f}" y="{height-28}" font-size="26" text-anchor="middle" fill="black">x / a</text>')
svg_parts.append(f'<text x="30" y="{pad_t + ph/2:.1f}" font-size="26" text-anchor="middle" fill="black" transform="rotate(-90 30 {pad_t + ph/2:.1f})">z / a</text>')
svg_parts.append(f'<line x1="{sx(-1):.1f}" y1="{sy(0):.1f}" x2="{sx(1):.1f}" y2="{sy(0):.1f}" stroke="black" stroke-width="4"/>')

for lev, polys in contours.items():
    sw = 3 if abs(lev) < 1e-12 else 1.5
    for poly in polys:
        pts = ' '.join(f'{sx(x):.2f},{sy(y):.2f}' for x,y in poly)
        svg_parts.append(f'<polyline points="{pts}" fill="none" stroke="black" stroke-width="{sw}"/>')
    # label 1-2 longest usable polylines
    placed = 0
    for poly in polys:
        if polyline_length(poly) < 0.6:
            continue
        frac = 0.5 if placed == 0 else 0.68
        x, y, ang = point_and_angle_at(poly, frac)
        tx, ty = sx(x), sy(y)
        label = f'{lev:+.2f}'
        svg_parts.append(f'<g transform="translate({tx:.2f},{ty:.2f}) rotate({-ang:.2f})">')
        svg_parts.append('<rect x="-22" y="-11" width="44" height="18" fill="white"/>')
        svg_parts.append(f'<text x="0" y="4" font-size="16" text-anchor="middle" fill="black">{label}</text>')
        svg_parts.append('</g>')
        placed += 1
        if placed >= 2:
            break

svg_parts.append('</svg>')
svg_path = Path('/Users/iratnere/.openclaw/workspace/peacock_line_levels_labeled.svg')
svg_path.write_text('\n'.join(svg_parts))

# PNG
img = Image.new('RGB', (width, height), 'white')
d = ImageDraw.Draw(img)
font = load_font(24)
small = load_font(18)
d.rectangle([pad_l, pad_t, pad_l+pw, pad_t+ph], outline='black', width=2)
for x in range(-3,4):
    xx = sx(x)
    d.line([xx, pad_t+ph, xx, pad_t+ph+10], fill='black', width=1)
    d.text((xx-8, pad_t+ph+14), str(x), fill='black', font=font)
for z in range(0,4):
    yy = sy(z)
    d.line([pad_l-10, yy, pad_l, yy], fill='black', width=1)
    d.text((pad_l-32, yy-10), str(z), fill='black', font=font)
d.text((pad_l+pw/2-20, height-40), 'x / a', fill='black', font=font)
d.text((24, pad_t+ph/2), 'z / a', fill='black', font=font)
d.line([sx(-1), sy(0), sx(1), sy(0)], fill='black', width=4)

for lev, polys in contours.items():
    w = 3 if abs(lev) < 1e-12 else 1
    for poly in polys:
        pts = [(sx(x), sy(y)) for x,y in poly]
        d.line(pts, fill='black', width=w)
    placed = 0
    for poly in polys:
        if polyline_length(poly) < 0.6:
            continue
        frac = 0.5 if placed == 0 else 0.68
        x, y, ang = point_and_angle_at(poly, frac)
        tx, ty = sx(x), sy(y)
        label = f'{lev:+.2f}'
        bbox = d.textbbox((0,0), label, font=small)
        tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
        label_img = Image.new('RGBA', (tw+10, th+8), (255,255,255,0))
        ld = ImageDraw.Draw(label_img)
        ld.rectangle([0,0,tw+10,th+8], fill=(255,255,255,255))
        ld.text((5,4), label, fill='black', font=small)
        rot = label_img.rotate(-ang, expand=True, fillcolor=(255,255,255,0))
        img.alpha_composite(rot, (int(tx-rot.width/2), int(ty-rot.height/2))) if img.mode == 'RGBA' else None
        placed += 1
        if placed >= 2:
            break

if img.mode != 'RGBA':
    # rebuild with alpha support for labels then flatten
    img_rgba = img.convert('RGBA')
    d = ImageDraw.Draw(img_rgba)
    # redraw labels only
    for lev, polys in contours.items():
        placed = 0
        for poly in polys:
            if polyline_length(poly) < 0.6:
                continue
            frac = 0.5 if placed == 0 else 0.68
            x, y, ang = point_and_angle_at(poly, frac)
            tx, ty = sx(x), sy(y)
            label = f'{lev:+.2f}'
            bbox = d.textbbox((0,0), label, font=small)
            tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
            label_img = Image.new('RGBA', (tw+10, th+8), (255,255,255,0))
            ld = ImageDraw.Draw(label_img)
            ld.rectangle([0,0,tw+10,th+8], fill=(255,255,255,255))
            ld.text((5,4), label, fill='black', font=small)
            rot = label_img.rotate(-ang, expand=True, fillcolor=(255,255,255,0))
            img_rgba.alpha_composite(rot, (int(tx-rot.width/2), int(ty-rot.height/2)))
            placed += 1
            if placed >= 2:
                break
    img = Image.new('RGB', img_rgba.size, 'white')
    img.paste(img_rgba, mask=img_rgba.split()[-1])

png_path = Path('/Users/iratnere/.openclaw/workspace/peacock_line_levels_labeled.png')
img.save(png_path)
print(svg_path)
print(png_path)
