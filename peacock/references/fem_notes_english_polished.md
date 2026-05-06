# Finite Element Analysis Notes

This is a polished English version reconstructed from the Russian handwritten draft. The text fills in unclear gaps using the standard finite element theory for second-order elliptic boundary value problems.

## 1. Model one-dimensional boundary value problem

Let $I=(0,1)$. Consider the boundary value problem

$-\frac{d}{dx}\left(p(x)u^\prime(x)\right)+q(x)u(x)=f(x),\quad x\in I,$

with homogeneous Dirichlet boundary conditions

$u(0)=0,\quad u(1)=0.$

Assume

$p(x)\ge p_0>0,\quad q(x)\ge0,$

and

$p,q\in L_\infty(I).$

The condition $p(x)\ge p_0>0$ is the ellipticity condition. It prevents the differential operator from degenerating. The assumption $q(x)\ge0$ is used to obtain coercivity of the bilinear form.

## 2. The space $H^1(I)$

The Sobolev space $H^1(I)$ consists of functions $u\in L_2(I)$ whose weak derivative $u^\prime$ also belongs to $L_2(I)$.

The norm is

$\|u\|_{H^1(I)}^2=\|u\|_{L_2(I)}^2+\|u^\prime\|_{L_2(I)}^2.$

We often write

$\|u\|_0=\|u\|_{L_2(I)}.$

Thus

$\|u\|_{H^1(I)}^2=\|u\|_0^2+\|u^\prime\|_0^2.$

The corresponding inner product is

$(u,v)_{H^1(I)}=(u,v)_{L_2(I)}+(u^\prime,v^\prime)_{L_2(I)}.$

## 3. The space $H_0^1(I)$

The space $H_0^1(I)$ is the subspace of $H^1(I)$ consisting of functions with zero trace on the boundary:

$H_0^1(I)=\{v\in H^1(I):v(0)=v(1)=0\}.$

For functions in $H_0^1(I)$, the derivative norm $\|v^\prime\|_0$ is equivalent to the full $H^1$ norm. This follows from the Poincare inequality.

## 4. Basic inequalities in $H_0^1(I)$

If $v\in H_0^1(I)$, then

$v(x)=\int_0^xv^\prime(t)\,dt.$

By the Cauchy-Schwarz inequality,

$|v(x)|\le\int_0^x|v^\prime(t)|\,dt\le\sqrt{x}\|v^\prime\|_0\le\|v^\prime\|_0.$

Therefore

$\max_{x\in I}|v(x)|\le\|v^\prime\|_0.$

Also,

$\|v\|_0^2=\int_0^1|v(x)|^2\,dx\le C\|v^\prime\|_0^2.$

This is the Poincare inequality. On the interval $(0,1)$ one may use several valid constants. The important point is that there is a constant $C$ independent of $v$ such that

$\|v\|_0\le C\|v^\prime\|_0.$

Consequently,

$\|v\|_{H^1(I)}\le C\|v^\prime\|_0,\quad v\in H_0^1(I).$

## 5. Weak formulation

Multiply the differential equation by a test function $v\in H_0^1(I)$ and integrate over $I$:

$\int_0^1\left[-(p u^\prime)^\prime+qu\right]v\,dx=\int_0^1fv\,dx.$

Integrating the first term by parts gives

$\int_0^1p u^\prime v^\prime\,dx-\left[p u^\prime v\right]_{0}^{1}+\int_0^1quv\,dx=\int_0^1fv\,dx.$

Since $v(0)=v(1)=0$, the boundary term vanishes. Hence the weak formulation is:

find $u\in H_0^1(I)$ such that

$a(u,v)=\ell(v)\quad\forall v\in H_0^1(I),$

where

$a(u,v)=\int_0^1\left(p(x)u^\prime(x)v^\prime(x)+q(x)u(x)v(x)\right)dx,$

and

$\ell(v)=\int_0^1f(x)v(x)\,dx.$

## 6. Continuity of the linear functional

By Cauchy-Schwarz,

$|\ell(v)|=\left|\int_0^1fv\,dx\right|\le\|f\|_0\|v\|_0.$

Using the Poincare inequality,

$|\ell(v)|\le C\|f\|_0\|v\|_{H^1(I)}.$

Thus $\ell$ is a continuous linear functional on $H_0^1(I)$.

## 7. Continuity of the bilinear form

