from pathlib import Path
import math, re
import numpy as np
from scipy.interpolate import CubicSpline
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve
from PIL import Image, ImageDraw, ImageFont

WIN = Path('/Users/iratnere/dev/soil-models/src/tires/33L-32FI34.WIN')

# Parse .WIN
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


def run_fea_custom(E=1.0, nu=0.3, L=15.0, D=15.0, nx=480, nz=240, verbose=False):
    x_nodes = np.linspace(-L, L, nx + 1)
    z_nodes = np.linspace(0.0, D, nz + 1)
    NX = nx + 1; NZ = nz + 1; Nnodes = NX * NZ
    def nid(i, j): return j * NX + i
    nodes = np.zeros((Nnodes, 2))
    for j in range(NZ):
        for i in range(NX):
            nodes[nid(i, j)] = (x_nodes[i], z_nodes[j])
    elements = []
    for j in range(nz):
        for i in range(nx):
            n00=nid(i,j); n10=nid(i+1,j); n01=nid(i,j+1); n11=nid(i+1,j+1)
            elements.append((n00,n10,n11,E))
            elements.append((n00,n11,n01,E))
    def D_matrix(E, nu):
        c = E / ((1 + nu) * (1 - 2 * nu))
        return np.array([[c*(1-nu), c*nu, 0.0],[c*nu, c*(1-nu), 0.0],[0.0,0.0,c*(1-2*nu)/2]])
    def element_K_B(coords, E, nu):
        x1,z1=coords[0]; x2,z2=coords[1]; x3,z3=coords[2]
        A = 0.5 * abs((x2-x1)*(z3-z1) - (x3-x1)*(z2-z1))
        b1=z2-z3; b2=z3-z1; b3=z1-z2
        c1=x3-x2; c2=x1-x3; c3=x2-x1
        B=(1.0/(2*A))*np.array([[b1,0,b2,0,b3,0],[0,c1,0,c2,0,c3],[c1,b1,c2,b2,c3,b3]])
        D=D_matrix(E,nu)
        K=A*B.T@D@B
        return K,B,D
    K = lil_matrix((2*Nnodes, 2*Nnodes))
    elem_data=[]
    for (n1,n2,n3,Ee) in elements:
        coords=nodes[[n1,n2,n3]]
        Ke,B,Dm = element_K_B(coords,Ee,nu)
        elem_data.append((B,Dm,n1,n2,n3))
        dofs=[2*n1,2*n1+1,2*n2,2*n2+1,2*n3,2*n3+1]
        for aidx in range(6):
            for bidx in range(6):
                K[dofs[aidx], dofs[bidx]] += Ke[aidx,bidx]
    F=np.zeros(2*Nnodes)
    for i in range(nx):
        n_left=nid(i,0); n_right=nid(i+1,0)
        x_left=nodes[n_left,0]; x_right=nodes[n_right,0]
        q_left=q_of_x(x_left); q_right=q_of_x(x_right)
        Lseg=x_right-x_left
        F[2*n_left+1] += (Lseg/6.0)*(2*q_left + q_right)
        F[2*n_right+1] += (Lseg/6.0)*(q_left + 2*q_right)
    fixed=set()
    for j in range(NZ):
        for n in (nid(0,j), nid(nx,j)):
            fixed.add(2*n); fixed.add(2*n+1)
    for i in range(NX):
        n=nid(i,nz); fixed.add(2*n); fixed.add(2*n+1)
    fixed=sorted(fixed)
    all_dofs=np.arange(2*Nnodes)
    free=np.setdiff1d(all_dofs, fixed)
    U=np.zeros(2*Nnodes)
    U[free]=spsolve(K.tocsr()[free,:][:,free], F[free])
    elem_stress=np.zeros((len(elements),3))
    for k,(B,Dm,n1,n2,n3) in enumerate(elem_data):
        ue=np.array([U[2*n1],U[2*n1+1],U[2*n2],U[2*n2+1],U[2*n3],U[2*n3+1]])
        elem_stress[k]=Dm@(B@ue)
    sigma_x=np.zeros(Nnodes); sigma_z=np.zeros(Nnodes); tau_xz=np.zeros(Nnodes); count=np.zeros(Nnodes)
    for k,(_,_,n1,n2,n3) in enumerate(elem_data):
        for n in (n1,n2,n3):
            sigma_x[n]+=elem_stress[k,0]; sigma_z[n]+=elem_stress[k,1]; tau_xz[n]+=elem_stress[k,2]; count[n]+=1
    sigma_x/=count; sigma_z/=count; tau_xz/=count
    sigma_x=-sigma_x; sigma_z=-sigma_z; tau_xz=-tau_xz
    sigma_zo=0.5*(sigma_z-sigma_x)
    return dict(nodes=nodes, NX=NX, NZ=NZ, x_nodes=x_nodes, z_nodes=z_nodes, sigma_zo=sigma_zo)


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

