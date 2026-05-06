from pathlib import Path
from collections import defaultdict
import math, re
import numpy as np
from scipy.interpolate import CubicSpline
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve
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

def q_of_x(x):
    if x < xn[0] or x > xn[-1]:
        return 0.0
    return max(0.0, float(cs(x)))

# Figure 4.1 layered case from dissertation-related source
# Upper layer: h=30 cm, E1=100 kg/cm^2, nu=0.3
# Lower layer: E2=370 kg/cm^2, nu=0.3
# Normalize lengths by a = 42 cm (half contact width from .WIN)
a_cm = a
h = 30.0 / a_cm
E1 = 100.0
E2 = 370.0
nu = 0.3
L = D = 15.0
nx, nz = 640, 320
x_nodes = np.linspace(-L, L, nx + 1)
z_nodes = np.linspace(0.0, D, nz + 1)
NX, NZ = nx + 1, nz + 1
Nnodes = NX * NZ

def nid(i, j): return j * NX + i
nodes = np.zeros((Nnodes, 2))
for j in range(NZ):
    for i in range(NX):
        nodes[nid(i, j)] = (x_nodes[i], z_nodes[j])

elements = []
for j in range(nz):
    for i in range(nx):
        n00=nid(i,j); n10=nid(i+1,j); n01=nid(i,j+1); n11=nid(i+1,j+1)
        zmid = 0.5*(z_nodes[j] + z_nodes[j+1])
        E = E1 if zmid < h else E2
        elements.append((n00,n10,n11,E))
        elements.append((n00,n11,n01,E))

def D_matrix(E, nu=0.3):
    c = E / ((1 + nu) * (1 - 2 * nu))
    return np.array([[c*(1-nu), c*nu, 0.0],[c*nu, c*(1-nu), 0.0],[0.0,0.0,c*(1-2*nu)/2]])

def element_K_B(coords, E):
    x1,z1=coords[0]; x2,z2=coords[1]; x3,z3=coords[2]
    A = 0.5 * abs((x2-x1)*(z3-z1) - (x3-x1)*(z2-z1))
    b1=z2-z3; b2=z3-z1; b3=z1-z2
    c1=x3-x2; c2=x1-x3; c3=x2-x1
    B=(1.0/(2*A))*np.array([[b1,0,b2,0,b3,0],[0,c1,0,c2,0,c3],[c1,b1,c2,b2,c3,b3]])
    Dm = D_matrix(E, nu)
    return A * B.T @ Dm @ B, B, Dm

K = lil_matrix((2*Nnodes, 2*Nnodes))
Bs = []
for n1,n2,n3,E in elements:
    Ke,B,Dm = element_K_B(nodes[[n1,n2,n3]], E)
    Bs.append((B,Dm,n1,n2,n3))
    dofs=[2*n1,2*n1+1,2*n2,2*n2+1,2*n3,2*n3+1]
    for aidx in range(6):
        for bidx in range(6):
            K[dofs[aidx], dofs[bidx]] += Ke[aidx,bidx]

F = np.zeros(2*Nnodes)
for i in range(nx):
    nl=nid(i,0); nr=nid(i+1,0)
    xl=nodes[nl,0]; xr=nodes[nr,0]
    ql=q_of_x(xl); qr=q_of_x(xr); Lseg=xr-xl
    F[2*nl+1] += (Lseg/6.0)*(2*ql + qr)
    F[2*nr+1] += (Lseg/6.0)*(ql + 2*qr)

fixed=set()
for j in range(NZ):
    for n in (nid(0,j), nid(nx,j)):
        fixed.add(2*n); fixed.add(2*n+1)
for i in range(NX):
    n=nid(i,nz); fixed.add(2*n); fixed.add(2*n+1)
fixed=sorted(fixed)
free=np.setdiff1d(np.arange(2*Nnodes), fixed)
U=np.zeros(2*Nnodes)
U[free] = spsolve(K.tocsr()[free,:][:,free], F[free])

sigma_x=np.zeros(Nnodes); sigma_z=np.zeros(Nnodes); count=np.zeros(Nnodes)
for B,Dm,n1,n2,n3 in Bs:
    ue=np.array([U[2*n1],U[2*n1+1],U[2*n2],U[2*n2+1],U[2*n3],U[2*n3+1]])
    sig = Dm @ (B @ ue)
    for n in (n1,n2,n3):
        sigma_x[n] += sig[0]
        sigma_z[n] += sig[1]
        count[n] += 1
sigma_x = -sigma_x / count
sigma_z = -sigma_z / count
sigma_zo = 0.5 * (sigma_z - sigma_x)
V = sigma_zo.reshape((NZ, NX))
Xg, Zg = np.meshgrid(x_nodes, z_nodes)