Let $p,q\in L_\infty(I)$. Then

$\left|\int_0^1p u^\prime v^\prime\,dx\right|\le\|p\|_\infty\|u^\prime\|_0\|v^\prime\|_0,$

and

$\left|\int_0^1q uv\,dx\right|\le\|q\|_\infty\|u\|_0\|v\|_0.$

Therefore

$|a(u,v)|\le C\|u\|_{H^1(I)}\|v\|_{H^1(I)}.$

Thus $a$ is continuous on $H_0^1(I)\times H_0^1(I)$.

## 8. Coercivity

For $v\in H_0^1(I)$,

$a(v,v)=\int_0^1p(x)|v^\prime(x)|^2\,dx+\int_0^1q(x)|v(x)|^2\,dx.$

Using $p(x)\ge p_0>0$ and $q(x)\ge0$,

$a(v,v)\ge p_0\|v^\prime\|_0^2.$

By the Poincare inequality, $\|v^\prime\|_0$ controls $\|v\|_{H^1(I)}$. Hence

$a(v,v)\ge c\|v\|_{H^1(I)}^2$

for some $c>0$. Thus $a$ is coercive on $H_0^1(I)$.

## 9. Lax-Milgram theorem

The Lax-Milgram theorem states that if $V$ is a Hilbert space, $a(\cdot,\cdot)$ is continuous and coercive on $V\times V$, and $\ell$ is a continuous linear functional on $V$, then there exists a unique $u\in V$ such that

$a(u,v)=\ell(v)\quad\forall v\in V.$

Applying this theorem with $V=H_0^1(I)$ gives existence and uniqueness of the weak solution.

## 10. Galerkin approximation

Let $S_h\subset H_0^1(I)$ be a finite-dimensional subspace. The Galerkin approximation is:

find $u_h\in S_h$ such that

$a(u_h,v_h)=\ell(v_h)\quad\forall v_h\in S_h.$

Let $\{\varphi_i\}_{i=1}^N$ be a basis of $S_h$. Write

$u_h(x)=\sum_{j=1}^NU_j\varphi_j(x).$

Substituting into the Galerkin equations gives

$\sum_{j=1}^NU_j a(\varphi_j,\varphi_i)=\ell(\varphi_i),\quad i=1,\ldots,N.$

This is the linear system

$KU=F,$

where

$K_{ij}=a(\varphi_j,\varphi_i),$

and

$F_i=\ell(\varphi_i).$

The matrix $K$ is called the stiffness matrix.

## 11. Galerkin orthogonality

The exact weak solution satisfies

$a(u,v_h)=\ell(v_h)\quad\forall v_h\in S_h.$

The finite element solution satisfies

$a(u_h,v_h)=\ell(v_h)\quad\forall v_h\in S_h.$

Subtracting these equations gives

$a(u-u_h,v_h)=0\quad\forall v_h\in S_h.$

This is Galerkin orthogonality. It is the central identity in the error analysis.

## 12. Cea's lemma

Assume $a$ is continuous and coercive:

$|a(w,v)|\le M\|w\|_V\|v\|_V,$

$a(v,v)\ge\alpha\|v\|_V^2.$

Then the Galerkin error satisfies

$\|u-u_h\|_V\le\frac{M}{\alpha}\inf_{v_h\in S_h}\|u-v_h\|_V.$

Thus the finite element solution is quasi-optimal: its error is bounded by the best approximation error in the finite element space.

For the elliptic problem above, $V=H_0^1(I)$.

## 13. One-dimensional finite element space

Let

$0=x_0<x_1<\cdots<x_N=1$

be a partition of $I$. Let

$h_i=x_i-x_{i-1},\quad h=\max_i h_i.$

For linear finite elements, $S_h$ consists of continuous functions that are linear on each interval $[x_{i-1},x_i]$ and vanish at $x=0$ and $x=1$.

The nodal basis functions $\varphi_i$ satisfy

$\varphi_i(x_j)=\delta_{ij}.$

Each $\varphi_i$ is a hat function, supported only on the neighboring elements.

## 14. Interpolation in one dimension

For a continuous function $v$, define the nodal interpolant $I_hv\in S_h$ by

$(I_hv)(x_i)=v(x_i).$

If $v\in H^2(I)$, then the standard interpolation estimates are

$\|v-I_hv\|_{L_2(I)}\le Ch^2\|v^{\prime\prime}\|_{L_2(I)},$

