"""
Plane-strain FEA per Igor Ratnere's dissertation, section 3.
Linear-triangle elements, two material zones, parabolic strip load on saturated soil.
After solving for total stresses, applies eq 22: sigma_zo = (sigma_z* - sigma_x*)/2.

Goal: read off signs of sigma_zo at four candidate points for the Peacock
sign-count question.
"""

import numpy as np
from scipy.sparse import lil_matrix, csr_matrix
from scipy.sparse.linalg import spsolve


# Geometry: x in [-L, L], z in [0, D].  Upper layer 0 < z < h, lower layer z > h.
# Contact half-width a; layer thickness h=a; load q(x) = p0 (1 - x^2/a^2) on |x|<a.
def run_fea(E1=1.0, E2=4.0, nu=0.3, h=1.0, a=1.0, L=8.0, D=8.0,
            nx=160, nz=80, p0=1.0, verbose=True):
    """
    Returns dict with nodes, sigma_x, sigma_z, tau_xz, sigma_zo at all nodes.
    nx, nz: number of cells along x, z (each cell -> 2 triangles).
    Domain: x in [-L, L], z in [0, D].  Surface at z=0, depth grows downward.
    """
    # -- Mesh --
    x_nodes = np.linspace(-L, L, nx + 1)
    z_nodes = np.linspace(0.0, D, nz + 1)
    NX = nx + 1
    NZ = nz + 1
    Nnodes = NX * NZ

    def nid(i, j):  # i in [0, nx], j in [0, nz]
        return j * NX + i

    nodes = np.zeros((Nnodes, 2))
    for j in range(NZ):
        for i in range(NX):
            nodes[nid(i, j)] = (x_nodes[i], z_nodes[j])

    # -- Elements (each rectangle split into 2 triangles, "/" diagonal) --
    elements = []  # list of (n1, n2, n3, E)
    for j in range(nz):
        for i in range(nx):
            n00 = nid(i, j)
            n10 = nid(i + 1, j)
            n01 = nid(i, j + 1)
            n11 = nid(i + 1, j + 1)
            # Element midpoint depth
            zmid = 0.5 * (z_nodes[j] + z_nodes[j + 1])
            E = E1 if zmid < h else E2
            # Triangle 1: n00 -> n10 -> n11 (lower-right)
            elements.append((n00, n10, n11, E))
            # Triangle 2: n00 -> n11 -> n01 (upper-left)
            elements.append((n00, n11, n01, E))

    if verbose:
        print(f"Mesh: {Nnodes} nodes, {len(elements)} triangles")

    # -- Plane-strain D matrix --
    def D_matrix(E, nu):
        c = E / ((1 + nu) * (1 - 2 * nu))
        D = np.array([
            [c * (1 - nu), c * nu, 0.0],
            [c * nu, c * (1 - nu), 0.0],
            [0.0, 0.0, c * (1 - 2 * nu) / 2],
        ])
        return D

    # -- Element stiffness for linear triangle (CST), plane strain --
    def element_K_B(coords, E, nu):
        # coords: 3x2 array of (x, z)
        x1, z1 = coords[0]
        x2, z2 = coords[1]
        x3, z3 = coords[2]
        A = 0.5 * abs(
            (x2 - x1) * (z3 - z1) - (x3 - x1) * (z2 - z1)
        )
        # B matrix: relates strain to nodal displacements (u1, w1, u2, w2, u3, w3)
        b1 = z2 - z3
        b2 = z3 - z1
        b3 = z1 - z2
        c1 = x3 - x2
        c2 = x1 - x3
        c3 = x2 - x1
        B = (1.0 / (2 * A)) * np.array([
            [b1, 0, b2, 0, b3, 0],
            [0, c1, 0, c2, 0, c3],
            [c1, b1, c2, b2, c3, b3],
        ])
        D = D_matrix(E, nu)
        K = A * B.T @ D @ B  # plane strain, unit thickness
        return K, B, D

    # -- Assemble global stiffness --
    K = lil_matrix((2 * Nnodes, 2 * Nnodes))
    elem_data = []  # cache (B, D) per element for stress recovery
    for (n1, n2, n3, E) in elements:
        coords = nodes[[n1, n2, n3]]
        Ke, B, D = element_K_B(coords, E, nu)
        elem_data.append((B, D, n1, n2, n3))
        dofs = [2*n1, 2*n1+1, 2*n2, 2*n2+1, 2*n3, 2*n3+1]
        for a_idx in range(6):
            for b_idx in range(6):
                K[dofs[a_idx], dofs[b_idx]] += Ke[a_idx, b_idx]

    # -- Load vector: parabolic vertical traction q(x) on top edge, |x|<a --
    # For a top-edge segment between nodes i and i+1 at z=0, with linear pressure
    # interpolation, the consistent nodal load on dof_z is:
    # F_zi   = (length/6) * (2 q_i + q_{i+1})
    # F_zi+1 = (length/6) * (q_i + 2 q_{i+1})
    F = np.zeros(2 * Nnodes)
    def q_of_x(x):
        if abs(x) <= a:
            return p0 * (1.0 - (x / a) ** 2)
        return 0.0
    for i in range(nx):
        n_left = nid(i, 0)
        n_right = nid(i + 1, 0)
        x_left = nodes[n_left, 0]
        x_right = nodes[n_right, 0]
        q_left = q_of_x(x_left)
        q_right = q_of_x(x_right)
        Lseg = x_right - x_left
        # Sign convention: applied pressure pushes DOWN, +z direction (z grows downward).
        # So the traction is +q in z, contributes +F to the z dof.
        F[2 * n_left + 1] += (Lseg / 6.0) * (2 * q_left + q_right)
        F[2 * n_right + 1] += (Lseg / 6.0) * (q_left + 2 * q_right)

    # -- Boundary conditions --
    # Sides x = +/- L: u_x = 0 and u_z = 0 (clamped).
    # Bottom z = D: u_x = 0 and u_z = 0 (clamped).
    # Top z = 0: free (only the applied surface traction; no displacement constraint).
    fixed_dofs = set()
    for j in range(NZ):
        n_left = nid(0, j)
        n_right = nid(nx, j)
        fixed_dofs.add(2 * n_left)
        fixed_dofs.add(2 * n_left + 1)
        fixed_dofs.add(2 * n_right)
        fixed_dofs.add(2 * n_right + 1)
    for i in range(NX):
        n_bot = nid(i, nz)
        fixed_dofs.add(2 * n_bot)
        fixed_dofs.add(2 * n_bot + 1)
    fixed_dofs = sorted(fixed_dofs)

    all_dofs = np.arange(2 * Nnodes)
    free_dofs = np.setdiff1d(all_dofs, fixed_dofs)

    # -- Solve K_ff U_f = F_f --
    K_csr = K.tocsr()
    K_ff = K_csr[free_dofs, :][:, free_dofs]
    F_f = F[free_dofs]
    U_f = spsolve(K_ff, F_f)
    U = np.zeros(2 * Nnodes)
    U[free_dofs] = U_f

    # -- Recover element stresses, then average to nodes --
    elem_stress = np.zeros((len(elements), 3))  # (sigma_x, sigma_z, tau_xz)
    for k, (B, Dmat, n1, n2, n3) in enumerate(elem_data):
        u_e = np.array([U[2*n1], U[2*n1+1], U[2*n2], U[2*n2+1], U[2*n3], U[2*n3+1]])
        eps = B @ u_e
        sig = Dmat @ eps
        elem_stress[k] = sig

    # Node averaging
    sigma_x = np.zeros(Nnodes)
    sigma_z = np.zeros(Nnodes)
    tau_xz = np.zeros(Nnodes)
    count = np.zeros(Nnodes)
    for k, (B, Dmat, n1, n2, n3) in enumerate(elem_data):
        for n in (n1, n2, n3):
            sigma_x[n] += elem_stress[k, 0]
            sigma_z[n] += elem_stress[k, 1]
            tau_xz[n] += elem_stress[k, 2]
            count[n] += 1
    count[count == 0] = 1
    sigma_x /= count
    sigma_z /= count
    tau_xz /= count

    # Sign convention: FEA above is tension-positive.
    # Dissertation uses compression-positive (sigma_zo > 0 means compressive
    # vertical effective stress in the skeleton).  Flip to that convention:
    sigma_x = -sigma_x
    sigma_z = -sigma_z
    tau_xz = -tau_xz

    elem_sigma_x = -elem_stress[:, 0]
    elem_sigma_z = -elem_stress[:, 1]
    elem_tau_xz = -elem_stress[:, 2]

    # Eq 22: initial effective stresses (saturated, t=0+) in compression-positive convention
    sigma_zo = 0.5 * (sigma_z - sigma_x)
    sigma_xo = -sigma_zo
    tau_xzo = tau_xz

    elem_sigma_zo = 0.5 * (elem_sigma_z - elem_sigma_x)
    elem_sigma_xo = -elem_sigma_zo
    elem_tau_xzo = elem_tau_xz

    return dict(
        nodes=nodes, NX=NX, NZ=NZ, x_nodes=x_nodes, z_nodes=z_nodes,
        sigma_x=sigma_x, sigma_z=sigma_z, tau_xz=tau_xz,
        sigma_zo=sigma_zo, sigma_xo=sigma_xo, tau_xzo=tau_xzo,
        elements=elements,
        elem_sigma_x=elem_sigma_x, elem_sigma_z=elem_sigma_z, elem_tau_xz=elem_tau_xz,
        elem_sigma_zo=elem_sigma_zo, elem_sigma_xo=elem_sigma_xo, elem_tau_xzo=elem_tau_xzo,
        U=U,
    )


