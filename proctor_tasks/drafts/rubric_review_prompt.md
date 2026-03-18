## Revised Rubric v2 — All QC Flags Addressed (KaTeX)

---

### Criterion 1 — Weight: 1
**Criterion:** Identify the upper-component Dirac radial equation under spin symmetry with $\ell(\ell+1) = 2$ from $\kappa = -2$, $\ell = 1$
**Description:** The response must set $\kappa = -2 \Rightarrow \ell = 1 \Rightarrow \ell(\ell+1) = 2$, and write the second-order radial equation for the upper Dirac component with centrifugal term $\ell(\ell+1)/r^2 = 2/r^2$ and effective potential $(E+m)\Sigma(r)/(\hbar c)^2$, with eigenvalue $(E^2-m^2)/(\hbar c)^2$.
**Grading Guidance:** Award 1 point if the response sets $\ell = 1$ (either stated explicitly or inferable from a centrifugal term $2/r^2$) and writes a radial equation containing all three of: (a) a centrifugal term $2/r^2$ (with any sign convention and any constant prefactors including $(\hbar c)^2$), (b) a potential term that includes the product $(E+m)\Sigma(r)$ (with any constant prefactors), and (c) an eigenvalue term that includes $E^2 - m^2$ (with any constant prefactors). Award 0 points if $\ell \neq 1$, or if the radial equation is absent, or if one or more of (a)–(c) is missing.

### Criterion 2 — Weight: 1
**Criterion:** Apply the centrifugal approximation $1/r^2 \approx \alpha^2 z/(1-z)^2$ with $z = e^{-\alpha r}$
**Description:** For $\ell \geq 1$, the centrifugal term must be approximated using the exponential variable $z = e^{-\alpha r}$ to make the equation solvable. The accepted form is $1/r^2 \approx \alpha^2 z/(1-z)^2$ or any algebraically equivalent expression in $z$.
**Grading Guidance:** Award 1 point if the response uses $1/r^2 \approx \alpha^2 z/(1-z)^2$ or the equivalent form $\alpha^2 e^{-\alpha r}/(1-e^{-\alpha r})^2$, written in any variable name for the mapping $e^{-\alpha r}$. The variable does not need to be explicitly defined if the functional form is correct. Award 0 points if no centrifugal approximation is applied, or if the functional form is different (e.g., $1/r^2$ is left unapproximated, or a Taylor expansion is used instead).

### Criterion 3 — Weight: 1
**Criterion:** Define the energy-dependent parameters $\beta = \eta A$, $\gamma = \eta B$, $\epsilon = \sqrt{m^2-E^2}/(\hbar c \alpha)$, $\eta = (E+m)/(\hbar c \alpha)$, and $\delta = \frac{1}{2}(1+\sqrt{(2\ell+1)^2+4\gamma})$
**Description:** The five dimensionless parameters must all carry the energy-dependent factor $\eta = (E+m)/(\hbar c \alpha)$. In particular, $\beta$ and $\gamma$ must NOT be set to the bare values $A$ and $B$.
**Grading Guidance:** Award 1 point if all five parameters are correctly defined: $\epsilon = \sqrt{m^2-E^2}/(\hbar c\alpha)$, $\eta = (E+m)/(\hbar c\alpha)$, $\beta = 48\eta$, $\gamma = 18\eta$, $\delta = \frac{1}{2}(1+\sqrt{9+4\gamma})$, using any consistent notation that produces the same numerical values. Award 0 points if any of the following: (a) $\beta$ or $\gamma$ are treated as energy-independent constants (e.g., $\beta = 48$ or $\gamma = 18$), or (b) fewer than four of the five parameters are correctly defined. Cases with exactly four correct and one wrong also receive 0 points.

### Criterion 4 — Weight: 1
**Criterion:** State the quantization condition $\epsilon = \frac{1}{2}(\beta/\delta - \delta)$ for $n_r = 0$
**Description:** The general quantization condition is $\epsilon = \frac{1}{2}(\beta/(n_r+\delta) - (n_r+\delta))$. For the ground state $n_r = 0$, this reduces to $\epsilon = \frac{1}{2}(\beta/\delta - \delta)$. This equation is transcendental because $\epsilon$, $\beta$, $\gamma$, and $\delta$ all depend on $E$.
**Grading Guidance:** Award 1 point if the response writes $\epsilon = \frac{1}{2}(\beta/\delta - \delta)$, or the general form $\epsilon = \frac{1}{2}(\beta/(n_r+\delta) - (n_r+\delta))$ with $n_r = 0$ substituted, or any algebraic rearrangement of the same equation (e.g., solving for $\beta$ or $\delta$ in terms of the others). Award 0 points if no quantization condition is stated, or if the stated condition is not an algebraic rearrangement of $\epsilon = \frac{1}{2}(\beta/\delta - \delta)$.