and

$\|(v-I_hv)^\prime\|_{L_2(I)}\le Ch\|v^{\prime\prime}\|_{L_2(I)}.$

Equivalently,

$\|v-I_hv\|_{H^1(I)}\le Ch\|v\|_{H^2(I)}.$

## 15. Error estimate in one dimension

By Cea's lemma,

$\|u-u_h\|_{H^1(I)}\le C\inf_{v_h\in S_h}\|u-v_h\|_{H^1(I)}.$

Choose $v_h=I_hu$. Then

$\|u-u_h\|_{H^1(I)}\le C\|u-I_hu\|_{H^1(I)}.$

Using the interpolation estimate,

$\|u-u_h\|_{H^1(I)}\le Ch\|u\|_{H^2(I)}.$

Thus linear finite elements converge with first order in the $H^1$ norm.

A sharper $L_2$ estimate can be obtained by a duality argument:

$\|u-u_h\|_{L_2(I)}\le Ch^2\|u\|_{H^2(I)}$

under the usual elliptic regularity assumptions.

## 16. Green's function identities in one dimension

The draft includes examples based on Green's functions. These identities are used to derive estimates for functions satisfying boundary conditions.

If $v(0)=0$, then

$v(x)=\int_0^xv^\prime(t)\,dt.$

If $v(0)=v(1)=0$, then $v$ can be represented through a Green's function for the operator $-d^2/dx^2$:

$v(x)=\int_0^1G(x,\xi)(-v^{\prime\prime}(\xi))\,d\xi,$

where

$G(x,\xi)=
\begin{cases}
x(1-\xi),&x\le\xi,\\
\xi(1-x),&\xi\le x.
\end{cases}$

Equivalently, if one writes the representation with $v^{\prime\prime}$ rather than $-v^{\prime\prime}$, the sign of $G$ is reversed.

## 17. Sobolev spaces on a two-dimensional domain

Let $\Omega\subset\mathbb{R}^2$. The Sobolev space $H^m(\Omega)$ consists of functions whose weak derivatives up to order $m$ belong to $L_2(\Omega)$.

Using multi-index notation,

$\|v\|_{H^m(\Omega)}^2=\sum_{|\alpha|\le m}\|D^\alpha v\|_{L_2(\Omega)}^2.$

The seminorm of order $m$ is

$|v|_{H^m(\Omega)}^2=\sum_{|\alpha|=m}\|D^\alpha v\|_{L_2(\Omega)}^2.$

For $m=2$,

$|v|_{H^2(\Omega)}^2=\|v_{x_1x_1}\|_0^2+2\|v_{x_1x_2}\|_0^2+\|v_{x_2x_2}\|_0^2,$

if the mixed derivative is counted with the usual multinomial weight. Some texts instead write the equivalent seminorm as the sum of the three second-derivative norms without the factor $2$. Both definitions give equivalent seminorms.

## 18. Model elliptic problem in two dimensions

A standard two-dimensional model problem is the Poisson equation

$-\Delta u=f\quad\text{in }\Omega,$

$u=0\quad\text{on }\partial\Omega.$

The weak form is:

find $u\in H_0^1(\Omega)$ such that

$a(u,v)=\ell(v)\quad\forall v\in H_0^1(\Omega),$

where

$a(u,v)=\int_\Omega\nabla u\cdot\nabla v\,dx,$

and

$\ell(v)=\int_\Omega fv\,dx.$

A more general elliptic problem has the form

$-\nabla\cdot(A(x)\nabla u)+c(x)u=f,$

with weak form

$a(u,v)=\int_\Omega\left(A(x)\nabla u\cdot\nabla v+c(x)uv\right)dx.$

## 19. Triangulation of the domain

Let $\mathcal{T}_h$ be a triangulation of $\Omega$ into triangles $e$. Define

$h_e=\operatorname{diam}(e),\quad h=\max_{e\in\mathcal{T}_h}h_e.$

A standard assumption is shape regularity. This means the triangles do not become arbitrarily thin as $h\to0$. Equivalently, the ratio between the diameter of a triangle and the radius of its inscribed circle remains uniformly bounded.

This assumption is needed for interpolation estimates with constants independent of $h$.

## 20. Linear triangular finite elements

On each triangle $e$, take

$P_1(e)=\{\text{linear polynomials on }e\}.$

