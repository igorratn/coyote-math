# Linear Algebra — Complete Reference for RLHF Evaluation

## 1. Vector Spaces

### Definition

A **vector space** $V$ over a field $\mathbb{F}$ (typically $\mathbb{R}$ or $\mathbb{C}$) is a set with two operations:
- **Addition:** $u + v \in V$ for all $u, v \in V$
- **Scalar multiplication:** $\alpha v \in V$ for all $\alpha \in \mathbb{F}$, $v \in V$

Satisfying 8 axioms: associativity, commutativity, identity, inverses, distributivity, etc.

### Subspaces

$W \subseteq V$ is a **subspace** if:
1. $0 \in W$
2. Closed under addition: $u, v \in W \Rightarrow u + v \in W$
3. Closed under scalar multiplication: $v \in W, \alpha \in \mathbb{F} \Rightarrow \alpha v \in W$

**Equivalent:** $W$ is a subspace iff $\alpha u + \beta v \in W$ for all $u, v \in W$ and $\alpha, \beta \in \mathbb{F}$.

### Linear Independence

Vectors $v_1, \ldots, v_n$ are **linearly independent** if:
$$\alpha_1 v_1 + \cdots + \alpha_n v_n = 0 \implies \alpha_1 = \cdots = \alpha_n = 0$$

Otherwise they are **linearly dependent**.

### Basis and Dimension

A **basis** of $V$ is a linearly independent set that spans $V$.

**Theorem:** All bases of a finite-dimensional vector space have the same number of elements.

The **dimension** $\dim(V)$ is the number of vectors in any basis.

**Key facts:**
- If $\dim(V) = n$ and $S$ has $n$ linearly independent vectors, then $S$ is a basis
- If $\dim(V) = n$ and $S$ spans $V$ with $n$ vectors, then $S$ is a basis

---

## 2. Linear Transformations

### Definition

$T: V \to W$ is a **linear transformation** if:
1. $T(u + v) = T(u) + T(v)$ for all $u, v \in V$
2. $T(\alpha v) = \alpha T(v)$ for all $\alpha \in \mathbb{F}$, $v \in V$

**Equivalent:** $T(\alpha u + \beta v) = \alpha T(u) + \beta T(v)$

### Kernel and Image

- **Kernel (null space):** $\ker(T) = \{v \in V : T(v) = 0\}$
- **Image (range):** $\text{Im}(T) = \{T(v) : v \in V\} = \{w \in W : w = T(v) \text{ for some } v \in V\}$

**Key theorem:** $\ker(T)$ is a subspace of $V$, and $\text{Im}(T)$ is a subspace of $W$.

### Rank-Nullity Theorem

$$\boxed{\dim(\ker(T)) + \dim(\text{Im}(T)) = \dim(V)}$$

Also written as: $\text{nullity}(T) + \text{rank}(T) = \dim(V)$

**Consequence:** For $T: V \to V$ where $\dim(V) = n$:
- $T$ injective $\iff$ $T$ surjective $\iff$ $T$ bijective

### Matrix Representation

Given bases for $V$ and $W$, any linear transformation $T: V \to W$ can be represented by a matrix $[T]$.

If $\dim(V) = n$ and $\dim(W) = m$, then $[T]$ is an $m \times n$ matrix.

---

## 3. Eigenvalues and Eigenvectors

### Definitions

Let $T: V \to V$ be a linear operator.

- $\lambda \in \mathbb{F}$ is an **eigenvalue** of $T$ if there exists nonzero $v \in V$ such that $T(v) = \lambda v$
- Such $v$ is called an **eigenvector** corresponding to $\lambda$
- The **eigenspace** $E_\lambda = \ker(T - \lambda I) = \{v : T(v) = \lambda v\}$

For matrices: $A v = \lambda v$ where $v \neq 0$.

### Characteristic Polynomial

For an $n \times n$ matrix $A$:
$$p_A(\lambda) = \det(A - \lambda I)$$

**Theorem:** $\lambda$ is an eigenvalue of $A$ iff $p_A(\lambda) = 0$.

