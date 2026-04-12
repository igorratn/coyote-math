# Domain Notes

## Mathematical Physics / Gauge Theory

### Instantons (from task d6b6b1dd)
- **Bogomolny bound:** $S_E \geq \frac{8\pi^2}{g^2}|\nu|$ — Euclidean action bounded below by topological charge
- **Self-duality:** $F_{\mu\nu} = \pm \tilde{F}_{\mu\nu}$ saturates the bound; these are (anti-)instantons
- **BPST instanton:** explicit $\nu=1$ solution, can be written with 't Hooft symbols $\eta_{a\mu\nu}$
- **Tunneling amplitude:** $\langle n+1|e^{-HT}|n\rangle \sim e^{-8\pi^2/g^2}$ — no extra factors
- **Chern-Simons number:** $N_{CS}$ gives winding number for pure gauge configs; instanton interpolates between vacua differing by $\Delta N_{CS} = \pm 1$

### Convention Variations (Both Valid)
- **Hermitian generators:** $\mathrm{Tr}(T^a T^b) = \frac{1}{2}\delta^{ab}$, action has $+\frac{1}{2g^2}$ prefactor
- **Anti-Hermitian generators:** $\mathrm{Tr}(T^a T^b) = -\frac{1}{2}\delta^{ab}$, action has $-\frac{1}{2g^2}$ prefactor
- Both are standard. Different textbooks use different conventions. Not an error — just a choice.

## Commutative Algebra / Gröbner Bases

### Monomial Orders (from task 7e00f967)
- **Monomial order** on $S = k[x_1,\ldots,x_n]$: total order on Mon(S) with (M1) $1 \leq u$ for all monomials, (M2) $u \leq v \Rightarrow uw \leq vw$
- **Divisibility implies order:** If $u | v$ then $v = uw$, so $u = u \cdot 1 \leq u \cdot w = v$ by (M1)+(M2)
- **Well-ordering via Dickson's Lemma:** Any infinite sequence in $\mathbb{N}^n$ has $i < j$ with $\alpha^{(i)} \leq \alpha^{(j)}$ componentwise. Proved by induction on $n$.
- **Consequence:** Monomial orders are well-orders — no infinite strictly decreasing chains.

## Condensed Matter / Superconducting Qubits

### Cooper Pair Box (from task 0f44e912)
- **Hamiltonian:** $\hat{H} = E_C(\hat{n} - n_g)^2 - E_J\cos\hat\varphi$, with $[\hat\varphi, \hat{n}] = i$
- **Charge basis:** $\cos\hat\varphi = \frac{1}{2}\sum_n(|n\rangle\langle n+1| + |n+1\rangle\langle n|)$
- **At $n_g = 1/2$:** states $|0\rangle$, $|1\rangle$ degenerate at $E_C/4$; next states at $9E_C/4$ (gap $2E_C$)
- **For $E_J \ll E_C$:** project onto $\{|0\rangle, |1\rangle\}$ → effective $\frac{E_C}{4}\mathbf{1} - \frac{E_J}{2}\sigma_x$
- **Ground state:** $(|0\rangle + |1\rangle)/\sqrt{2}$ with energy $E_C/4 - E_J/2$
- **Sweet spot:** $\partial E/\partial n_g = 0$ at $n_g = 1/2$ — first-order insensitive to charge noise
- **Second-order correction:** admixture from $|{-1}\rangle, |2\rangle$ has coefficient $E_J/(4E_C)$, NOT $E_J/(8E_C)$

## Competition Mathematics / Inequalities

### SOS Decomposition (from task 189da35a)
- **Problem:** Prove $a^2 + (2-\sqrt{2})b^2 + c^2 \geq \sqrt{2}(ab - bc + ca)$
- **Method:** Complete square in $a$ → $(a - \frac{\sqrt{2}}{2}(b+c))^2$ + remaining $(b,c)$ quadratic
- **Key insight:** Remaining quadratic has discriminant $= t^2 - 2 = 0$ (with $t = \sqrt{2}$), so it's a perfect square
- **Result:** $F = (a - \frac{\sqrt{2}}{2}(b+c))^2 + \frac{1}{2}((\sqrt{2}-1)b + c)^2 \geq 0$
- **Equality:** $(a,b,c) \propto (\sqrt{2}-1, 1, 1-\sqrt{2})$
- **Lesson:** For competition inequalities with irrational coefficients, substituting $t = \sqrt{2}$ and using $t^2 = 2$ simplifies discriminant calculations

## Task Categorization Notes
- Handshake miscategorizes frequently. d6b6b1dd: "Real Analysis" → gauge theory. 7e00f967: "Functional Analysis" → commutative algebra. 0f44e912: "Euclidean Geometry" → superconducting qubits. Content matters more than labels.