The local degrees of freedom are the values at the three vertices of $e$.

The global finite element space is

$S_h=\{v_h\in C^0(\overline{\Omega}):v_h|_e\in P_1(e)\text{ for every }e\in\mathcal{T}_h\}.$

For homogeneous Dirichlet boundary conditions,

$S_h^0=S_h\cap H_0^1(\Omega).$

The finite element solution is:

find $u_h\in S_h^0$ such that

$a(u_h,v_h)=\ell(v_h)\quad\forall v_h\in S_h^0.$

## 21. Reference triangle and affine maps

Let $\hat e$ be the reference triangle. A physical triangle $e$ is obtained from $\hat e$ by an affine map

$x=F_e(\hat x)=B_e\hat x+b_e.$

The Jacobian matrix is $B_e$. The area scaling is

$dx=|\det B_e|\,d\hat x.$

Gradients transform by

$\nabla_x v=B_e^{-T}\nabla_{\hat x}\hat v.$

This transformation is used to transfer estimates from the reference element to each physical element.

For shape-regular meshes,

$\|B_e\|\le Ch_e,\quad \|B_e^{-1}\|\le C h_e^{-1},\quad |\det B_e|\simeq h_e^2.$

## 22. Nodal interpolation on triangles

For $v$ continuous on a triangle $e$, define the local nodal interpolant $I_ev\in P_1(e)$ by

$(I_ev)(a_i)=v(a_i),\quad i=1,2,3,$

where $a_1,a_2,a_3$ are the vertices of $e$.

The global interpolant $I_hv$ is obtained by applying this construction on every triangle. If $v$ is continuous on $\overline{\Omega}$, then $I_hv\in S_h$.

The key property is exactness on linear polynomials:

$I_ep=p\quad\forall p\in P_1(e).$

This property is crucial in the interpolation error proof.

## 23. Lemma 5: local interpolation estimate

Let $e$ be a triangle from a shape-regular triangulation and let $v\in H^2(e)$. Then the nodal linear interpolant satisfies

$\|v-I_ev\|_{L_2(e)}\le Ch_e^2|v|_{H^2(e)},$

and

$|v-I_ev|_{H^1(e)}\le Ch_e|v|_{H^2(e)}.$

Equivalently,

$\|\nabla(v-I_ev)\|_{L_2(e)}\le Ch_e|v|_{H^2(e)}.$

The constant $C$ depends only on the shape-regularity of the mesh, not on $h_e$.

## 24. Proof idea for Lemma 5

First prove the estimate on the reference triangle $\hat e$:

$\|\hat v-\hat I\hat v\|_{L_2(\hat e)}\le C|\hat v|_{H^2(\hat e)},$

and

$|\hat v-\hat I\hat v|_{H^1(\hat e)}\le C|\hat v|_{H^2(\hat e)}.$

The reason this works is that the interpolation error vanishes for all linear polynomials:

$\hat I\hat p=\hat p,\quad \hat p\in P_1(\hat e).$

By the Bramble-Hilbert lemma,

$\inf_{\hat p\in P_1(\hat e)}\|\hat v-\hat p\|_{H^k(\hat e)}\le C|\hat v|_{H^2(\hat e)},\quad k=0,1.$

Then transfer the estimate from $\hat e$ to $e$ using the affine transformation

$x=B_e\hat x+b_e.$

The scaling of $L_2$ norms and $H^1$ seminorms gives the powers $h_e^2$ and $h_e$. Therefore,

$\|v-I_ev\|_{L_2(e)}\le Ch_e^2|v|_{H^2(e)},$

and

$|v-I_ev|_{H^1(e)}\le Ch_e|v|_{H^2(e)}.$

## 25. Global interpolation estimates

Summing the local estimates over all elements gives

$\|v-I_hv\|_{L_2(\Omega)}\le Ch^2|v|_{H^2(\Omega)},$

and

$|v-I_hv|_{H^1(\Omega)}\le Ch|v|_{H^2(\Omega)}.$

Thus,

$\|v-I_hv\|_{H^1(\Omega)}\le Ch\|v\|_{H^2(\Omega)}.$

## 26. Finite element error estimate in two dimensions

By Cea's lemma,

$\|u-u_h\|_{H^1(\Omega)}\le C\inf_{v_h\in S_h^0}\|u-v_h\|_{H^1(\Omega)}.$

