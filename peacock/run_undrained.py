"""
Round 3 cross-check:
1. Re-run peacock_fea with nu = 0.499 (incompressible-mixture surrogate)
   for both layers, E_2/E_1 = 100, mesh-convergence study.
2. Verify analytic homogeneous quadrature at P2 = (0.95, 0.25) and P4
   to settle the GPT vs. session-log discrepancy.
"""

import sys
import numpy as np
from scipy.integrate import quad

sys.path.insert(0, '/Users/iratnere/dev/coyote-math/peacock')
from peacock_fea import run_fea, value_at


POINTS = {
    "P1": (0.00, 0.50),
    "P2": (0.95, 0.25),
    "P3": (0.00, 1.50),
    "P4": (1.50, 0.50),
}


def homogeneous_sigma_zo_per_p0(x, z, a=1.0):
    """sigma_zo / p_0 at (x, z) for the homogeneous half-plane under
       q(xi) = p_0 (1 - xi^2/a^2) on |xi| <= a, plane strain.
       Uses sigma_zo = (sigma_z - sigma_x)/2 with the kernel from Step 6.
    """
    def integrand(xi):
        denom = ((x - xi)**2 + z**2)**2
        return (1.0 - xi**2/a**2) * (z**2 - (x - xi)**2) / denom
    val, err = quad(integrand, -a, a, limit=200)
    return (z / np.pi) * val


def main():
    print("=== HOMOGENEOUS analytic quadrature (Simpson via scipy.quad) ===")
    for name, (x, z) in POINTS.items():
        v = homogeneous_sigma_zo_per_p0(x, z)
        print(f"  {name} = ({x:.2f}, {z:.2f}): sigma_zo^hom/p_0 = {v:+.5f}")
    # closed-form check at (0, a)
    val_0a = homogeneous_sigma_zo_per_p0(0.0, 1.0)
    val_4mp_p = (4 - np.pi) / np.pi
    print(f"  (0, 1.0):  quad = {val_0a:+.5f}  vs  (4-pi)/pi = {val_4mp_p:+.5f}")
    print()

    print("=== LAYERED FEA, nu = 0.499, E_2/E_1 = 100, mesh convergence ===")
    L, D = 15.0, 15.0
    for nx in (240, 480, 800):
        nz = nx // 2
        res = run_fea(E1=1.0, E2=100.0, nu=0.499, h=1.0, a=1.0,
                      L=L, D=D, nx=nx, nz=nz, p0=1.0, verbose=False)
        print(f"--- nu=0.499, nx={nx}, nz={nz} ---")
        for name, (x, z) in POINTS.items():
            v = value_at(res, x, z)
            sx = value_at(res, x, z, 'sigma_x')
            sz = value_at(res, x, z, 'sigma_z')
            sign = '+' if v > 0 else ('-' if v < 0 else '0')
            print(f"  {name} = ({x:.2f}, {z:.2f}): sigma_zo/p0 = {v:+.5f}  sign={sign}  (sigma_x={sx:+.4f}, sigma_z={sz:+.4f})")
        print()

    print("=== HOMOGENEOUS limit at nu = 0.499 (should be nu-independent ⇒ same as nu=0.3) ===")
    res_h = run_fea(E1=1.0, E2=1.0, nu=0.499, h=1.0, a=1.0,
                    L=L, D=D, nx=480, nz=240, p0=1.0, verbose=False)
    v0a = value_at(res_h, 0.0, 1.0)
    print(f"FEM nu=0.499 homogeneous sigma_zo/p_0 at (0, 1.0) = {v0a:+.5f}")
    print(f"Closed form (4-pi)/pi                              = {val_4mp_p:+.5f}")
    print(f"Relative error                                     = {abs(v0a - val_4mp_p)/val_4mp_p*100:.2f}%")


if __name__ == '__main__':
    main()
