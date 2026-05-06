import math
import numpy as np
from peacock_fea import run_fea, value_at

L = D = 15.0
meshes = [(320,160), (640,320), (960,480)]
results = []
for nx, nz in meshes:
    print(f'Running mesh nx={nx}, nz={nz} ...', flush=True)
    res = run_fea(E1=1.0, E2=100.0, nu=0.3, h=1.0, a=1.0,
                  L=L, D=D, nx=nx, nz=nz, p0=1.0, verbose=False)
    results.append(((nx,nz), res))

# Common sampled region matching plot
xs = np.linspace(-3.0, 3.0, 121)
zs = np.linspace(0.05, 3.0, 60)  # avoid the loaded boundary exactly
pts = [(x,z) for z in zs for x in xs]

vals = []
for (mesh, res) in results:
    arr = np.array([value_at(res, x, z) for x, z in pts])
    vals.append(arr)

u1, u2, u3 = vals

d12 = np.abs(u2 - u1)
d23 = np.abs(u3 - u2)

max12 = float(np.max(d12))
rms12 = float(np.sqrt(np.mean(d12**2)))
max23 = float(np.max(d23))
rms23 = float(np.sqrt(np.mean(d23**2)))

# Observed order using RMS and max where ratio is meaningful
p_rms = math.log(rms12 / rms23, 2) if rms23 > 0 and rms12 > 0 else float('nan')
p_max = math.log(max12 / max23, 2) if max23 > 0 and max12 > 0 else float('nan')

# Richardson-like remaining error estimate on current mesh (u2) using u3-u2 and p_rms
# Treat u3 as finer reference and estimate error in u2 ~ |u3-u2|/(2^p-1)
den = (2**p_rms - 1) if math.isfinite(p_rms) else float('nan')
err_est = d23 / den if den and den > 0 else np.full_like(d23, np.nan)
err_max = float(np.nanmax(err_est))
err_rms = float(np.sqrt(np.nanmean(err_est**2)))

# Also report a few key contour levels' pointwise shifts near label region centerline x>=0 using sampled points
for label, arr in [('320->640', d12), ('640->960', d23)]:
    idx = int(np.argmax(arr))
    x, z = pts[idx]
    print(f'{label} max diff at x={x:.3f}, z={z:.3f}: {arr[idx]:.6f}')

print('--- summary ---')
print(f'RMS diff 320->640: {rms12:.6f}')
print(f'RMS diff 640->960: {rms23:.6f}')
print(f'Max diff 320->640: {max12:.6f}')
print(f'Max diff 640->960: {max23:.6f}')
print(f'Observed order p (RMS): {p_rms:.3f}')
print(f'Observed order p (max): {p_max:.3f}')
print(f'Estimated RMS remaining error on 640 mesh: {err_rms:.6f}')
print(f'Estimated max remaining error on 640 mesh: {err_max:.6f}')

# A few representative points
points = {
    'center shallow': (0.0, 0.5),
    'near edge': (1.0, 0.5),
    'off-center deep': (1.5, 1.5),
    'outer': (2.5, 2.5),
}
for name, (x,z) in points.items():
    vals_pt = [value_at(res, x, z) for _,res in results]
    e = abs(vals_pt[2] - vals_pt[1]) / den if den and den > 0 else float('nan')
    print(f'{name}: 320={vals_pt[0]:+.6f}, 640={vals_pt[1]:+.6f}, 960={vals_pt[2]:+.6f}, est_err_640={e:.6f}')
