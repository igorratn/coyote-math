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
        if tail -n +1 "$file" | grep -qiE "$pat"; then
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

# 4. Build Tree 2: Logical Closeness (Theorem-Based)
printf "## Tree 2: Logical Closeness (Proof Machinery)\n\n" >> README.md

logic_names=(
    "Asymptotic Expansion (z -> inf)"
    "Polynomial Rigidity (Constant W_n)"
    "Orthogonality & Basis Projections"
    "Integral Kernels (Second Kind)"
    "Norms & Squared Integrals (h_n)"
)

logic_pats=(
    "O\(z|z \\to \\infty|leading term|decay"
    "rigidity|constant|W_n|Wronskian|P(z) \\equiv"
    "t\^k|orthogonal|degree < n|vanishing|p_j p_n"
    "1\/z-t|kernel|q_n|second kind|fraction inside"
    "h_n|norm|p_n\^2|integral.*p_n"
)

# Reset: Tree 2 scans all files again
all_files=$(ls -1 *.md | grep -v "README.md")
printf "Root: Shared Mathematical Logic \n" >> README.md

for i in "${!logic_names[@]}"; do
    name="${logic_names[$i]}"
    pat="${logic_pats[$i]}"
    links=""
    for file in $all_files; do
        # Use -E for extended regex to handle \( and \^ properly
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

# 5. Footer
file_count=$(ls -1 *.md | grep -v "README.md" | wc -l)
printf "\n---\n\n*Note: Total files indexed: %s. Logic tree allows overlapping assignments.*\n" "$file_count" >> README.md

git add .
git commit -m "Auto-index: Refined logical closeness tree ($file_count files)"
git push origin main