Evaluate the ratio
$$
I = \frac{\int_{0}^{\infty} e^{-x}\ x^{2}\ L_3(x)\ L_3(x)\ dx}{\int_{0}^{\infty} e^{-x}\ x\ L_2(x)\ L_2(x)\ dx}
$$
where $L_n(x)$ denotes the Laguerre polynomial with $\alpha = 0$.

1.	Define the inner product $\langle f,g\rangle=\int_{0}^{\infty} e^{-x} f(x) g(x)\ dx$ with $\langle L_m,L_n\rangle=\delta_{mn}$.
2.	The ratio is $I=\dfrac{\int_{0}^{\infty} e^{-x} x^{2} L_3(x)^2 dx}{\int_{0}^{\infty} e^{-x} x L_2(x)^2 dx}=\dfrac{\langle x^2 L_3,L_3\rangle}{\langle xL_2,L_2\rangle}$.
3.	Use the recurrence $xL_n=(2n+1)L_n-(n+1)L_{n+1}-nL_{n-1}$.
4.	For $n=2$: $xL_2=5L_2-3L_3-2L_1$, so $\langle xL_2,L_2\rangle=5$.
5.	For the numerator: $\langle x^2 L_3,L_3\rangle=\langle xL_3,xL_3\rangle$.
6.	For $n=3$: $xL_3=7L_3-4L_4-3L_2$.
7.	Then $\langle xL_3,xL_3\rangle=7^2+(-4)^2+(-3)^2=74$.
8.	Therefore $I=\dfrac{74}{5}$.