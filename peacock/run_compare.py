"""
For each of P1..P4 print sigma_zo from:
  (a) homogeneous half-plane (E2 = E1)
  (b) layered with E2/E1 = 100
to show which point flips sign due to layering.
"""

import sys
sys.path.insert(0, '/Users/iratnere/dev/coyote-math/peacock')
from peacock_fea import run_fea, value_at


POINTS = {
    "P1": (0.00, 0.50),
    "P2": (0.95, 0.25),
    "P3": (0.00, 1.50),
    "P4": (1.50, 0.50),
}


def main():
    L, D, nx, nz = 15.0, 15.0, 480, 240
    print("=== Homogeneous (E2=E1) ===")
    res_h = run_fea(E1=1.0, E2=1.0, nu=0.3, h=1.0, a=1.0,
                    L=L, D=D, nx=nx, nz=nz, p0=1.0, verbose=False)
    print("=== Layered (E2/E1 = 100) ===")
    res_l = run_fea(E1=1.0, E2=100.0, nu=0.3, h=1.0, a=1.0,
                    L=L, D=D, nx=nx, nz=nz, p0=1.0, verbose=False)

    print()
    print(f"{'point':6s} {'(x, z)':14s} {'σ_zo/p0 hom':>12s} {'σ_zo/p0 lay':>12s} {'Δ (lay−hom)':>14s}  sign-flip?")
    for name, (x, z) in POINTS.items():
        v_h = value_at(res_h, x, z)
        v_l = value_at(res_l, x, z)
        diff = v_l - v_h
        flipped = "YES" if (v_h * v_l) < 0 else "no"
        print(f"{name:6s} ({x:.2f}, {z:.2f})  {v_h:+12.5f} {v_l:+12.5f} {diff:+14.5f}  {flipped}")


if __name__ == '__main__':
    main()
