from pathlib import Path
from collections import defaultdict
import re, math
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
ksi = np.linspace(xn[0], xn[-1], 2401)
qv = np.clip(cs(ksi), 0.0, None)
xs = np.linspace(-3.0, 3.0, 241)
zs = np.linspace(0.05, 3.0, 121)
X, Z = np.meshgrid(xs, zs)
S = np.zeros_like(X)
for j, z in enumerate(zs):
    dx = xs[:, None] - ksi[None, :]
    denom = (dx*dx + z*z)**2
    integrand = qv[None, :] * (z*z - dx*dx) / denom
    S[j, :] = (z / np.pi) * np.trapezoid(integrand, ksi, axis=1)

levels=[-0.2,-0.1,-0.05,0,0.05,0.1,0.2,0.3,0.4]

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

def kpt(p, tol=1e-6):
    return (round(p[0]/tol)*tol, round(p[1]/tol)*tol)

def stitch(segs):
    nbr=defaultdict(list); pts={}
    for idx,(a,b) in enumerate(segs):
        ka,kb=kpt(a),kpt(b); pts[ka]=a; pts[kb]=b; nbr[ka].append((idx,kb)); nbr[kb].append((idx,ka))
    used=set(); polys=[]
    def walk(start):
        line=[pts[start]]; cur=start
        while True:
            cands=[(i,nxt) for i,nxt in nbr[cur] if i not in used]
            if not cands: break
            i,nxt=cands[0]; used.add(i); line.append(pts[nxt]); cur=nxt
        return line
    for ep in [k for k,v in nbr.items() if len(v)==1]:
        if any(i not in used for i,_ in nbr[ep]): polys.append(walk(ep))
    for i,(a,b) in enumerate(segs):
        if i in used: continue
        used.add(i); ka,kb=kpt(a),kpt(b); line=[pts[ka],pts[kb]]; cur=kb
        while True:
            cands=[(j,nxt) for j,nxt in nbr[cur] if j not in used]
            if not cands: break
            j,nxt=cands[0]; used.add(j); line.append(pts[nxt]); cur=nxt
        polys.append(line)
    return [p for p in polys if len(p)>=2]

def plen(poly):
    return sum(math.hypot(poly[i+1][0]-poly[i][0], poly[i+1][1]-poly[i][1]) for i in range(len(poly)-1))

def point_angle(poly, frac=0.5):
    total=plen(poly); target=frac*total; acc=0.0
    for i in range(len(poly)-1):
        a,b=poly[i],poly[i+1]
        seg=math.hypot(b[0]-a[0], b[1]-a[1])
        if acc+seg>=target and seg>0:
            t=(target-acc)/seg
            x=a[0]+t*(b[0]-a[0]); y=a[1]+t*(b[1]-a[1])
            ang=math.degrees(math.atan2(b[1]-a[1], b[0]-a[0]))
            if ang>90 or ang<-90: ang+=180
            return x,y,ang
        acc+=seg
    a,b=poly[-2],poly[-1]
    ang=math.degrees(math.atan2(b[1]-a[1], b[0]-a[0]))
    if ang>90 or ang<-90: ang+=180
    return poly[-1][0],poly[-1][1],ang

def load_font(size):
    for p in ['/System/Library/Fonts/Supplemental/Arial.ttf','/System/Library/Fonts/Supplemental/Helvetica.ttf']:
        try: return ImageFont.truetype(p,size=size)
        except: pass
    return ImageFont.load_default()

contours={}
for lev in levels:
    polys=stitch(contour_segments(X,Z,S,lev))
    polys.sort(key=plen, reverse=True)
    contours[lev]=polys

width,height=1400,1000; pad_l,pad_r,pad_t,pad_b=100,70,50,100
pw=width-pad_l-pad_r; ph=height-pad_t-pad_b
sx=lambda x: pad_l + (x+3.0)/6.0*pw
sy=lambda z: pad_t + z/3.0*ph
img=Image.new('RGBA',(width,height),(255,255,255,255)); d=ImageDraw.Draw(img)
font=load_font(24); small=load_font(18)
d.rectangle([pad_l,pad_t,pad_l+pw,pad_t+ph], outline='black', width=2)
for x in range(-3,4):
    xx=sx(x); d.line([xx,pad_t+ph,xx,pad_t+ph+10], fill='black'); d.text((xx-8,pad_t+ph+14), str(x), fill='black', font=font)
for z in range(0,4):
    yy=sy(z); d.line([pad_l-10,yy,pad_l,yy], fill='black'); d.text((pad_l-32,yy-10), str(z), fill='black', font=font)
d.text((pad_l+pw/2-25,height-40),'x / a',fill='black',font=font)
d.text((25,pad_t+ph/2),'z / a',fill='black',font=font)
pts=[]
for x in np.linspace(xn[0], xn[-1], 200):
    q=max(0.0, float(cs(x))); pts.append((sx(x), sy(0)+35-80*q))
d.line(pts, fill='black', width=2); d.line([sx(xn[0]),sy(0),sx(xn[-1]),sy(0)], fill='black', width=1)
for lev, polys in contours.items():
    w=3 if abs(lev)<1e-12 else 1
    for poly in polys:
        d.line([(sx(x),sy(y)) for x,y in poly], fill='black', width=w)
    placed=0
    for poly in polys:
        if plen(poly) < 0.5: continue
        frac=0.45 if placed==0 else 0.7
        x,y,ang = point_angle(poly, frac)
        tx,ty=sx(x),sy(y)
        label=f'{lev:+.2f}'
        bb=d.textbbox((0,0), label, font=small)
        tw,th=bb[2]-bb[0], bb[3]-bb[1]
        label_img=Image.new('RGBA',(tw+10,th+8),(255,255,255,0))
        ld=ImageDraw.Draw(label_img)
        ld.rectangle([0,0,tw+10,th+8], fill=(255,255,255,255))
        ld.text((5,4), label, fill='black', font=small)
        rot=label_img.rotate(-ang, expand=True, fillcolor=(255,255,255,0))
        img.alpha_composite(rot,(int(tx-rot.width/2), int(ty-rot.height/2)))
        placed += 1
        if placed >= 2: break
out=Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/homogeneous_33L32FI34_closed_solution_labeled.png')
flat=Image.new('RGB', img.size, 'white'); flat.paste(img, mask=img.split()[-1]); flat.save(out)
print(out)
