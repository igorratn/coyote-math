#!/bin/bash

# 1. Initialize README
printf "# Coyote Math Task Index\n\n" > README.md

# 2. Recent Updates
printf "## Recent Updates\n\n" >> README.md
clean_title() { echo "$1" | sed 's/\\text//g' | sed 's/[]()[]//g' | cut -c 1-80; }
ls -t *.md | grep -v "README.md" | head -n 5 | while read -r file; do
    raw_title=$(grep -vE '^\\|^#|^$' "$file" | head -n 1)
    TITLE=$(clean_title "$raw_title")
    printf "* %s ... [[%s]](%s)\n" "$TITLE" "$file" "$file" >> README.md
done
printf "\n---\n\n" >> README.md

# 3. Tree 1: Topic Classification (Kept for reference)
printf "## Tree 1: Classification by Topic\n\n" >> README.md
nu_names=("Hypergeometric" "Jacobi & Legendre" "Hermite & Laguerre" "Discrete" "Clebsch-Gordan" "Geometry" "Physics" "Asymptotics")
nu_pats=("hypergeometric" "Jacobi|Legendre" "Hermite|Laguerre" "Hahn|Racah" "Clebsch|3j" "Poincare|metric" "vibration|potential" "q_n|asymptotic|limit")

unassigned_files=$(ls -1 *.md | grep -v "README.md")
for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"; pat="${nu_pats[$i]}"; links=""; still_unassigned=""
    for file in $unassigned_files; do
        if grep -qiE "$pat" "$file"; then
            id="${file%.md}"; [ -z "$links" ] && links="[$id]($file)" || links="$links, [$id]($file)"
        else still_unassigned="$still_unassigned $file"; fi
    done
    unassigned_files=$still_unassigned
    [ -n "$links" ] && printf "├── **%s** \n&nbsp;&nbsp;&nbsp;&nbsp;└── %s  \n" "$name" "$links" >> README.md
done

printf "\n---\n\n" >> README.md

# 4. Tree 2: Fine-Grained Closeness (Fuzzy Logic)
printf "## Tree 2: Logical Closeness (Theorem Machinery)\n\n" >> README.md

# We use Extended Regex (|) to catch different ways the same logic is written
logic_names=(
    "Asymptotic Decay (z -> inf)"
    "Polynomial Rigidity (Wronskians)"
    "Orthogonality & Basis Projections"
    "Integral Kernels (Hilbert/Cauchy)"
    "Norms & Squared Integrals"
)

logic_pats=(
    "z.*to.*inf|z.*rightarrow.*inf|O\(z|decay"
    "W_n|Wronskian|constant|identical|rigidity"
    "t\^k|orthogonal|basis|degree|projection"
    "1\/z-t|kernel|q_n|second kind|Cauchy"
    "h_n|norm|p_n\^2|integral.*p_n"
)

all_files=$(ls -1 *.md | grep -v "README.md")
printf "Root: Shared Proof Logic \n" >> README.md

for i in "${!logic_names[@]}"; do
    name="${logic_names[$i]}"
    pat="${logic_pats[$i]}"
    links=""
    for file in $all_files; do
        # We use -E for extended regex to catch any of the variations in the pattern
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
printf "\n---\n\n*Note: Tree 2 uses fuzzy matching on proof signatures to reveal methodological closeness.*\n" >> README.md

git add .
git commit -m "Auto-index: Expanded fuzzy logic tree ($file_count files)"
git push origin main