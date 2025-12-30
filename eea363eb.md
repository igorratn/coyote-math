
Determine with rigorous proof whether the following statement is true or false:

Let

$$I_n = n^2 \int_{0}^{1}\frac{x^{n}}{1+2x+\frac{2}{n}}\,dx.$$

The limit

$$L = \lim_{n\to\infty}\left( I_n - \frac{n}{3} \right)$$

exists and is equal to $-4/9$.

----------

Answer: False (The limit is actually $-1/3$).

### Rigorous Proof

To evaluate the limit, we analyze the behavior of the integral as $n \to \infty$. The factor $x^n$ concentrates the mass of the integral in a boundary layer of width $O(1/n)$ near $x=1$.

1.  Substitution
    
    Substitute $x = e^{-t/n}$. Then $x^n = e^{-t}$ and $dx = -(1/n) e^{-t/n} dt$. The limits $x \in [0, 1]$ transform to $t \in [\infty, 0]$. Flipping the limits gives:
    
    $$I_n = n \int_0^\infty e^{-t} \cdot \frac{e^{-t/n}}{1 + 2 e^{-t/n} + 2/n} \, dt$$
    
2.  Asymptotic Expansion
    
    Expand the rational part of the integrand for large $n$. For a fixed $t$, as $n \to \infty$:
    
    $$e^{-t/n} = 1 - \frac{t}{n} + O\left(\frac{t^2}{n^2}\right)$$
    
    The numerator is $1 - \frac{t}{n} + O(t^2/n^2)$. The denominator is:
    
    $$1 + 2\left(1 - \frac{t}{n} + O\left(\frac{t^2}{n^2}\right)\right) + \frac{2}{n} = 3 + \frac{2 - 2t}{n} + O\left(\frac{t^2}{n^2}\right)$$
    
    Using the geometric series $(1 + \epsilon)^{-1} = 1 - \epsilon + O(\epsilon^2)$, the fraction expands as:
    
    $$\frac{e^{-t/n}}{1 + 2 e^{-t/n} + 2/n} = \frac{1 - t/n}{3(1 + \frac{2-2t}{3n})} + O\left(\frac{t^2}{n^2}\right) = \frac{1}{3} - \frac{t+2}{9n} + O\left(\frac{1+t^2}{n^2}\right)$$
    
    The remainder term is uniformly bounded by $C(1+t^2)/n^2$ such that its integral against $e^{-t}$ is $O(n^{-2})$.
    
3.  Integration
    
    Integrate the expansion against the weight $e^{-t}$:
    
    $$\int_0^\infty e^{-t} \left( \frac{1}{3} - \frac{t + 2}{9n} \right) dt + O(n^{-2}) = \frac{1}{3} \int_0^\infty e^{-t} dt - \frac{1}{9n} \int_0^\infty e^{-t} (t + 2) dt + O(n^{-2})$$
    
    Using the standard moments $\int_0^\infty e^{-t} dt = 1$ and $\int_0^\infty t e^{-t} dt = 1$:
    
    $$\int_0^\infty e^{-t} (t + 2) dt = 1 + 2 = 3$$
    
    The integral becomes:
    
    $$\frac{1}{3} - \frac{3}{9n} + O(n^{-2}) = \frac{1}{3} - \frac{1}{3n} + O(n^{-2})$$
    
4.  Conclusion
    
    Multiplying by the leading factor $n$:
    
    $$I_n = \frac{n}{3} - \frac{1}{3} + O(n^{-1})$$
    
    Therefore:
    
    $$L = \lim_{n \to \infty} \left( I_n - \frac{n}{3} \right) = -1/3$$
    
    Since $-1/3 \neq -4/9$, the statement is false.