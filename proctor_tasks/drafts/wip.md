# Project Proctor Task — Mathematics / Mathematical Physics Domain
**Task file:** `32945d48.md`
**Source problem:** `3c1c8b15.md` (adapted — Jacobi polynomial asymptotic phase)
**Status:** DRAFT — Phase 1 (prompt only, awaiting model testing)

---

## STEP 0 — Domain

**Domain:** Mathematics
**Subdomain:** Special Functions / Orthogonal Polynomials
**Difficulty:** Graduate / PhD-level

---

## STEP 1 — Prompt

Let $P_n^{(\alpha,\beta)}(x)$ denote the Jacobi polynomial of degree $n$ with parameters $\alpha$, $\beta > -1$.

For fixed $\alpha$, $\beta$, and $\theta \in (0,\pi)$, the standard Darboux asymptotic expansion gives

$$P_n^{(\alpha,\beta)}(\cos\theta) \sim \frac{K(\theta,\alpha,\beta)}{\sqrt{n}} \cos\!\left[\left(n + \frac{\alpha+\beta+1}{2}\right)\theta \;-\; \frac{(2\alpha+1)\pi}{4}\right]$$

as $n \to \infty$, where $K(\theta,\alpha,\beta) > 0$ is an explicit amplitude factor depending on $\theta$, $\alpha$, $\beta$.

Set $\alpha = 2$, $\beta = 4$, and $x = \tfrac{1}{2}$.

Compute the constant (i.e., $n$-independent) phase term in the cosine argument above. Express your answer as a single fraction times $\pi$.

---

## Expected traps / anticipated model failures

**Primary trap (forgetting the $\theta$-dependent constant):** The cosine argument is $(n + 7/2)\theta - 5\pi/4$. Expanding: $n\theta + (7/2)\theta - 5\pi/4$. The $n$-independent part is $(7/2)\theta - 5\pi/4 = 7\pi/6 - 5\pi/4 = -\pi/12$. Models may report just $-5\pi/4$, forgetting that $(7/2)\theta$ is also $n$-independent.

**Secondary trap (angle identification):** The argument is $x = 1/2$, so $\cos\theta = 1/2$, giving $\theta = \pi/3$. Models may confuse $\theta = \pi/3$ with $\theta = \pi/6$.

**Tertiary trap (the $\alpha$ parameter in the Darboux phase):** The constant from the Darboux formula is $-(2\alpha+1)\pi/4$. With $\alpha = 2$ this gives $-5\pi/4$. Models may:
- Use $\beta = 4$ instead of $\alpha = 2$, getting $-(2\cdot4+1)\pi/4 = -9\pi/4$
- Use $(\alpha+\beta)/2 = 3$, getting $-(2\cdot3+1)\pi/4 = -7\pi/4$

**Quaternary trap (combining errors):** If the model gets $\theta$ wrong ($\pi/6$ instead of $\pi/3$) AND forgets the $(7/2)\theta$ term, it reports $-5\pi/4$. If it gets $\theta$ wrong but correctly includes $(7/2)\theta$: $(7/2)(\pi/6) - 5\pi/4 = 7\pi/12 - 5\pi/4 = -8\pi/12 = -2\pi/3$.

---

## STEP 6 — Step-by-Step Solution + Final Answer

**Step 1: Identify $\theta$**

$x = 1/2 = \cos\theta \implies \theta = \pi/3$.

**Step 2: Write out the cosine argument**

$$\left(n + \frac{2+4+1}{2}\right)\frac{\pi}{3} - \frac{(2\cdot2+1)\pi}{4} = \left(n + \frac{7}{2}\right)\frac{\pi}{3} - \frac{5\pi}{4}$$

**Step 3: Separate $n$-dependent and $n$-independent parts**

$$= n\cdot\frac{\pi}{3} + \frac{7}{2}\cdot\frac{\pi}{3} - \frac{5\pi}{4} = n\cdot\frac{\pi}{3} + \frac{7\pi}{6} - \frac{5\pi}{4}$$

**Step 4: Compute the $n$-independent part**

$$\frac{7\pi}{6} - \frac{5\pi}{4} = \frac{14\pi}{12} - \frac{15\pi}{12} = -\frac{\pi}{12}$$

**Final Answer:** $-\dfrac{\pi}{12}$

**Final Answer Format:** Fraction (of $\pi$)

---

## Distinct wrong answers

| Trap | Wrong answer | How it arises |
|------|-------------|---------------|
| Report only $-(2\alpha+1)\pi/4$ | $-5\pi/4$ | Forgets $(7/2)\theta$ is also $n$-independent |
| Use $\beta$ instead of $\alpha$ | $7\pi/6 - 9\pi/4 = -13\pi/12$ | Wrong Darboux parameter |
| Wrong $\theta = \pi/6$ | $7\pi/12 - 5\pi/4 = -2\pi/3$ | $\sin^{-1}$ instead of $\cos^{-1}$ |
| Report only $-(2\alpha+1)\pi/4$ AND wrong $\alpha$ | $-9\pi/4$ | Two errors compounded |
| Drop the $+1$ in $(2\alpha+1)$ | $7\pi/6 - \pi = \pi/6$ | Misremembers formula |

---

## Notes

- The problem has a genuine **multi-step reasoning chain**: identify $\theta$ → substitute into Darboux → expand → separate $n$-dependent from constant → compute
- The primary trap ($-5\pi/4$ instead of $-\pi/12$) is a **reasoning error**, not a lookup error: the model must recognize that $((\alpha+\beta+1)/2)\cdot\theta$ contributes to the constant phase
- The answer $-\pi/12$ is a clean fraction that cannot be guessed
- Phase modulo $2\pi$: $-\pi/12 \equiv 23\pi/12 \pmod{2\pi}$; both accepted
