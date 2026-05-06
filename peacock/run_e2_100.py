"""
Re-run peacock_fea with E2/E1 = 100 (matches the submitted Peacock prompt)
and read off sigma_zo at the four points P1..P4 with mesh-convergence study.
"""

import sys
import numpy as np

sys.path.insert(0, '/Users/iratnere/dev/coyote-math/peacock')
from peacock_fea import run_fea, value_at


POINTS = {
    "P1": (0.00, 0.50),    # (0, a/2)
    "P2": (0.95, 0.25),    # (0.95a, a/4)
    "P3": (0.00, 1.50),    # (0, 3a/2)
    "P4": (1.50, 0.50),    # (3a/2, a/2)
}


def report(label, res):
    print(f"--- {label} ---")
    for name, (x, z) in POINTS.items():
        szo = value_at(res, x, z)
        sx  = value_at(res, x, z, 'sigma_x')
        sz  = value_at(res, x, z, 'sigma_z')
        sign = '+' if szo > 0 else ('-' if szo < 0 else '0')
        print(f"  {name} = ({x:.2f}, {z:.2f}): sigma_zo/p0 = {szo:+.5f}  sign={sign}   "
              f"(sigma_x={sx:+.4f}, sigma_z={sz:+.4f})")
    print()


def main():
    L, D = 15.0, 15.0
    print("=== Validation (homogeneous, E2=E1=1) ===")
    res_h = run_fea(E1=1.0, E2=1.0, nu=0.3, h=1.0, a=1.0,
                    L=L, D=D, nx=240, nz=120, p0=1.0, verbose=False)
    v0a = value_at(res_h, 0.0, 1.0)
    print(f"FEA homogeneous sigma_zo/p0 at (0, a) = {v0a:+.5f}")
    print(f"Analytic (4 - pi)/pi               = {(4 - np.pi)/np.pi:+.5f}")
    print()

    print("=== Layered E2/E1 = 100, mesh convergence ===")
    for nx in (480, 640, 800):
        nz = nx // 2
        print(f"Mesh nx={nx}, nz={nz}:")
        res = run_fea(E1=1.0, E2=100.0, nu=0.3, h=1.0, a=1.0,
                      L=L, D=D, nx=nx, nz=nz, p0=1.0, verbose=False)
        report(f"E2/E1=100, nx={nx}", res)


if __name__ == '__main__':
    main()