The characteristic polynomial has degree $n$, so $A$ has at most $n$ eigenvalues (counting multiplicity).

### Algebraic vs. Geometric Multiplicity

- **Algebraic multiplicity** of $\lambda$: multiplicity as a root of $p_A(\lambda)$
- **Geometric multiplicity** of $\lambda$: $\dim(E_\lambda) = \dim(\ker(A - \lambda I))$

$$\boxed{1 \leq \text{geometric multiplicity} \leq \text{algebraic multiplicity}}$$

### Diagonalization

A matrix $A$ is **diagonalizable** if there exists invertible $P$ and diagonal $D$ such that:
$$A = PDP^{-1}$$

**Theorem:** $A$ is diagonalizable iff the geometric multiplicity equals the algebraic multiplicity for every eigenvalue.

**Equivalent:** $A$ is diagonalizable iff $V$ has a basis of eigenvectors of $A$.

**Sufficient condition:** If $A$ has $n$ distinct eigenvalues, then $A$ is diagonalizable.

---

## 4. Inner Product Spaces

### Definition

An **inner product** on a real vector space $V$ is a function $\langle \cdot, \cdot \rangle: V \times V \to \mathbb{R}$ satisfying:
1. **Linearity:** $\langle \alpha u + \beta v, w \rangle = \alpha \langle u, w \rangle + \beta \langle v, w \rangle$
2. **Symmetry:** $\langle u, v \rangle = \langle v, u \rangle$
3. **Positive definiteness:** $\langle v, v \rangle \geq 0$ with equality iff $v = 0$

For complex vector spaces, replace symmetry with **conjugate symmetry:** $\langle u, v \rangle = \overline{\langle v, u \rangle}$.

### Norm and Distance

From inner product:
- **Norm:** $\|v\| = \sqrt{\langle v, v \rangle}$
- **Distance:** $d(u, v) = \|u - v\|$

### Cauchy-Schwarz Inequality

$$\boxed{|\langle u, v \rangle| \leq \|u\| \|v\|}$$

Equality holds iff $u$ and $v$ are linearly dependent.

### Orthogonality

- Vectors $u, v$ are **orthogonal** if $\langle u, v \rangle = 0$
- A set $\{v_1, \ldots, v_n\}$ is **orthogonal** if $\langle v_i, v_j \rangle = 0$ for $i \neq j$
- It's **orthonormal** if additionally $\|v_i\| = 1$ for all $i$

**Theorem:** Orthogonal sets are linearly independent (if no vector is zero).

### Gram-Schmidt Process

Given linearly independent vectors $\{v_1, \ldots, v_n\}$, construct orthonormal basis $\{e_1, \ldots, e_n\}$:

1. $e_1 = \frac{v_1}{\|v_1\|}$
2. For $k = 2, \ldots, n$:
   $$u_k = v_k - \sum_{j=1}^{k-1} \langle v_k, e_j \rangle e_j$$
   $$e_k = \frac{u_k}{\|u_k\|}$$

### Orthogonal Projection

The **orthogonal projection** of $v$ onto subspace $W$ with orthonormal basis $\{e_1, \ldots, e_k\}$ is:
$$\text{proj}_W(v) = \sum_{i=1}^k \langle v, e_i \rangle e_i$$

The **orthogonal complement** $W^\perp = \{v \in V : \langle v, w \rangle = 0 \text{ for all } w \in W\}$.

**Theorem:** $V = W \oplus W^\perp$ (direct sum decomposition).

---

## 5. Special Matrices and Operators

### Symmetric Matrices (Real)

$A$ is **symmetric** if $A^T = A$.

**Spectral Theorem (Real Symmetric):** If $A$ is real symmetric, then:
1. All eigenvalues are real
2. Eigenvectors from different eigenspaces are orthogonal
3. $A$ is orthogonally diagonalizable: $A = QDQ^T$ where $Q$ is orthogonal

### Hermitian Matrices (Complex)

$A$ is **Hermitian** if $A^* = A$ (where $A^* = \overline{A^T}$).

**Spectral Theorem (Hermitian):** Same properties as real symmetric, but with unitary $U$: $A = UDU^*$.

