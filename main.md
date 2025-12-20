\documentclass[12pt]{article}
\usepackage{amsmath,amssymb}

\begin{document}

Let
\[
I_n \;=\; n^2 \int_{0}^{1}\frac{x^{n}}{1+2x+\frac{2}{n}}\,dx.
\]
Compute
\[
L \;=\; \lim_{n\to\infty}\Big( I_n - \tfrac{n}{3}\Big).
\]

\begin{enumerate}
    \item \textbf{Split the integrand at $x=1$:}
    \[
    \frac{1}{1+2x+\tfrac{2}{n}}
    \;=\; \frac{1}{3+\tfrac{2}{n}}
    \;+\;\bigg(\frac{1}{1+2x+\tfrac{2}{n}}-\frac{1}{3+\tfrac{2}{n}}\bigg).
    \]

    \item \textbf{“Constant” piece:}
    \[
    n^2\!\int_0^1 \frac{x^n}{3+\tfrac{2}{n}}\,dx
    \;=\; \frac{n^2}{3+\tfrac{2}{n}}\cdot\frac{1}{n+1}
    \;=\; \frac{n}{3}-\frac{2}{9}+O\!\Big(\tfrac{1}{n}\Big).
    \]

    \item \textbf{Linearize near $x=1$:}
    \[
    \frac{1}{1+2x+\tfrac{2}{n}}-\frac{1}{3+\tfrac{2}{n}}
    \;=\; -\,\frac{2(x-1)}{(3+\tfrac{2}{n})^2} \;+\; O\big((x-1)^2\big).
    \]

    \item \textbf{Exact moment:}
    \[
    n^2\!\int_0^1 x^n(x-1)\,dx
    \;=\; \frac{n^2}{(n+1)(n+2)} \;=\; 1+O\!\Big(\tfrac{1}{n}\Big).
    \]

    \item \textbf{Remainder contribution:}
    \[
    n^2\!\int_0^1 x^n\!\left(\frac{1}{1+2x+\tfrac{2}{n}}-\frac{1}{3+\tfrac{2}{n}}\right)\!dx
    \;=\; -\frac{2}{(3+\tfrac{2}{n})^2}\Big[1+O\!\Big(\tfrac{1}{n}\Big)\Big]
    \;=\; -\frac{2}{9}+O\!\Big(\tfrac{1}{n}\Big).
    \]

    \item \textbf{Assemble:}
    \[
    I_n \;=\; \Big(\tfrac{n}{3}-\tfrac{2}{9}\Big) + \Big(-\tfrac{2}{9}\Big) + O\!\Big(\tfrac{1}{n}\Big)
    \;=\; \tfrac{n}{3}-\tfrac{1}{3}+O\!\Big(\tfrac{1}{n}\Big).
    \]

    \item \textbf{Limit:}
    \[
    L \;=\; \lim_{n\to\infty}\Big(I_n-\tfrac{n}{3}\Big) \;=\; -\tfrac{1}{3}.
    \]
\end{enumerate}

\end{document}