from pathlib import Path
import re, math
import numpy as np
from scipy.interpolate import CubicSpline
from scipy.integrate import quad
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve
from PIL import Image, ImageDraw, ImageFont

# Load profile
WIN = Path('/Users/iratnere/dev/soil-models/src/tires/33L-32FI34.WIN')
lines = [ln.strip() for ln in WIN.read_text().splitlines() if ln.strip()]
xk = np.array([float(s) for s in re.findall(r'[-+]?\d*\.?\d+', lines[0])], dtype=float)
yk = np.array([float(s) for s in re.findall(r'[-+]?\d*\.?\d+', lines[1])], dtype=float)
a = float(np.max(np.abs(xk)))
xn = xk / a
qn = yk / float(np.max(yk))
cs = CubicSpline(xn, qn, bc_type='not-a-knot')
def q(x): return max(0.0, float(cs(x))) if xn[0] <= x <= xn[-1] else 0.0

# Common plotting grid
xs = np.linspace(-2.0, 2.2, 241)
zs = np.linspace(0.05, 2.3, 121)
X, Z = np.meshgrid(xs, zs)

# Homogeneous exact integral field
H = np.zeros_like(X)
for j, z in enumerate(zs):
    for i, x in enumerate(xs):
        f = lambda xi: q(xi) * (z*z - (x-xi)**2) / (((x-xi)**2 + z*z)**2)
        val, _ = quad(f, xn[0], xn[-1], limit=250)
        H[j, i] = (z / np.pi) * val

# Layered FEA field, E2/E1=30
nu = 0.3
E1 = 100.0
E2 = 3000.0
h = 30.0 / a
L = D = 15.0
nx, nz = 320, 160
x_nodes = np.linspace(-L, L, nx + 1)
z_nodes = np.linspace(0.0, D, nz + 1)
NX, NZ = nx + 1, nz + 1
Nnodes = NX * NZ
nid = lambda i, j: j * NX + i
nodes = np.zeros((Nnodes, 2))
for j in range(NZ):
    for i in range(NX):
        nodes[nid(i, j)] = (x_nodes[i], z_nodes[j])

def Dmat(E):
    c = E / ((1 + nu) * (1 - 2 * nu))
    return np.array([[c*(1-nu), c*nu, 0],[c*nu, c*(1-nu), 0],[0,0,c*(1-2*nu)/2]])

elements = []
for j in range(nz):
    for i in range(nx):
        E = E1 if 0.5*(z_nodes[j] + z_nodes[j+1]) < h else E2
        n00=nid(i,j); n10=nid(i+1,j); n01=nid(i,j+1); n11=nid(i+1,j+1)
        elements.append((n00,n10,n11,E))
        elements.append((n00,n11,n01,E))
K = lil_matrix((2*Nnodes, 2*Nnodes))
elem = []
for n1,n2,n3,E in elements:
    coords = nodes[[n1,n2,n3]]
    x1,z1=coords[0]; x2,z2=coords[1]; x3,z3=coords[2]
    A = 0.5*abs((x2-x1)*(z3-z1)-(x3-x1)*(z2-z1))
    b1=z2-z3; b2=z3-z1; b3=z1-z2; c1=x3-x2; c2=x1-x3; c3=x2-x1
    B = (1/(2*A))*np.array([[b1,0,b2,0,b3,0],[0,c1,0,c2,0,c3],[c1,b1,c2,b2,c3,b3]])
    Dm = Dmat(E)
    Ke = A * B.T @ Dm @ B
    elem.append((B,Dm,n1,n2,n3))
    dofs=[2*n1,2*n1+1,2*n2,2*n2+1,2*n3,2*n3+1]
    for aidx in range(6):
        for bidx in range(6):
            K[dofs[aidx], dofs[bidx]] += Ke[aidx,bidx]
F = np.zeros(2*Nnodes)
for i in range(nx):
    nl=nid(i,0); nr=nid(i+1,0)
    xl=nodes[nl,0]; xr=nodes[nr,0]
    ql=q(xl); qr=q(xr); Lseg=xr-xl
    F[2*nl+1] += (Lseg/6)*(2*ql+qr)
    F[2*nr+1] += (Lseg/6)*(ql+2*qr)
fixed = set()
for j in range(NZ):
    for n in (nid(0,j), nid(nx,j)): fixed |= {2*n, 2*n+1}
for i in range(NX):
    n=nid(i,nz); fixed |= {2*n, 2*n+1}
fixed = sorted(fixed)
free = np.setdiff1d(np.arange(2*Nnodes), fixed)
U = np.zeros(2*Nnodes)
U[free] = spsolve(K.tocsr()[free,:][:,free], F[free])
sx_arr=np.zeros(Nnodes); sz_arr=np.zeros(Nnodes); cnt=np.zeros(Nnodes)
for B,Dm,n1,n2,n3 in elem:
    ue=np.array([U[2*n1],U[2*n1+1],U[2*n2],U[2*n2+1],U[2*n3],U[2*n3+1]])
    sig = Dm @ (B @ ue)
    for n in (n1,n2,n3):
        sx_arr[n]+=sig[0]; sz_arr[n]+=sig[1]; cnt[n]+=1
