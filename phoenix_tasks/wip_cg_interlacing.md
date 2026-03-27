# WIP: CG Zero Interlacing Under j₃ Shift

## Problem Statement

Let $j_1, j_2 \geq 3$ be fixed integers and $m_3$ a fixed integer with $|m_3| \leq j_1+j_2-2$. For admissible $j_3$ with $|j_1-j_2| \leq j_3 \leq j_1+j_2$ and $|m_3| \leq j_3$, the Clebsch–Gordan coefficient

$$C(x) = \langle j_1, j_1-x;\, j_2, m_3-j_1+x \mid j_3, m_3 \rangle$$

is a dual Hahn polynomial of degree $N = \min(j_1,j_2)$ in the discrete variable $x = j_1-m_1 \in \{0, 1, \ldots, j_1+j_2-j_3\}$, with $N$ simple zeros in the interior of the support.

Denote these zeros by $0 < z_1(j_3) < \cdots < z_N(j_3) < j_1+j_2-j_3$.

**Claim:** For all admissible $j_3$ with $|j_1-j_2| \leq j_3 < j_1+j_2$, the zeros interlace under $j_3 \to j_3+1$:

$$z_k(j_3+1) < z_k(j_3) < z_{k+1}(j_3+1), \qquad k = 1, \ldots, N-1.$$

Determine whether this claim is True or False, and give a rigorous proof.

---

## Design Notes

**Trap mechanism:** Classical interlacing holds for orthogonal polynomials of successive *degrees* on a fixed lattice. Here, $j_3 \to j_3+1$ does NOT change the degree $N$ — it changes the lattice endpoint and weight function simultaneously. Interlacing is not guaranteed under lattice+weight deformation.

**Originality scoring:**
- Audit Novelty → **High**: must distinguish degree-interlacing (guaranteed) from parameter-shift interlacing (not guaranteed)
- Disproof Resistance → **High**: computing dual Hahn zeros at adjacent $j_3$ is non-trivial; small cases may accidentally interlace
- Camouflage → **High**: CG = dual Hahn is correct; interlacing is THE canonical OP property; surface math invites True

**Q1-Q4:**
- Q1: Model sees CG = dual Hahn, recalls interlacing → True
- Q2: Reveals falsity? → NO (recalled theorem confirms, but for wrong parameter)
- Q3: Natural path confirms claim? → YES
- Q4: Must realize j₃-shift ≠ degree increase; find counterexample at moderate j

**Short-circuit:** Mode A — zeros require polynomial root-finding, not spot-check. Mode B — recall confirms (wrong theorem). Mode C — no one-step disproof. Mode D — no bypass.

**Answer: UNKNOWN — submit and see if models disagree.**
