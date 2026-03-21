# WIP: Weighted Clebsch-Gordan Sum — Complexity Problem (v2, tightened)

## Problem Statement

Let $\langle j_1, m_1; j_2, m_2 | J, M \rangle$ denote the Clebsch-Gordan coefficients for coupling angular momenta $j_1$ and $j_2$ to total angular momentum $J$ with projection $M = m_1 + m_2$. For admissible quantum numbers, the completeness relation gives

$$\sum_{m_1} |\langle j_1, m_1; j_2, M - m_1 | J, M \rangle|^2 = 1.$$

For fixed $j_1, j_2 \geq 1$ and admissible $J, M$, define

$$\mathcal{M}(j_1, j_2, J, M) = \sum_{m_1 = -j_1}^{j_1} m_1 \, |\langle j_1, m_1; j_2, M - m_1 | J, M \rangle|^2.$$

The CG symmetry $\langle j_1, -m_1; j_2, -m_2 | J, -M \rangle = (-1)^{j_1+j_2-J} \langle j_1, m_1; j_2, m_2 | J, M \rangle$ implies $|\langle j_1, -m_1; j_2, m_1 - M | J, -M \rangle|^2 = |\langle j_1, m_1; j_2, M - m_1 | J, M \rangle|^2$. Substituting $m_1 \to -m_1$ in the sum gives $\mathcal{M}(j_1, j_2, J, M) = -\mathcal{M}(j_1, j_2, J, -M)$.

Claim: For all $j_1, j_2 \geq 1$, all admissible $J$, and all $M$,

$$\mathcal{M}(j_1, j_2, J, M) = 0.$$

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

---

## Solution

**The claim is False.**

The antisymmetry $\mathcal{M}(M) = -\mathcal{M}(-M)$ forces $\mathcal{M} = 0$ when $M = 0$, but not for $M \neq 0$.

Counterexample: $j_1 = j_2 = 1$, $J = 1$, $M = 1$. The selection rule $m_1 + m_2 = 1$ with $|m_1| \leq 1$, $|m_2| \leq 1$ gives $(m_1, m_2) \in \{(0,1), (1,0)\}$. By completeness both squared coefficients sum to 1, and by the exchange symmetry $\langle 1,0;1,1|1,1\rangle = -\langle 1,1;1,0|1,1\rangle$, both equal $1/2$. Therefore $\mathcal{M} = 0 \cdot \frac{1}{2} + 1 \cdot \frac{1}{2} = \frac{1}{2} \neq 0$. $\blacksquare$

---

## Complexity Analysis

**Three interacting components:**
1. CG completeness — correct
2. CG antisymmetry $\mathcal{M}(M) = -\mathcal{M}(-M)$ — correct
3. "For all $M$" quantifier — FALSE (only forces $\mathcal{M} = 0$ when $M = 0$)

The error lives in the interaction: antisymmetry relates $M$ and $-M$, but only collapses to zero when $M = -M$, i.e., $M = 0$. Models that accept the symmetry argument as proving the general case miss this.
