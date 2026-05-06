import math
from pathlib import Path
import numpy as np

from peacock_fea import run_fea


def interp(p1, p2, v1, v2, level):
    if v2 == v1:
        t = 0.5
    else:
        t = (level - v1) / (v2 - v1)
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
            if (v00 - level) * (v10 - level) < 0:
                pts.append(interp(p00, p10, v00, v10, level))
            if (v10 - level) * (v11 - level) < 0:
                pts.append(interp(p10, p11, v10, v11, level))
            if (v11 - level) * (v01 - level) < 0:
                pts.append(interp(p11, p01, v11, v01, level))
            if (v01 - level) * (v00 - level) < 0:
                pts.append(interp(p01, p00, v01, v00, level))

            # Handle exact touches crudely: nudge-level behavior not needed for our smooth field.
            if len(pts) == 2:
                segs.append((pts[0], pts[1]))
            elif len(pts) == 4:
                # Ambiguous saddle: connect 0-1 and 2-3.
                segs.append((pts[0], pts[1]))
                segs.append((pts[2], pts[3]))
    return segs


def make_svg(out_path: Path):
    res = run_fea(E1=1.0, E2=100.0, nu=0.3, h=1.0, a=1.0,
                  L=15.0, D=15.0, nx=320, nz=160, p0=1.0, verbose=False)

    Xg, Zg = np.meshgrid(res['x_nodes'], res['z_nodes'])
    V = res['sigma_zo'].reshape((res['NZ'], res['NX']))

    # Crop to the interesting region
    x_min, x_max = -3.0, 3.0
    z_min, z_max = 0.0, 3.0
    xi = np.where((res['x_nodes'] >= x_min) & (res['x_nodes'] <= x_max))[0]
    zi = np.where((res['z_nodes'] >= z_min) & (res['z_nodes'] <= z_max))[0]
    X = Xg[np.ix_(zi, xi)]
    Z = Zg[np.ix_(zi, xi)]
    Vc = V[np.ix_(zi, xi)]

    levels = [-0.20, -0.10, -0.05, 0.00, 0.05, 0.10, 0.20, 0.30, 0.40]

    width, height = 1200, 900
    pad_l, pad_r, pad_t, pad_b = 80, 120, 40, 80
    pw = width - pad_l - pad_r
    ph = height - pad_t - pad_b

    def sx(x):
        return pad_l + (x - x_min) / (x_max - x_min) * pw
    def sy(z):
        return pad_t + (z - z_min) / (z_max - z_min) * ph

    parts = []
    parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">')
    parts.append('<rect width="100%" height="100%" fill="white"/>')
    # border
    parts.append(f'<rect x="{pad_l}" y="{pad_t}" width="{pw}" height="{ph}" fill="none" stroke="black" stroke-width="2"/>')

    # axes ticks
    for x in range(-3, 4):
        xx = sx(x)
        parts.append(f'<line x1="{xx:.1f}" y1="{pad_t+ph}" x2="{xx:.1f}" y2="{pad_t+ph+8}" stroke="black" stroke-width="1"/>')
        parts.append(f'<text x="{xx:.1f}" y="{pad_t+ph+28}" font-size="20" text-anchor="middle" fill="black">{x}</text>')
    for z in range(0, 4):
        yy = sy(z)
        parts.append(f'<line x1="{pad_l-8}" y1="{yy:.1f}" x2="{pad_l}" y2="{yy:.1f}" stroke="black" stroke-width="1"/>')
        parts.append(f'<text x="{pad_l-18}" y="{yy+7:.1f}" font-size="20" text-anchor="end" fill="black">{z}</text>')

    parts.append(f'<text x="{pad_l + pw/2:.1f}" y="{height-20}" font-size="24" text-anchor="middle" fill="black">x / a</text>')
    parts.append(f'<text x="28" y="{pad_t + ph/2:.1f}" font-size="24" text-anchor="middle" fill="black" transform="rotate(-90 28 {pad_t + ph/2:.1f})">z / a</text>')

    # draw load footprint at top
    parts.append(f'<line x1="{sx(-1):.1f}" y1="{sy(0):.1f}" x2="{sx(1):.1f}" y2="{sy(0):.1f}" stroke="black" stroke-width="4"/>')

    # contours
    for lev in levels:
        segs = contour_segments(X, Z, Vc, lev)
        sw = 3 if abs(lev) < 1e-12 else 1.5
        for (a, b) in segs:
            parts.append(
                f'<line x1="{sx(a[0]):.2f}" y1="{sy(a[1]):.2f}" x2="{sx(b[0]):.2f}" y2="{sy(b[1]):.2f}" stroke="black" stroke-width="{sw}"/>'
            )

    # line levels legend only
    lx = width - pad_r + 20
    ly = pad_t + 20
    parts.append(f'<text x="{lx}" y="{ly}" font-size="22" fill="black">Line levels</text>')
    for k, lev in enumerate(levels, start=1):
        y = ly + 30 * k
        sw = 3 if abs(lev) < 1e-12 else 1.5
        parts.append(f'<line x1="{lx}" y1="{y-6}" x2="{lx+40}" y2="{y-6}" stroke="black" stroke-width="{sw}"/>')
        parts.append(f'<text x="{lx+55}" y="{y}" font-size="20" fill="black">{lev:+.2f}</text>')

    parts.append('</svg>')
    out_path.write_text('\n'.join(parts))
    print(out_path)


if __name__ == '__main__':
    out = Path('/Users/iratnere/.openclaw/workspace/peacock_line_levels.svg')
    make_svg(out)
