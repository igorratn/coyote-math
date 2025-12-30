#!/bin/bash

# 1. start readme
printf "# Coyote Math Task Index\n\n" > README.md

# 2. recent updates
printf "## Recent Updates\n\n" >> README.md
clean_title() { echo "$1" | sed 's/\\text//g' | sed 's/[]()[]//g' | cut -c 1-80; }
ls -t *.md | grep -v "README.md" | grep -v "all.md" | head -n 5 | while read -r file; do
    raw_title=$(grep -vE '^\\|^#|^$' "$file" | head -n 1)
    TITLE=$(clean_title "$raw_title")
    printf "* %s ... [[%s]](%s)\n" "$TITLE" "$file" "$file" >> README.md
done
printf "\n---\n\n" >> README.md

# 3. tree 1: classification by topic
printf "## Tree 1: Classification by Topic\n\n" >> README.md
nu_names=("Hypergeometric" "Jacobi & Legendre" "Hermite & Laguerre" "Discrete" "Clebsch-Gordan" "Geometry" "Physics" "Asymptotics")
nu_pats=("hypergeometric" "Jacobi|Legendre" "Hermite|Laguerre" "Hahn|Racah" "Clebsch|3j" "Poincare|metric" "vibration|potential" "q_n|asymptotic|limit")

unassigned_files=$(ls -1 *.md | grep -v "README.md" | grep -v "all.md")
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

# 4. tree 2: semantic strategy (fine-grained proof dna)
printf "## Tree 2: Semantic Strategy & Proof DNA\n\n" >> README.md
printf "Root: Methodological Strategy \n" >> README.md

all_files=$(ls -1 *.md | grep -v "README.md" | grep -v "all.md")

# cluster 1: nikiforov-uvarov eq. 7 asymptotics
# targets the specific use of QnNU, dn2, an, and rho
links_nu_7=$(grep -liE "QnNU|dn2/an|z.*notin.*a,b" $all_files | sed 's/\.md//' | xargs -I{} echo "[{}]({}.md)" | paste -sd ", " -)
if [ -n "$links_nu_7" ]; then
    printf "├── **Nikiforov-Uvarov: Second Kind Asymptotics (Eq. 7)** \n" >> README.md
    printf "│&nbsp;&nbsp;&nbsp;└── %s  \n" "$links_nu_7" >> README.md
fi

# cluster 2: nikiforov-uvarov section 7
# targets auxiliary functions v(x) and local maxima estimates
links_nu_est=$(grep -liE "auxiliary function|v\(x\)|NU.*Section 7" $all_files | sed 's/\.md//' | xargs -I{} echo "[{}]({}.md)" | paste -sd ", " -)
if [ -n "$links_nu_est" ]; then
    printf "├── **Nikiforov-Uvarov: Auxiliary Functions & Estimates (§7)** \n" >> README.md
    printf "│&nbsp;&nbsp;&nbsp;└── %s  \n" "$links_nu_est" >> README.md
fi

# cluster 3: polynomial rigidity
# targets proofs where functions are shown to be constant via wronskians
links_rigidity=$(grep -liE "W_n\(z\)|Wronskian|constant|bounded.*polynomial" $all_files | sed 's/\.md//' | xargs -I{} echo "[{}]({}.md)" | paste -sd ", " -)
if [ -n "$links_rigidity" ]; then
    printf "├── **Polynomial Rigidity: Wronskian & Liouville Logic** \n" >> README.md
    printf "│&nbsp;&nbsp;&nbsp;└── %s  \n" "$links_rigidity" >> README.md
fi

# cluster 4: physical stability
# targets energy barriers and relaxation dynamics
links_dynamics=$(grep -liE "barrier|hilltop|relaxation|sine-Gordon" $all_files | sed 's/\.md//' | xargs -I{} echo "[{}]({}.md)" | paste -sd ", " -)
if [ -n "$links_dynamics" ]; then
    printf "└── **Phase Space: Energy Barriers & Damped Dynamics** \n" >> README.md
    printf "&nbsp;&nbsp;&nbsp;&nbsp;└── %s  \n" "$links_dynamics" >> README.md
fi

# 5. footer
file_count=$(ls -1 *.md | grep -v "README.md" | grep -v "all.md" | wc -l)
printf "\n---\n\n*Note: Total files indexed: %s. Tree 2 identifies clusters using the Nikiforov-Uvarov §11 and §7 signatures.*\n" "$file_count" >> README.md

git add README.md
git commit -m "Auto-index: Fixed large file error and isolated NU §11 cluster"
git push origin main