res = run_fea_custom(nx=480, nz=240)
Xg,Zg = np.meshgrid(res['x_nodes'], res['z_nodes'])
V = res['sigma_zo'].reshape((res['NZ'], res['NX']))
# crop region
x_min,x_max=-3,3; z_min,z_max=0,3
xi=np.where((res['x_nodes']>=x_min)&(res['x_nodes']<=x_max))[0]
zi=np.where((res['z_nodes']>=z_min)&(res['z_nodes']<=z_max))[0]
X=Xg[np.ix_(zi,xi)]; Z=Zg[np.ix_(zi,xi)]; Vc=V[np.ix_(zi,xi)]
levels=[-0.2,-0.1,-0.05,0,0.05,0.1,0.2,0.3,0.4]
width,height=1400,1000; pad_l,pad_r,pad_t,pad_b=100,180,50,100
pw=width-pad_l-pad_r; ph=height-pad_t-pad_b
sx=lambda x: pad_l + (x-x_min)/(x_max-x_min)*pw
sy=lambda z: pad_t + (z-z_min)/(z_max-z_min)*ph
img=Image.new('RGB',(width,height),'white'); d=ImageDraw.Draw(img); font=load_font(24)
d.rectangle([pad_l,pad_t,pad_l+pw,pad_t+ph], outline='black', width=2)
for x in range(-3,4):
    xx=sx(x); d.line([xx,pad_t+ph,xx,pad_t+ph+10], fill='black'); d.text((xx-8,pad_t+ph+14), str(x), fill='black', font=font)
for z in range(0,4):
    yy=sy(z); d.line([pad_l-10,yy,pad_l,yy], fill='black'); d.text((pad_l-32,yy-10), str(z), fill='black', font=font)
d.text((pad_l+pw/2-25,height-40),'x / a',fill='black',font=font)
d.text((25,pad_t+ph/2),'z / a',fill='black',font=font)
# draw actual load shape on top
pts=[]
for x in np.linspace(xn[0], xn[-1], 200):
    pts.append((sx(x), sy(0)+35 - 80*q_of_x(x)))
d.line(pts, fill='black', width=2)
d.line([sx(xn[0]), sy(0), sx(xn[-1]), sy(0)], fill='black', width=1)
for lev in levels:
    w=3 if abs(lev)<1e-12 else 1
    for a1,b1 in contour_segments(X,Z,Vc,lev):
        d.line([sx(a1[0]),sy(a1[1]),sx(b1[0]),sy(b1[1])], fill='black', width=w)
# report some values
sample_pts=[(0,0.5),(0,1.0),(1.0,0.5),(1.5,1.5)]
vals=[]
for x,z in sample_pts:
    # quick bilinear from nearest nodes for reporting
    vals.append((x,z))
out=Path('/Users/iratnere/.openclaw/workspace/homogeneous_33L32FI34.png')
img.save(out)
print('WIN used:', WIN.name)
print('x knots normalized:', ' '.join(f'{v:.4f}' for v in xn))
print('q knots normalized:', ' '.join(f'{v:.4f}' for v in qn))
print(out)