### Orthogonal and Unitary Matrices

- $Q$ is **orthogonal** if $Q^T Q = I$ (equivalently $Q^{-1} = Q^T$)
- $U$ is **unitary** if $U^* U = I$ (equivalently $U^{-1} = U^*$)

**Properties:**
- Orthogonal/unitary matrices preserve inner products and norms
- All eigenvalues have absolute value 1
- Determinant has absolute value 1

### Positive Definite Matrices

$A$ is **positive definite** if:
1. $A$ is symmetric (or Hermitian)
2. $\langle Av, v \rangle > 0$ for all $v \neq 0$

**Equivalent conditions:**
- All eigenvalues are positive
- All leading principal minors are positive
- $A = B^T B$ for some invertible $B$

### Normal Matrices

$A$ is **normal** if $AA^* = A^*A$.

**Spectral Theorem (Normal):** $A$ is unitarily diagonalizable iff $A$ is normal.

**Examples of normal matrices:** Hermitian, unitary, skew-Hermitian.

---

## 6. Matrix Decompositions

### Singular Value Decomposition (SVD)

For any $m \times n$ matrix $A$:
$$A = U\Sigma V^*$$

where:
- $U$ is $m \times m$ unitary (orthogonal if real)
- $\Sigma$ is $m \times n$ diagonal with $\sigma_1 \geq \sigma_2 \geq \cdots \geq \sigma_r > 0$ (singular values)
- $V$ is $n \times n$ unitary (orthogonal if real)

**Key facts:**
- Singular values are $\sigma_i = \sqrt{\lambda_i(A^*A)}$
- $\text{rank}(A) = r$ (number of nonzero singular values)
- Columns of $U$ are eigenvectors of $AA^*$
- Columns of $V$ are eigenvectors of $A^*A$

### QR Decomposition

For $m \times n$ matrix $A$ with $m \geq n$ and full column rank:
$$A = QR$$

where:
- $Q$ is $m \times n$ with orthonormal columns
- $R$ is $n \times n$ upper triangular with positive diagonal

**Use:** Solving least squares, computing eigenvalues (QR algorithm).

### LU Decomposition

For square matrix $A$ (under certain conditions):
$$A = LU$$

where:
- $L$ is lower triangular with 1s on diagonal
- $U$ is upper triangular

**Use:** Solving linear systems efficiently.

### Cholesky Decomposition

For positive definite matrix $A$:
$$A = LL^*$$

where $L$ is lower triangular with positive diagonal.

**Use:** Efficient for solving systems when $A$ is known to be positive definite.

---

## 7. Determinants and Traces

### Determinant

For $n \times n$ matrix $A$:

**Properties:**
- $\det(AB) = \det(A)\det(B)$
- $\det(A^T) = \det(A)$
- $\det(A^{-1}) = 1/\det(A)$ if $A$ is invertible
- $\det(\alpha A) = \alpha^n \det(A)$
- $\det(A) = \prod_{i=1}^n \lambda_i$ (product of eigenvalues)

**Geometric meaning:** Signed volume scaling factor.

### Trace

$$\text{tr}(A) = \sum_{i=1}^n a_{ii}$$

**Properties:**
- $\text{tr}(A + B) = \text{tr}(A) + \text{tr}(B)$
- $\text{tr}(\alpha A) = \alpha \text{tr}(A)$
- $\text{tr}(AB) = \text{tr}(BA)$ (cyclic property)
- $\text{tr}(A) = \sum_{i=1}^n \lambda_i$ (sum of eigenvalues)
- $\text{tr}(A^*A) = \sum_{i,j} |a_{ij}|^2$ (Frobenius norm squared)

---

## 8. Linear Systems and Least Squares

### Solving $Ax = b$

**Cases:**
1. **Unique solution:** $A$ invertible (full rank, square)
2. **No solution:** $b \notin \text{Im}(A)$ (inconsistent system)
3. **Infinitely many solutions:** $\ker(A) \neq \{0\}$ (underdetermined)

### Least Squares

When $Ax = b$ has no exact solution, find $x$ minimizing $\|Ax - b\|^2$.

