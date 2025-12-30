#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md

# 2. Recent Updates
printf "## Recent Updates\n\n" >> README.md

clean_title() {
    echo "$1" | sed 's/\\text//g' | sed 's/[]()[]//g' | cut -c 1-80
}

ls -t *.md | grep -v "README.md" | head -n 5 | while read -r file; do
    raw_title=$(grep -vE '^\\|^#|^$' "$file" | head -n 1)
    TITLE=$(clean_title "$raw_title")
    printf "* %s ... [[%s]](%s)\n" "$TITLE" "$file" "$file" >> README.md
done
printf "\n---\n\n" >> README.md

# 3. Tree 1: Topic Classification (Unchanged)
printf "## Tree 1: Classification by Topic\n\n" >> README.md
nu_names=("Hypergeometric: Rodrigues & ODEs" "Jacobi & Legendre Polynomials" "Hermite & Laguerre Polynomials" "Discrete: Hahn & Racah" "Discrete: Clebsch-Gordan / 3j" "Geometry: Poincare & Metrics" "Geometry: Surfaces & Geodesics" "Physics: Waves & Vibrations" "Physics: Heat & Potential" "Asymptotics & Integral Transforms")
nu_pats=("hypergeometric|Rodrigues|Bochner" "Jacobi|Legendre|Chebyshev" "Hermite|Laguerre" "Hahn|Racah" "Clebsch|3j|Wigner" "Poincare|metric|disk|upper half" "geodesic|curvature|torsion|surface" "membrane|acoustic|harmonic|vibration|sine-Gordon|equilibria|dynamics" "heat|temperature|potential|equilibrium" "Cauchy|second kind|Q_n|asymptotic|integral|limit|integrand")

unassigned_files=$(ls -1 *.md | grep -v "README.md")
printf "Root: Special Functions & Geometry  \n" >> README.md
for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    links=""
    still_unassigned=""
    for file in $unassigned_files; do
        if grep -qiE "$pat" "$file"; then
            id="${file%.md}"
            [ -z "$links" ] && links="[$id]($file)" || links="$links, [$id]($file)"
        else
            still_unassigned="$still_unassigned $file"
        fi
    done
    unassigned_files=$still_unassigned
    [ -n "$links" ] && printf "├── **%s** \n&nbsp;&nbsp;&nbsp;&nbsp;└── %s  \n" "$name" "$links" >> README.md
done

printf "\n---\n\n" >> README.md

# 4. Tree 2: Fine-Grained Logical Closeness
# RESET: We scan all files again to find similarities in proof logic
printf "## Tree 2: Closeness by Theorem & Logic\n\n" >> README.md

# Each name is a "Cluster of Logic"
# Each pattern is a "Fingerprint" of that logic
logic_names=(
    "Asymptotic Decay & Limits"
    "Polynomial Rigidity (Constant Identities)"
    "Orthogonality & Projections"
    "Integral Kernels (Hilbert/Cauchy)"
    "Norms & Squared Integrals"
)

logic_pats=(
    "z \\to \\infty|O\(z|decay|z\^-"
    "constant|W_n|rigidity|identical|Wronskian"
    "t\^k|orthogonal|vanishing|p_n.*p_m"
    "z-t|kernel|q_n|second kind"
    "h_n|norm|p_n\^2"
)

all_files=$(ls -1 *.md | grep -v "README.md")
printf "Root: Methodological Closeness \n" >> README.md

for i in "${!logic_names[@]}"; do
    name="${logic_names[$i]}"
    pat="${logic_pats[$i]}"
    links=""
    
    for file in $all_files; do
        # Check if the file contains the logic signature
        if grep -qiE "$pat" "$file"; then
            id="${file%.md}"
            [ -z "$links" ] && links="[$id]($file)" || links="$links, [$id]($file)"
        fi
    done

    if [ -n "$links" ]; then
        if [ "$i" -eq $((${#logic_names[@]}-1)) ]; then
            printf "└── **%s** \n&nbsp;&nbsp;&nbsp;&nbsp;└── %s  \n" "$name" "$links" >> README.md
        else
            printf "├── **%s** \n│&nbsp;&nbsp;&nbsp;└── %s  \n" "$name" "$links" >> README.md
        fi
    fi
done

# 5. Footer and Push
file_count=$(ls -1 *.md | grep -v "README.md" | wc -l)
printf "\n---\n\n*Note: Total files indexed: %s.*\n" "$file_count" >> README.md

git add .
git commit -m "Auto-index: Rebuilt logic tree for fine-grained clustering"
git push origin main