# crop to Fig. 4.1-like area
x_min,x_max=-3,3; z_min,z_max=0,3
xi=np.where((x_nodes>=x_min)&(x_nodes<=x_max))[0]
zi=np.where((z_nodes>=z_min)&(z_nodes<=z_max))[0]
X=Xg[np.ix_(zi,xi)]; Z=Zg[np.ix_(zi,xi)]; Vc=V[np.ix_(zi,xi)]
levels=[-0.2,-0.1,-0.05,0,0.05,0.1,0.2,0.3,0.4]

# contour helpers

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

def kpt(p, tol=1e-6): return (round(p[0]/tol)*tol, round(p[1]/tol)*tol)

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

def plen(poly): return sum(math.hypot(poly[i+1][0]-poly[i][0], poly[i+1][1]-poly[i][1]) for i in range(len(poly)-1))

def point_angle(poly, frac=0.5):
    total=plen(poly); target=frac*total; acc=0.0
    for i in range(len(poly)-1):
        a,b=poly[i],poly[i+1]; seg=math.hypot(b[0]-a[0], b[1]-a[1])
        if acc+seg>=target and seg>0:
            t=(target-acc)/seg; x=a[0]+t*(b[0]-a[0]); y=a[1]+t*(b[1]-a[1])
            ang=math.degrees(math.atan2(b[1]-a[1], b[0]-a[0]))
            if ang>90 or ang<-90: ang+=180
            return x,y,ang
        acc+=seg
    a,b=poly[-2],poly[-1]; ang=math.degrees(math.atan2(b[1]-a[1], b[0]-a[0]))
    if ang>90 or ang<-90: ang+=180
    return poly[-1][0],poly[-1][1],ang

def load_font(size):
    for p in ['/System/Library/Fonts/Supplemental/Arial.ttf','/System/Library/Fonts/Supplemental/Helvetica.ttf']:
        try: return ImageFont.truetype(p,size=size)
        except: pass
    return ImageFont.load_default()

contours={}
for lev in levels:
    polys=stitch(contour_segments(X,Z,Vc,lev))
    polys.sort(key=plen, reverse=True)
    contours[lev]=polys

width,height=1400,1000; pad_l,pad_r,pad_t,pad_b=100,70,50,100
pw=width-pad_l-pad_r; ph=height-pad_t-pad_b
sx=lambda x: pad_l + (x-x_min)/(x_max-x_min)*pw
sy=lambda z: pad_t + (z-z_min)/(z_max-z_min)*ph
img=Image.new('RGBA',(width,height),(255,255,255,255)); d=ImageDraw.Draw(img)
font=load_font(24); small=load_font(18)
d.rectangle([pad_l,pad_t,pad_l+pw,pad_t+ph], outline='black', width=2)
for x in range(-3,4):
    xx=sx(x); d.line([xx,pad_t+ph,xx,pad_t+ph+10], fill='black'); d.text((xx-8,pad_t+ph+14), str(x), fill='black', font=font)
for z in range(0,4):
    yy=sy(z); d.line([pad_l-10,yy,pad_l,yy], fill='black'); d.text((pad_l-32,yy-10), str(z), fill='black', font=font)
d.text((pad_l+pw/2-25,height-40),'x / a',fill='black',font=font)
d.text((25,pad_t+ph/2),'z / a',fill='black',font=font)
# load shape inset
pts=[]
for x in np.linspace(xn[0], xn[-1], 200):
    q=q_of_x(x); pts.append((sx(x), sy(0)+35-80*q))
d.line(pts, fill='black', width=2); d.line([sx(xn[0]),sy(0),sx(xn[-1]),sy(0)], fill='black', width=1)
# layer boundary
if z_min <= h <= z_max:
    d.line([sx(x_min), sy(h), sx(x_max), sy(h)], fill='black', width=1)
for lev, polys in contours.items():
    w=3 if abs(lev)<1e-12 else 1
    for poly in polys:
        d.line([(sx(x),sy(y)) for x,y in poly], fill='black', width=w)
    placed=0
    for poly in polys:
        if plen(poly) < 0.5: continue
        frac=0.45 if placed==0 else 0.7
        x,y,ang=point_angle(poly, frac)
        tx,ty=sx(x),sy(y)
        label=f'{lev:+.2f}'
        bb=d.textbbox((0,0), label, font=small)
        tw,th=bb[2]-bb[0], bb[3]-bb[1]
        label_img=Image.new('RGBA',(tw+10,th+8),(255,255,255,0))
        ld=ImageDraw.Draw(label_img)
        ld.rectangle([0,0,tw+10,th+8], fill=(255,255,255,255))
        ld.text((5,4), label, fill='black', font=small)
        rot=label_img.rotate(-ang, expand=True, fillcolor=(255,255,255,0))
        img.alpha_composite(rot, (int(tx-rot.width/2), int(ty-rot.height/2)))
        placed += 1
        if placed >= 2: break
out=Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/figure_4_1_fea_labeled.png')
flat=Image.new('RGB', img.size, 'white'); flat.paste(img, mask=img.split()[-1]); flat.save(out)
print('h/a =', h)
print(out)