**Normal equations:** $A^*Ax = A^*b$

**Solution:** $x = (A^*A)^{-1}A^*b$ (if $A^*A$ is invertible)

The matrix $A^\dagger = (A^*A)^{-1}A^*$ is the **Moore-Penrose pseudoinverse** (when $A$ has full column rank).

### Four Fundamental Subspaces

For $m \times n$ matrix $A$:
1. **Column space:** $\text{Im}(A) \subseteq \mathbb{C}^m$, dimension $r = \text{rank}(A)$
2. **Row space:** $\text{Im}(A^*) \subseteq \mathbb{C}^n$, dimension $r$
3. **Null space:** $\ker(A) \subseteq \mathbb{C}^n$, dimension $n - r$
4. **Left null space:** $\ker(A^*) \subseteq \mathbb{C}^m$, dimension $m - r$

**Fundamental theorem:**
- $\mathbb{C}^n = \text{Im}(A^*) \oplus \ker(A)$
- $\mathbb{C}^m = \text{Im}(A) \oplus \ker(A^*)$

---

## 9. Norms and Matrix Analysis

### Vector Norms

A **norm** on $V$ is a function $\|\cdot\|: V \to \mathbb{R}$ satisfying:
1. $\|v\| \geq 0$ with equality iff $v = 0$
2. $\|\alpha v\| = |\alpha| \|v\|$
3. $\|u + v\| \leq \|u\| + \|v\|$ (triangle inequality)

**Common norms on $\mathbb{C}^n$:**
- $\|x\|_1 = \sum_{i=1}^n |x_i|$
- $\|x\|_2 = \sqrt{\sum_{i=1}^n |x_i|^2}$ (Euclidean)
- $\|x\|_\infty = \max_{i} |x_i|$
- $\|x\|_p = \left(\sum_{i=1}^n |x_i|^p\right)^{1/p}$

### Matrix Norms

**Induced (operator) norm:**
$$\|A\| = \sup_{x \neq 0} \frac{\|Ax\|}{\|x\|}$$

**Common matrix norms:**
- **Spectral norm (2-norm):** $\|A\|_2 = \sigma_{\max}(A)$ (largest singular value)
- **Frobenius norm:** $\|A\|_F = \sqrt{\sum_{i,j} |a_{ij}|^2} = \sqrt{\text{tr}(A^*A)}$
- **Max norm:** $\|A\|_{\max} = \max_{i,j} |a_{ij}|$

**Submultiplicativity:** $\|AB\| \leq \|A\| \|B\|$ (for induced norms)

### Condition Number

For invertible matrix $A$:
$$\kappa(A) = \|A\| \|A^{-1}\|$$

**Interpretation:** Measures sensitivity of $Ax = b$ to perturbations in $A$ or $b$.

- $\kappa(A) \geq 1$ always
- $\kappa(A) = 1$ iff $A$ is unitary/orthogonal (for spectral norm)
- Large $\kappa(A)$ means ill-conditioned (numerical instability)

---

## 10. Key Traps for AI Models

### Eigenvalue/Eigenvector Errors
1. ✗ Claiming diagonalizable without checking geometric = algebraic multiplicity
2. ✗ Assuming all matrices are diagonalizable
3. ✗ Confusing eigenvalues of $A$ with those of $A^{-1}$, $A^T$, $A + \alpha I$
4. ✗ Claiming eigenvectors from same eigenspace are orthogonal (only true for normal matrices)

### Rank-Nullity Errors
5. ✗ Misapplying rank-nullity theorem (wrong dimension counted)
6. ✗ Claiming $T$ injective and surjective for different dimensional spaces
7. ✗ Forgetting that $\text{rank}(AB) \leq \min(\text{rank}(A), \text{rank}(B))$

### Inner Product Errors
8. ✗ Applying Cauchy-Schwarz incorrectly (wrong spaces, missing absolute value)
9. ✗ Claiming orthogonal vectors are linearly dependent
10. ✗ Forgetting conjugate in complex inner products