### Criterion 5 — Weight: 1
**Criterion:** Solve the transcendental equation numerically to obtain $E$ in the range $[237, 262]$ MeV inclusive
**Description:** The converged value is $E = 249.21$ MeV. The acceptable range is $[237, 262]$ MeV (within 5% of 249 MeV). Endpoints 237 and 262 are included.
**Grading Guidance:** Award 1 point if the response reports a numerical value of $E$ in the range $[237, 262]$ MeV inclusive, regardless of the method used or the level of detail shown in the solution. Award 0 points if $E$ is outside $[237, 262]$ MeV, or if no numerical value of $E$ is reported.

### Criterion 6 — Weight: 2
**Criterion:** Calculate the binding energy $E_b = mc^2 - E = 689$ MeV and report $E_b$ in the range $[654, 724]$ MeV inclusive
**Description:** The correct formula is $E_b = mc^2 - E = 938.3 - E$. With $E = 249.21$ MeV, this gives $E_b = 689$ MeV (to three significant figures). The acceptable range is $[654, 724]$ MeV (within 5% of 689). Endpoints 654 and 724 are included.
**Grading Guidance:** Award 2 points if the response computes $E_b$ as $mc^2 - E$ (or equivalently $938.3 - E$, stated explicitly or evident from the arithmetic) and obtains a value in the range $[654, 724]$ MeV inclusive. Award 1 point if the response computes $E_b = mc^2 - E$ (or $938.3 - E$) explicitly but obtains a value outside $[654, 724]$ MeV — regardless of whether the error originates in $E$, in the mass value, or in the subtraction itself. Award 0 points if the response does not compute $E_b$ as a subtraction of $E$ from $mc^2$ (e.g., uses $E_b = E$, $E_b = m + E$, or reports $E$ itself as the binding energy), or if no numerical value of $E_b$ is reported.

**Total weight: 1+1+1+1+1+2 = 7** ✓

---

## QC Flag Justifications

### Atomic criterion justifications

**Criterion 1 (Atomic):** The mapping $\kappa \to \ell \to \ell(\ell+1)$ and the radial equation setup form one evaluation step. The orbital quantum number and the equation it enters are not independently evaluable — $\ell=1$ is meaningless without checking that it appears correctly in the equation.

**Criterion 2 (Atomic):** The centrifugal approximation is defined in terms of $z = e^{-\alpha r}$; one cannot apply the approximation without performing the substitution. These are a single methodological step, not two independent skills.

**Criterion 3 (Atomic):** The five parameters form one parametrization of the energy equation. They are not independently evaluable — defining $\epsilon$ without $\eta$ or $\beta$ without $\gamma$ has no standalone meaning. The single evaluable question is whether the energy-dependent parametrization is correct.

**Criterion 4 (Atomic):** Writing the general formula and setting $n_r = 0$ is one step. The general formula without the substitution is not independently useful for this specific ground-state problem.

**Criterion 5 (Atomic):** Grading is based solely on the reported numerical value of $E$. The method is not separately evaluated because the value itself is the checkable output. No causal inference is needed.

**Criterion 6 (Atomic):** The formula $E_b = mc^2 - E$ is trivial arithmetic once $E$ is known. The 1-point partial credit condition is operationally defined: check if $938.3 - [\text{some value}]$ appears in the response, and check if the result is in range.

### Grading guidance justifications

**Criterion 1 (Grading):** The revised guidance removes "proportional to" ambiguity by specifying "includes the product $(E+m)\Sigma(r)$ with any constant prefactors." The 0-point threshold is tightened: any missing element yields 0 (no gap between 0 and 1).

**Criterion 2 (Grading):** The revised guidance explicitly states that any variable name is acceptable and that the variable does not need to be explicitly defined if the functional form is correct.

**Criterion 3 (Grading):** The revised guidance explicitly maps all cases: all five correct = 1 point; anything else (including four correct, three correct, or energy-independent $\beta$/$\gamma$) = 0 points. No gap remains.

**Criterion 4 (Grading):** Removed "yields the same numerical root" — acceptance is now strictly "algebraic rearrangement of the same equation."

**Criterion 5 (Grading):** The revised guidance awards credit based solely on the reported value of $E$, regardless of method shown or level of detail. This eliminates all ambiguity about "valid methods" and "sufficient evidence."

**Criterion 6 (Grading):** The 1-point condition no longer requires causal inference. It is now: "computes $E_b = mc^2 - E$ explicitly but obtains a value outside $[654, 724]$ MeV — regardless of error source." The 0-point condition covers cases where the formula is absent or wrong, or no value is reported.

**Criterion 5 & 6 (Boundary):** All ranges use bracket notation $[a, b]$ with "inclusive" stated explicitly.

### Other QC notes

**Proctor final answer included in rubric:** ✅ Criterion 6 includes $E_b = 689$ MeV as the target.

**Proctor criteria weight = 7:** ✅ $1+1+1+1+1+2 = 7$.

**Criterion self-contained (Criterion 6):** Revised to state explicitly: "Student correctly selects $E_b = mc^2 - E = 938.3 - E$ and reports a value in $[654, 724]$ MeV."