def _cell_coords(result, x, z):
    x_nodes = result['x_nodes']
    z_nodes = result['z_nodes']
    NX = result['NX']
    i = int(np.searchsorted(x_nodes, x) - 1)
    j = int(np.searchsorted(z_nodes, z) - 1)
    i = max(0, min(NX - 2, i))
    j = max(0, min(len(z_nodes) - 2, j))
    x0, x1 = x_nodes[i], x_nodes[i + 1]
    z0, z1 = z_nodes[j], z_nodes[j + 1]
    fx = (x - x0) / (x1 - x0)
    fz = (z - z0) / (z1 - z0)
    return i, j, fx, fz


def value_at(result, x, z, field='sigma_zo'):
    """Bilinear interpolation of nodal field at (x, z)."""
    NX = result['NX']
    arr = result[field]
    i, j, fx, fz = _cell_coords(result, x, z)
    n00 = j * NX + i
    n10 = j * NX + i + 1
    n01 = (j + 1) * NX + i
    n11 = (j + 1) * NX + i + 1
    return (
        (1 - fx) * (1 - fz) * arr[n00]
        + fx * (1 - fz) * arr[n10]
        + (1 - fx) * fz * arr[n01]
        + fx * fz * arr[n11]
    )


def element_value_at(result, x, z, field='elem_sigma_zo'):
    """Piecewise-constant element value at (x, z) using the containing CST triangle."""
    NX = result['NX']
    nz = result['NZ'] - 1
    i, j, fx, fz = _cell_coords(result, x, z)
    j = max(0, min(nz - 1, j))
    cell_index = j * (NX - 1) + i
    tri_in_cell = 0 if fz <= fx else 1
    elem_index = 2 * cell_index + tri_in_cell
    return result[field][elem_index]