### Spectral Theorem Errors
11. ✗ Applying spectral theorem to non-symmetric/non-Hermitian matrices
12. ✗ Claiming all eigenvectors are orthogonal (only for normal matrices)
13. ✗ Assuming symmetric implies positive definite

### Decomposition Errors
14. ✗ Confusing existence conditions for LU, QR, Cholesky, SVD
15. ✗ Claiming SVD only exists for square matrices
16. ✗ Incorrectly relating singular values to eigenvalues

### Determinant/Trace Errors
17. ✗ Writing $\det(A + B) = \det(A) + \det(B)$ (FALSE!)
18. ✗ Forgetting cyclic property of trace
19. ✗ Claiming $\text{tr}(AB) = \text{tr}(A)\text{tr}(B)$ (FALSE!)

### Subspace Errors
20. ✗ Forgetting to verify closure under addition/scalar multiplication
21. ✗ Claiming intersection of subspaces is not a subspace
22. ✗ Misunderstanding direct sum vs. union

### Basis/Dimension Errors
23. ✗ Claiming linearly independent set of size $n$ in $n$-dimensional space spans without verification
24. ✗ Forgetting that basis must both span AND be linearly independent

---

## 11. Template Problems

### Problem 1: Diagonalization Trap

**Problem:** Let $A = \begin{pmatrix} 2 & 1 \\ 0 & 2 \end{pmatrix}$. Is $A$ diagonalizable?

**Common mistake:** "The characteristic polynomial is $p(\lambda) = (\lambda - 2)^2$, so $\lambda = 2$ is an eigenvalue. Since we can find eigenvectors, $A$ is diagonalizable."

**Error:** Didn't check geometric vs. algebraic multiplicity.
- Algebraic multiplicity of $\lambda = 2$: 2
- $E_2 = \ker(A - 2I) = \ker\begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} = \text{span}\left\{\begin{pmatrix} 1 \\ 0 \end{pmatrix}\right\}$
- Geometric multiplicity: 1

Since $1 < 2$, matrix is **NOT diagonalizable**.

### Problem 2: Rank-Nullity Application

**Problem:** Let $T: \mathbb{R}^5 \to \mathbb{R}^3$ be linear with $\text{rank}(T) = 3$. Is $T$ surjective? Injective?

**Solution:**
- $\dim(\ker(T)) = \dim(\mathbb{R}^5) - \text{rank}(T) = 5 - 3 = 2$
- $\ker(T) \neq \{0\}$, so $T$ is **NOT injective**
- $\dim(\text{Im}(T)) = 3 = \dim(\mathbb{R}^3)$, so $T$ is **surjective**

**Common mistake:** Claiming $T$ is injective because it's surjective.

### Problem 3: Orthogonality Without Normality

**Problem:** Let $A$ be a real matrix with eigenvalues $\lambda_1 = 1$, $\lambda_2 = 2$ and corresponding eigenvectors $v_1$, $v_2$. Are $v_1$ and $v_2$ orthogonal?

**Answer:** **Not necessarily.** Only if $A$ is normal (e.g., symmetric).

**Counterexample:** $A = \begin{pmatrix} 1 & 1 \\ 0 & 2 \end{pmatrix}$ has eigenvalues 1, 2 but eigenvectors are not orthogonal.

---

## 12. RLHF Evaluation Strategy

When evaluating AI-generated linear algebra proofs:

1. **Check diagonalizability carefully:** Is geometric = algebraic multiplicity verified?

2. **Verify rank-nullity applications:** Are dimensions computed correctly?

3. **Watch for spectral theorem misuse:** Is the matrix actually symmetric/Hermitian/normal?

4. **Check orthogonality claims:** Does the matrix satisfy conditions for orthogonal eigenvectors?

5. **Verify basis claims:** Is both spanning AND linear independence checked?

6. **Look for determinant/trace errors:** Are properties like $\det(A+B) \neq \det(A) + \det(B)$ respected?

7. **Check decomposition existence:** Does the matrix satisfy conditions for the claimed decomposition?

8. **Verify subspace properties:** Are all three closure properties checked?

---

**End of Linear Algebra Reference Document**
