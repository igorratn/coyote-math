#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md

# 2. Recent Updates (Top Section)
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

# 3. Build Tree 1: Topic Classification
printf "## Tree 1: Classification by Topic\n\n" >> README.md

nu_names=(
    "Hypergeometric: Rodrigues & ODEs"
    "Jacobi & Legendre Polynomials"
    "Hermite & Laguerre Polynomials"
    "Discrete: Hahn & Racah"
    "Discrete: Clebsch-Gordan / 3j"
    "Geometry: Poincare & Metrics"
    "Geometry: Surfaces & Geodesics"
    "Physics: Waves & Vibrations"
    "Physics: Heat & Potential"
    "Asymptotics & Integral Transforms"
)

nu_pats=(
    "hypergeometric|Rodrigues|Bochner"
    "Jacobi|Legendre|Chebyshev"
    "Hermite|Laguerre"
    "Hahn|Racah"
    "Clebsch|3j|Wigner"
    "Poincare|metric|disk|upper half"
    "geodesic|curvature|torsion|surface"
    "membrane|acoustic|harmonic|vibration|sine-Gordon|equilibria|dynamics"
    "heat|temperature|potential|equilibrium"
    "Cauchy|second kind|Q_n|asymptotic|integral|limit|integrand"
)

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
    if [ -n "$links" ]; then
        printf "├── **%s** \n" "$name" >> README.md
        printf "│&nbsp;&nbsp;&nbsp;└── %s  \n" "$links" >> README.md
    fi
done

printf "\n---\n\n" >> README.md

# 4. Build Tree 2: Methodological Closeness
printf "## Tree 2: Classification by Methodological Closeness\n\n" >> README.md

close_names=(
    "Asymptotic Behavior & Limits"
    "Rigidity & Polynomial Identities"
    "Orthogonality & Inner Products"
    "Integral Kernels & Transforms"
)

close_pats=(
    "asymptotic|limit|O\(z|z \to \infty"
    "rigidity|constant|identical|degree <|Wronskian"
    "orthogonal|inner product|h_n|norm|p_n^2"
    "Cauchy|kernel|second kind|q_n\(z\)|transform"
)

# Reset: Tree 2 needs to see all files again
all_files=$(ls -1 *.md | grep -v "README.md")
printf "Root: Mathematical Machinery \n" >> README.md

for i in "${!close_names[@]}"; do
    name="${close_names[$i]}"
    pat="${close_pats[$i]}"
    links=""
    for file in $all_files; do
        if tail -n +1 "$file" | grep -qiE "$pat"; then
            id="${file%.md}"
            [ -z "$links" ] && links="[$id]($file)" || links="$links, [$id]($file)"
        fi
    done
    if [ -n "$links" ]; then
        if [ "$i" -eq $((${#close_names[@]}-1)) ]; then
            printf "└── **%s** \n" "$name" >> README.md
            printf "&nbsp;&nbsp;&nbsp;&nbsp;└── %s  \n" "$links" >> README.md
        else
            printf "├── **%s** \n" "$name" >> README.md
            printf "│&nbsp;&nbsp;&nbsp;└── %s  \n" "$links" >> README.md
        fi
    fi
done

# 5. Footer and Git Automation
file_count=$(ls -1 *.md | grep -v "README.md" | wc -l)
printf "\n---\n\n*Note: Total files indexed: %s. Recent titles and tree leaves are clickable links.*\n" "$file_count" >> README.md

git add .
git commit -m "Auto-index: Updated dual-tree README structure ($file_count files)"
git push origin main