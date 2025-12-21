#!/bin/bash

# 1. Start the README and create the "Recent" section
printf "# Coyote Math Task Index\n\n" > README.md
printf "## Recent Updates\n" >> README.md
# Lists the 5 most recently modified .md files (excluding README itself)
ls -t *.md | grep -v "README.md" | head -5 | sed 's/\(.*\)/- [\1](\1)/' >> README.md
printf "\n---\n\n" >> README.md

# 2. Add your grouped categories
printf "## 1. Orthogonal Polynomials\n\n" >> README.md
printf "### Jacobi & Legendre\n\n" >> README.md
printf "* {Jacobi: Local Maxima}<027f10a7.md>\n" >> README.md
printf "* {Jacobi: Alpha1, Beta0}<69425b5f.md>\n" >> README.md
printf "* {Legendre: a > 1}<2d61fb16.md>\n" >> README.md
printf "* {Legendre: Recurrence}<91608bdd.md>\n" >> README.md
printf "* {Jacobi Family Check}<e75e5639.md>\n\n" >> README.md

printf "### Hermite\n\n" >> README.md
printf "* {Hermite: Modified Weight}<076ef56b.md>\n" >> README.md
printf "* {Hermite: Physicist Claims}<18942427.md>\n" >> README.md
printf "* {Hermite: Standard}<3fc90f09.md>\n" >> README.md
printf "* {Hermite: Real Line}<f6e16472.md>\n" >> README.md
printf "* {Hermite: Generating Function}<07a8cfcf.md>\n\n" >> README.md

printf "### Laguerre\n\n" >> README.md
printf "* {Laguerre: Weight Modification}<5dd03fbd.md>\n" >> README.md
printf "* {Laguerre: Integral L3 L2}<0526785f.md>\n" >> README.md
printf "* {Laguerre: Integral Ratio}<dd5e2fc5.md>\n" >> README.md
printf "* {Laguerre: Parameter Alpha 3}<6c96b851.md>\n" >> README.md
printf "* {Laguerre: Integral L6 L2}<7c563c4e.md>\n" >> README.md
printf "* {Laguerre: Integral L3 L5}<e724070a.md>\n\n" >> README.md

printf "### Racah & Hahn\n\n" >> README.md
printf "* {Racah: Continuous Argument}<31001068.md>\n" >> README.md
printf "* {Racah: Matrix Hermiticity}<bd24c6fc.md>\n" >> README.md
printf "* {Racah: Difference Equation}<c617c526.md>\n" >> README.md
printf "* {Hahn Polynomial Roots}<2f5da8d9.md>\n\n" >> README.md

printf "## 2. Quantum Mechanics (Angular Momentum)\n\n" >> README.md
printf "* {Clebsch-Gordan: Phase Shift}<3c1c8b15.md>\n" >> README.md
printf "* {Clebsch-Gordan: Admissible Zeros}<4a8d987a.md>\n" >> README.md
printf "* {Clebsch-Gordan: Discrete Function}<a050c5dc.md>\n" >> README.md
printf "* {Clebsch-Gordan: Stretched Sector}<e81395f5.md>\n" >> README.md
printf "* {Clebsch-Gordan: Dual Hahn Relation}<f94b00ef.md>\n" >> README.md
printf "* {Clebsch-Gordan: Total Momentum}<de74e827.md>\n" >> README.md
printf "* {6j Symbol Evaluation}<fe4dc745.md>\n\n" >> README.md

printf "## 3. Differential Equations & Physics\n\n" >> README.md
printf "* {Sine-Gordon: DNA Overtwist}<34b8ebad.md>\n" >> README.md
printf "* {Sine-Gordon: Initial Phase 5pi/2}<7132b649.md>\n" >> README.md
printf "* {Sine-Gordon: Finite Energy Winding}<8fac80e9.md>\n" >> README.md
printf "* {Sine-Gordon: Josephson Junction}<989a8a47.md>\n" >> README.md
printf "* {Sine-Gordon: Ferroelectric Chain}<98a2ead0.md>\n" >> README.md
printf "* {Sine-Gordon: CDW Conductor}<b1b7ad37.md>\n" >> README.md
printf "* {Sine-Gordon: Scalar Field Rest}<d75ab6e0.md>\n" >> README.md
printf "* {Sine-Gordon: Frenkel-Kontorova}<de514810.md>\n" >> README.md
printf "* {Sine-Gordon: Superfluid Ring}<edbc87d5.md>\n" >> README.md
printf "* {Sine-Gordon: Coupled Pendula}<ee4bc277.md>\n" >> README.md
printf "* {Acoustic Duct Pressure}<2c968d24.md>\n" >> README.md
printf "* {Membrane Displacement}<2538fcdd.md>\n" >> README.md
printf "* {Newton cooling: Periodic}<dc2e0db2.md>\n\n" >> README.md

printf "## 4. Geometry & Topology\n\n" >> README.md
printf "* {Hyperbolic Area: Poincaré}<2deb9b93.md>\n" >> README.md
printf "* {Geodesic Curvature: Surface}<616131bf.md>\n" >> README.md
printf "* {Torus Geodesics: Unit Square}<6587534d.md>\n" >> README.md
printf "* {Geodesic Torsion: Intersection}<9129831b.md>\n" >> README.md
printf "* {Geodesic Torsion: x=1 Plane}<aad144ac.md>\n" >> README.md
printf "* {Geodesic Circle: Holonomy}<bca2a699.md>\n" >> README.md
printf "* {Torus: Rhombic Transport}<c7441c68.md>\n" >> README.md
printf "* {Torus: Voronoi Diagram}<a64df3e0.md>\n" >> README.md
printf "* {Poincaré Disk: Distance AB}<f14b7ce3.md>\n\n" >> README.md

printf "## 5. Calculus & Analysis\n\n" >> README.md
printf "* {Greatest Lower Bound: Sin}<45c7ef0e.md>\n" >> README.md
printf "* {Integral Limit: x^n/(1+x)}<b378c08c.md>\n" >> README.md
printf "* {Integral Limit: n^2/x^n}<bd4a59ea.md>\n" >> README.md
printf "* {Generating Function: Monic}<4dc6fb67.md>\n" >> README.md
printf "* {Christoffel-Darboux Kernel}<d72d16d6.md>\n" >> README.md

# 3. Format the README syntax (convert brackets to markdown links)
sed -i '' 's/{/[/g; s/}/]/g; s/</(/g; s/>/)/g' README.md

# 4. Standard Commit and Push
git add .
git commit -m "Update math index and recently changed files"
git push origin main