Choose $v_h=I_hu$. Then

$\|u-u_h\|_{H^1(\Omega)}\le C\|u-I_hu\|_{H^1(\Omega)}.$

Using the global interpolation estimate,

$\|u-u_h\|_{H^1(\Omega)}\le Ch|u|_{H^2(\Omega)}.$

Thus linear triangular finite elements converge with first order in the energy norm.

With the Aubin-Nitsche duality argument and suitable elliptic regularity,

$\|u-u_h\|_{L_2(\Omega)}\le Ch^2|u|_{H^2(\Omega)}.$

## 27. Assembly of the finite element system

Let $\{\varphi_i\}_{i=1}^N$ be the nodal basis of $S_h^0$. Write

$u_h=\sum_{j=1}^NU_j\varphi_j.$

The Galerkin equations become

$\sum_{j=1}^NK_{ij}U_j=F_i,\quad i=1,\ldots,N.$

For the Poisson problem,

$K_{ij}=\int_\Omega\nabla\varphi_j\cdot\nabla\varphi_i\,dx,$

and

$F_i=\int_\Omega f\varphi_i\,dx.$

The global matrix is assembled from local element matrices:

$K=\sum_{e\in\mathcal{T}_h}K^e.$

On an element $e$,

$K_{ij}^e=\int_e\nabla\varphi_j^e\cdot\nabla\varphi_i^e\,dx.$

The local load vector is

$F_i^e=\int_ef\varphi_i^e\,dx.$

The global entries are obtained by adding each local contribution to the corresponding global degrees of freedom.

## 28. Local stiffness matrix for linear triangles

For a linear triangular element, the local basis functions are affine functions. Therefore their gradients are constant on each triangle.

Hence for the Poisson equation,

$K_{ij}^e=|e|\,\nabla\varphi_j^e\cdot\nabla\varphi_i^e,$

where $|e|$ is the area of the triangle.

If the equation has a coefficient $p(x)$, then

$K_{ij}^e=\int_ep(x)\nabla\varphi_j^e\cdot\nabla\varphi_i^e\,dx.$

If $p$ is constant on $e$, this becomes

$K_{ij}^e=p_e|e|\,\nabla\varphi_j^e\cdot\nabla\varphi_i^e.$

If a zero-order term $q(x)u$ is present, then a mass-type contribution appears:

$M_{ij}^e=\int_eq(x)\varphi_j^e\varphi_i^e\,dx.$

The element contribution is then

$K_{ij}^e+M_{ij}^e.$

## 29. Treatment of boundary conditions

For homogeneous Dirichlet conditions, the boundary degrees of freedom are set to zero. Equivalently, one chooses the finite element space $S_h^0\subset H_0^1(\Omega)$ whose basis functions vanish on the boundary.

For nonhomogeneous Dirichlet conditions, one typically writes

$u_h=w_h+g_h,$

where $g_h$ interpolates the boundary data and $w_h\in S_h^0$.

For Neumann boundary conditions, the boundary term from integration by parts does not vanish. It contributes an additional term to the load vector:

$\int_{\Gamma_N}g_Nv_h\,ds.$

## 30. Algorithmic summary of the finite element method

1. Start with the strong differential equation and boundary conditions.
2. Multiply by a test function.
3. Integrate by parts to obtain the weak form.
4. Choose a finite-dimensional space $S_h$.
5. Choose nodal basis functions $\varphi_i$.
6. Write $u_h=\sum_iU_i\varphi_i$.
7. Compute local element matrices and local load vectors.
8. Assemble the global matrix $K$ and vector $F$.
9. Impose boundary conditions.
10. Solve $KU=F$.
11. Use interpolation estimates and Cea's lemma to estimate the error.

## 31. Main conclusions

The weak formulation is well posed because the bilinear form is continuous and coercive. The Galerkin method inherits this stability. Galerkin orthogonality gives the key error identity. Cea's lemma reduces the finite element error estimate to a best-approximation estimate. For linear finite elements on shape-regular meshes,

$\|u-u_h\|_{H^1(\Omega)}\le Ch|u|_{H^2(\Omega)},$

and, under the usual duality assumptions,

$\|u-u_h\|_{L_2(\Omega)}\le Ch^2|u|_{H^2(\Omega)}.$

These are the standard first-order and second-order convergence estimates for piecewise linear finite elements.
