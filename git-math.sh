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

# 3. Tree 1: Topic Classification (Original logic)
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

# 4. Tree 2: Fine-Grained Closeness (Proof Machinery)
# We use -F (fixed strings) to find exact math matches
printf "## Tree 2: Logical Closeness (Theorem Machinery)\n\n" >> README.md

# Closeness based on the logic we just used for Legendre Q_n
logic_names=("Limit Matching (z -> inf)" "Constant Wronskians" "Orthogonal Projection" "Integral Kernels" "Norms (h_n)")
# These exact strings are what we used in our proof
logic_keys=("z \to \infty" "W_n(z)" "t^k" "1/(z-t)" "h_n")

all_files=$(ls -1 *.md | grep -v "README.md")
printf "Root: Shared Proof Logic \n" >> README.md

for i in "${!logic_names[@]}"; do
    name="${logic_names[$i]}"
    key="${logic_keys[$i]}"
    links=""
    for file in $all_files; do
        # Use -F to find the literal math string
        if grep -qF "$key" "$file"; then
            id="${file%.md}"
            [ -z "$links" ] && links="[$id]($file)" || links="$links, [$id]($file)"
        fi
    done
    if [ -n "$links" ]; then
        printf "├── **%s** \n│&nbsp;&nbsp;&nbsp;└── %s  \n" "$name" "$links" >> README.md
    fi
done

# 5. Footer and Automation
file_count=$(ls -1 *.md | grep -v "README.md" | wc -l)
printf "\n---\n\n*Note: Tree 2 uses logical fingerprints to show shared methodology.*\n" >> README.md

git add .
git commit -m "Auto-index: Fine-grained methodology tree ($file_count files)"
git push origin main