sx_arr = -sx_arr/cnt; sz_arr = -sz_arr/cnt; szo = 0.5*(sz_arr-sx_arr)

def lay_val(x,z):
    i=max(0,min(nx-1,int(np.searchsorted(x_nodes,x)-1)))
    j=max(0,min(nz-1,int(np.searchsorted(z_nodes,z)-1)))
    x0,x1=x_nodes[i],x_nodes[i+1]; z0,z1=z_nodes[j],z_nodes[j+1]
    fx=(x-x0)/(x1-x0); fz=(z-z0)/(z1-z0)
    n00=j*NX+i; n10=n00+1; n01=(j+1)*NX+i; n11=n01+1
    return (1-fx)*(1-fz)*szo[n00] + fx*(1-fz)*szo[n10] + (1-fx)*fz*szo[n01] + fx*fz*szo[n11]

Lfield = np.zeros_like(X)
for j, z in enumerate(zs):
    for i, x in enumerate(xs):
        Lfield[j, i] = lay_val(x, z)

levels = [-0.10, -0.05, 0.00, 0.05, 0.10, 0.20, 0.30]

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
            elif len(pts)==4:
                segs.append((pts[0],pts[1]))
                segs.append((pts[2],pts[3]))
    return segs

# draw
width,height=1500,1000
pad_l,pad_r,pad_t,pad_b=100,120,60,100
pw=width-pad_l-pad_r; ph=height-pad_t-pad_b
sx = lambda x: pad_l + (x - xs.min())/(xs.max()-xs.min())*pw
sy = lambda z: pad_t + (z - 0.0)/(2.3)*ph
img = Image.new('RGB',(width,height),'white')
d = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 24)
    small = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 18)
except Exception:
    font = ImageFont.load_default(); small = ImageFont.load_default()

d.rectangle([pad_l,pad_t,pad_l+pw,pad_t+ph], outline='black', width=2)
for x in [-2,-1,0,1,2]:
    xx=sx(x); d.line([xx,pad_t+ph,xx,pad_t+ph+8], fill='black'); d.text((xx-8,pad_t+ph+14), str(x), fill='black', font=font)
for z in [0,0.5,1.0,1.5,2.0]:
    yy=sy(z); d.line([pad_l-8,yy,pad_l,yy], fill='black'); d.text((pad_l-42,yy-10), f'{z:g}', fill='black', font=font)
d.text((pad_l+pw/2-20, height-40), 'x / a', fill='black', font=font)
d.text((25, pad_t+ph/2), 'z / a', fill='black', font=font)

# load inset
pts=[]
for x in np.linspace(xn[0], xn[-1], 200):
    pts.append((sx(x), sy(0)+35-70*q(x)))
d.line(pts, fill='black', width=2)
# layer interface
if 0 < h < 2.3:
    d.line([sx(xs.min()), sy(h), sx(xs.max()), sy(h)], fill=(160,160,160), width=1)

# homogeneous exact: black solid
for lev in levels:
    w=3 if abs(lev)<1e-12 else 1
    for a1,b1 in contour_segments(X,Z,H,lev):
        d.line([sx(a1[0]), sy(a1[1]), sx(b1[0]), sy(b1[1])], fill='black', width=w)
# layered FEA: red dashed
for lev in levels:
    for a1,b1 in contour_segments(X,Z,Lfield,lev):
        x1,y1=sx(a1[0]), sy(a1[1]); x2,y2=sx(b1[0]), sy(b1[1])
        steps=max(2,int(math.hypot(x2-x1,y2-y1)//10))
        for k in range(0,steps,2):
            t1=k/steps; t2=min((k+1)/steps,1)
            xa=x1+t1*(x2-x1); ya=y1+t1*(y2-y1)
            xb=x1+t2*(x2-x1); yb=y1+t2*(y2-y1)
            d.line([xa,ya,xb,yb], fill=(200,0,0), width=2)

# points
points = {
    'P1': (0.0,0.5),
    'P2': (0.75,0.25),
    'P3': (0.0,1.5),
    'P4': (1.3,0.4),
}
offsets={'P1':(15,-30),'P2':(15,-30),'P3':(15,-10),'P4':(15,-30)}
for name,(x,z) in points.items():
    px,py=sx(x),sy(z)
    d.ellipse([px-5,py-5,px+5,py+5], fill='blue', outline='white', width=1)
    dx,dy=offsets[name]
    d.rounded_rectangle([px+dx-4, py+dy-4, px+dx+52, py+dy+20], radius=4, fill='white', outline='black', width=1)
    d.text((px+dx, py+dy), name, fill='black', font=font)

# legend
lx = width - 320; ly = 70
# black solid
d.line([lx,ly,lx+50,ly], fill='black', width=2)
d.text((lx+65, ly-12), 'homogeneous exact integral', fill='black', font=small)
# red dashed
for k in range(0,50,12):
    d.line([lx+k, ly+34, lx+k+7, ly+34], fill=(200,0,0), width=2)
d.text((lx+65, ly+22), 'layered FEA, E2/E1 = 30', fill='black', font=small)

out = Path('/Users/iratnere/dev/coyote-math/peacock/screenshots/overlay_homogeneous_vs_layered_e30.png')
img.save(out)
print(out)
