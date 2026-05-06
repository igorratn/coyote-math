from pathlib import Path
import re
import numpy as np
from scipy.interpolate import CubicSpline
from PIL import Image, ImageDraw, ImageFont

WIN = Path('/Users/iratnere/dev/soil-models/src/tires/33L-32FI34.WIN')
lines = [ln.strip() for ln in WIN.read_text().splitlines() if ln.strip()]
xk = np.array([float(s) for s in re.findall(r'[-+]?\d*\.?\d+', lines[0])], dtype=float)
yk = np.array([float(s) for s in re.findall(r'[-+]?\d*\.?\d+', lines[1])], dtype=float)
a = float(np.max(np.abs(xk)))
xn = xk / a
p0 = float(np.max(yk))
qn = yk / p0
cs = CubicSpline(xn, qn, bc_type='not-a-knot')

# Dense load sampling for numerical quadrature of eq. (22)
ksi = np.linspace(xn[0], xn[-1], 2401)
qv = np.clip(cs(ksi), 0.0, None)

# Plot/sample grid
xs = np.linspace(-3.0, 3.0, 241)
zs = np.linspace(0.05, 3.0, 121)
X, Z = np.meshgrid(xs, zs)
S = np.zeros_like(X)

for j, z in enumerate(zs):
    dx = xs[:, None] - ksi[None, :]
    denom = (dx*dx + z*z)**2
    integrand = qv[None, :] * (z*z - dx*dx) / denom
    S[j, :] = (z / np.pi) * np.trapz(integrand, ksi, axis=1)

# contour segments

def contour_segments(X, Z, V, level):
    segs=[]; ny,nx=V.shape
    def interp(p1,p2,v1,v2,level):
        t=0.5 if v2==v1 else (level-v1)/(v2-v1)
        return (p1[0]+t*(p2[0]-p1[0]), p1[1]+t*(p2[1]-p1[1]))
    for j in range(ny-1):
        for i in range(nx-1):
            p00=(X[j,i],Z[j,i]); v00=V[j,i]
            p10=(X[j,i+1],Z[j,i+1]); v10=V[j,i+1]
            p11=(X[j+1,i+1],Z[j+1,i+1]); v11=V[j+1,i+1]
            p01=(X[j+1,i],Z[j+1,i]); v01=V[j+1,i]
            pts=[]
            if (v00-level)*(v10-level) < 0: pts.append(interp(p00,p10,v00,v10,level))
            if (v10-level)*(v11-level) < 0: pts.append(interp(p10,p11,v10,v11,level))
            if (v11-level)*(v01-level) < 0: pts.append(interp(p11,p01,v11,v01,level))
            if (v01-level)*(v00-level) < 0: pts.append(interp(p01,p00,v01,v00,level))
            if len(pts)==2: segs.append((pts[0],pts[1]))
            elif len(pts)==4: segs.append((pts[0],pts[1])); segs.append((pts[2],pts[3]))
    return segs


def load_font(size):
    for p in ['/System/Library/Fonts/Supplemental/Arial.ttf','/System/Library/Fonts/Supplemental/Helvetica.ttf']:
        try: return ImageFont.truetype(p,size=size)
        except: pass
    return ImageFont.load_default()

levels=[-0.2,-0.1,-0.05,0,0.05,0.1,0.2,0.3,0.4]
width,height=1400,1000; pad_l,pad_r,pad_t,pad_b=100,180,50,100
pw=width-pad_l-pad_r; ph=height-pad_t-pad_b
sx=lambda x: pad_l + (x+3.0)/6.0*pw
sy=lambda z: pad_t + (z-0.0)/3.0*ph
img=Image.new('RGB',(width,height),'white'); d=ImageDraw.Draw(img); font=load_font(24)
d.rectangle([pad_l,pad_t,pad_l+pw,pad_t+ph], outline='black', width=2)
for x in range(-3,4):
    xx=sx(x); d.line([xx,pad_t+ph,xx,pad_t+ph+10], fill='black'); d.text((xx-8,pad_t+ph+14), str(x), fill='black', font=font)
for z in range(0,4):
    yy=sy(z); d.line([pad_l-10,yy,pad_l,yy], fill='black'); d.text((pad_l-32,yy-10), str(z), fill='black', font=font)
d.text((pad_l+pw/2-25,height-40),'x / a',fill='black',font=font)
d.text((25,pad_t+ph/2),'z / a',fill='black',font=font)
# actual load shape inset
pts=[]
for x in np.linspace(xn[0], xn[-1], 200):
    q=max(0.0, float(cs(x)))
    pts.append((sx(x), sy(0)+35 - 80*q))
d.line(pts, fill='black', width=2)
d.line([sx(xn[0]), sy(0), sx(xn[-1]), sy(0)], fill='black', width=1)
for lev in levels:
    w=3 if abs(lev)<1e-12 else 1
    for a1,b1 in contour_segments(X,Z,S,lev):
        d.line([sx(a1[0]),sy(a1[1]),sx(b1[0]),sy(b1[1])], fill='black', width=w)
out = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/homogeneous_33L32FI34_closed_solution.png')
img.save(out)
print('WIN used:', WIN.name)
print('x knots normalized:', ' '.join(f'{v:.4f}' for v in xn))
print('q knots normalized:', ' '.join(f'{v:.4f}' for v in qn))
print('sigma_zo/p0 at (0,1)=', float(S[np.argmin(abs(zs-1.0)), np.argmin(abs(xs-0.0))]))
print(out)