if __name__ == '__main__':
    # Bigger domain (L=15, D=15) to push clamped BCs far from points of interest
    L, D = 15.0, 15.0
    nx, nz = 240, 120  # cell size ~0.125 in x, ~0.125 in z

    print(f"=== Validation: homogeneous (E1=E2=1), L={L}, D={D}, nx={nx}, nz={nz} ===")
    print(f"Analytic at (0, 1.0): (4 - pi)/pi = {(4 - np.pi)/np.pi:.4f}")
    print(f"Analytic at (0, 0.5): 0.284 (computed earlier)")
    print()
    res_h = run_fea(E1=1.0, E2=1.0, nu=0.3, h=1.0, a=1.0,
                    L=L, D=D, nx=nx, nz=nz, p0=1.0)
    print(f"FEA homogeneous: sigma_zo/p0 at (0, 0.5) = {value_at(res_h, 0.0, 0.5):+.4f}")
    print(f"FEA homogeneous: sigma_zo/p0 at (0, 1.0) = {value_at(res_h, 0.0, 1.0):+.4f}")
    print(f"FEA homogeneous: sigma_zo/p0 at (0, 2.0) = {value_at(res_h, 0.0, 2.0):+.4f}")
    print()

    print("=== Layered (E1=1, E2=4), candidate setup ===")
    res = run_fea(E1=1.0, E2=4.0, nu=0.3, h=1.0, a=1.0,
                  L=L, D=D, nx=nx, nz=nz, p0=1.0)
    # Scan many points to find ROBUST sign configurations
    print()
    print("Scan along z=0.5:")
    for x in [0.0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0]:
        szo = value_at(res, x, 0.5)
        print(f"  ({x:.1f}, 0.5): sigma_zo/p0 = {szo:+.4f}")
    print()
    print("Scan along x=0:")
    for z in [0.25, 0.5, 0.75, 0.99, 1.01, 1.5, 2.0, 3.0]:
        szo = value_at(res, 0.0, z)
        print(f"  (0, {z:.2f}): sigma_zo/p0 = {szo:+.4f}")
    print()
    print("Scan along x=2 (outside contact):")
    for z in [0.25, 0.5, 1.0, 1.5, 2.0, 3.0]:
        szo = value_at(res, 2.0, z)
        print(f"  (2.0, {z:.2f}): sigma_zo/p0 = {szo:+.4f}")
    print()
    # Map: find sign-change boundary and robust regions
    print("Layered (E2/E1=4) full grid scan:")
    xs = [0.0, 0.5, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0]
    print("       " + "  ".join(f"x={x:>5.2f}" for x in xs))
    for z in [0.1, 0.25, 0.5, 0.75, 0.99, 1.01, 1.5, 2.0, 3.0]:
        row = f"z={z:>5.2f} "
        for x in xs:
            v = value_at(res, x, z)
            row += f" {v:+7.3f}"
        print(row)
    print()
    print("Homogeneous full grid scan (for comparison):")
    print("       " + "  ".join(f"x={x:>5.2f}" for x in xs))
    for z in [0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0]:
        row = f"z={z:>5.2f} "
        for x in xs:
            v = value_at(res_h, x, z)
            row += f" {v:+7.3f}"
        print(row)
    print()
    print("Differences (layered - homogeneous):")
    print("       " + "  ".join(f"x={x:>5.2f}" for x in xs))
    for z in [0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0]:
        row = f"z={z:>5.2f} "
        for x in xs:
            v_l = value_at(res, x, z)
            v_h = value_at(res_h, x, z)
            row += f" {v_l-v_h:+7.3f}"
        print(row)
