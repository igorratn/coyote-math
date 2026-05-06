# Kelvin Wronskian — Peacock Draft v2

**Source problem:** f09a765d (coyote-math Phoenix library)
**Status:** Draft — not yet submitted
**TRIZ type:** RECALL (model recalls wrong-sign formula) + ANALOGY (applies Bessel Wronskian to wrong argument pair)

---

## Prompt

The Kelvin functions of order zero are defined by

$$\operatorname{ber}(x) + i\,\operatorname{bei}(x) = J_0\!\left(x\,e^{3\pi i/4}\right), \qquad \operatorname{ker}(x) + i\,\operatorname{kei}(x) = K_0\!\left(x\,e^{\pi i/4}\right), \quad x > 0,$$

where $J_0$ is the Bessel function of the first kind and $K_0$ is the modified Bessel function of the second kind.

Define the two real Wronskian-like combinations

$$W_1(x) = \operatorname{ber}(x)\operatorname{ker}'(x) - \operatorname{ber}'(x)\operatorname{ker}(x), \qquad W_2(x) = \operatorname{bei}(x)\operatorname{kei}'(x) - \operatorname{bei}'(x)\operatorname{kei}(x),$$

where primes denote derivatives with respect to $x$.

Using Wronskian identities for Bessel-type equations, derive the exact integer value of

$$c = x\!\left[W_1(x) - W_2(x)\right]$$

for all $x > 0$. Report your answer as an integer.

---

## Correct Answer

$$c = -1$$

---

## Golden Solution

**Step 1: Identify the structure.**

Set $f(x) = \operatorname{ber}(x) + i\,\operatorname{bei}(x)$ and $g(x) = \operatorname{ker}(x) + i\,\operatorname{kei}(x)$. Expanding the complex Wronskian $fg' - f'g$ directly:

$$\operatorname{Re}[fg' - f'g] = (\operatorname{ber}\operatorname{ker}' - \operatorname{ber}'\operatorname{ker}) - (\operatorname{bei}\operatorname{kei}' - \operatorname{bei}'\operatorname{kei}) = W_1 - W_2.$$

So it suffices to evaluate $\operatorname{Re}[fg' - f'g]$.

**Step 2: Reduce both functions to the same complex argument.**

Set $z = xe^{\pi i/4}$. Then $xe^{3\pi i/4} = xe^{\pi i/4}\cdot e^{\pi i/2} = iz$. Applying the connection formula $J_0(iz) = I_0(z)$ (DLMF 10.27.6):

$$f(x) = J_0(xe^{3\pi i/4}) = J_0(iz) = I_0(z).$$

And directly from the definition:

$$g(x) = K_0(xe^{\pi i/4}) = K_0(z).$$

Both $f$ and $g$ are now expressed as standard modified Bessel functions of the **same** argument $z = xe^{\pi i/4}$.

**Step 3: Apply the chain rule and the modified Bessel Wronskian.**

Since $dz/dx = e^{\pi i/4}$:

$$fg' - f'g = \frac{d}{dx}\bigl[I_0(z)\bigr] \cdot K_0(z) \;\text{term...} = e^{\pi i/4}\bigl[I_0(z)K_0'(z) - I_0'(z)K_0(z)\bigr].$$

The standard Wronskian identity for modified Bessel functions (DLMF 10.28.2) gives:

$$I_0(z)K_0'(z) - I_0'(z)K_0(z) = -\frac{1}{z}.$$

Therefore:

$$fg' - f'g = e^{\pi i/4}\cdot\left(-\frac{1}{z}\right) = e^{\pi i/4}\cdot\left(-\frac{1}{xe^{\pi i/4}}\right) = -\frac{1}{x}.$$

**Step 4: Extract the real part.**

Since $-1/x$ is real:

$$W_1(x) - W_2(x) = \operatorname{Re}\!\left[-\frac{1}{x}\right] = -\frac{1}{x},$$

and therefore

$$c = x\!\left[W_1(x) - W_2(x)\right] = -1.$$

**Final Answer: $-1$**

---

## Predicted Failure Mode

**Expected wrong answer:** $c = +1$

**Mechanism:** The model applies the modified Bessel Wronskian correctly in most steps but makes a sign error at Step 4, computing $ie^{3\pi i/4} = +e^{\pi i/4}$ instead of $-e^{\pi i/4}$.

This gives:

$$fg' - f'g = +e^{\pi i/4}\cdot\frac{1}{xe^{\pi i/4}} = +\frac{1}{x},$$

leading to $W_1 - W_2 = +1/x$ and $c = +1$.

**Why models make this error:**

1. **Phase arithmetic slip.** Computing $e^{i5\pi/4}$ as $e^{i\pi/4}$ (forgetting the $e^{i\pi}$ factor from crossing $\pi$).
2. **Recall confusion.** Some references state the Kelvin Wronskian as $1/x$ (positive) for a different ordering or convention (e.g., $\ker\,\operatorname{ber}' - \operatorname{ber}\,\ker'$). The model applies the recalled formula to the given ordering and drops the sign reversal.
3. **Convention mismatch.** A subset of references define $\ker+i\kei = K_0(xe^{3\pi i/4})$ (using $e^{3\pi i/4}$ for both pairs). Under that convention, $z_1 = z_2$ and the $I_\nu \to J_\nu$ conversion is unnecessary — the Wronskian applies directly at the same argument, but with a different phase factor. A model trained on that convention applied to the problem's convention ($z_1 \neq z_2$) will get the sign wrong.

**Why this is a genuine reasoning failure (not a computation slip):**

The error is conceptual: the model fails to correctly track the complex-argument phase transformation when converting $J_\nu(iz) \to I_\nu(z)$ under the chain rule. The resulting wrong sign is fully consistent with a plausible but incorrect application of the Wronskian theorem. A model that gets $+1$ has executed a coherent but wrong analytical argument, not merely a numerical slip.

---

## References

1. **DLMF 10.27.6** — Connection formula $J_\nu(iz) = e^{i\nu\pi/2}I_\nu(z)$.
   URL: https://dlmf.nist.gov/10.27#E6
   Required to solve: True

2. **DLMF 10.28.2** — Modified Bessel Wronskian $I_0(z)K_0'(z) - I_0'(z)K_0(z) = -1/z$.
   URL: https://dlmf.nist.gov/10.28#E2
   Required to solve: True

3. **DLMF 10.61** — Kelvin function definitions and notation.
   URL: https://dlmf.nist.gov/10.61
   Required to solve: False (definitions given in prompt)

4. **Abramowitz & Stegun §9.9** — Kelvin function Wronskian-type identities.
   Publisher page: https://store.doverpublications.com/0486612724.html (Section 9.9, p. 379)
   Required to solve: False

---

## Design Notes

- **No specific x value** — forces analytical derivation, blocks table lookup.
- **Exact integer answer** — satisfies CURVD; $\{-2,-1,0,1,2,\pi/4,...\}$ are all plausible candidates (>6 choices).
- **Physics context:** Kelvin functions govern skin effect in cylindrical conductors (electromagnetic induction); the Wronskian combination controls the power dissipation normalization. Graduate electrodynamics level.
- **Graduate level:** Requires DLMF-level manipulation of modified Bessel functions — not in standard Jackson or Griffiths.
- **Reasoning types:** Deductive (Wronskian theorem application) + Abstract (complex-argument function manipulation).
