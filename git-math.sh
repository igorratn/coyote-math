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

# 3. Tree 1: Topic Classification (Unchanged)
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

# 4. Tree 2: Semantic Logic Grouping
# This tree groups by the "Proof Architecture" found in your content
printf "## Tree 2: Semantic Strategy & Logic\n\n" >> README.md

sem_names=(
    "NU Formalism: Second Kind & Eq. 7 Asymptotics"
    "NU Formalism: Auxiliary Functions & Estimates (§7)"
    "Polynomial Rigidity: Wronskian Constant Identities"
    "Phase Space: Energy Barriers & Damped Dynamics"
    "Discrete-to-Continuous Mapping (Hahn/Racah)"
)

# Semantic Fingerprints (combinations of variables that define the logic)
sem_pats=(
    "QnNU|dn2/an|rho.*yn.*t-z"            # Logic: NU Chapter II §11
    "auxiliary function|v\(x\)|NU.*7"     # Logic: NU §7 Monotonicity/Estimates
    "W_n.*constant|bounded.*polynomial"    # Logic: Rigidity/Liouville proofs
    "barrier|hilltop|relaxed|E\(0\)"      # Logic: Sine-Gordon/Dynamics stability
    "mapping.*x.*t|discrete.*Jacobi"      # Logic: Discrete-Continuous bridge
)

all_files=$(ls -1 *.md | grep -v "README.md")
printf "Root: Methodological Strategy \n" >> README.md

for i in "${!sem_names[@]}"; do
    name="${sem_names[$i]}"
    pat="${sem_pats[$i]}"
    links=""
    for file in $all_files; do
        if grep -qiE "$pat" "$file"; then
            id="${file%.md}"
            [ -z "$links" ] && links="[$id]($file)" || links="$links, [$id]($file)"
        fi
    done
    if [ -n "$links" ]; then
        if [ "$i" -eq $((${#sem_names[@]}-1)) ]; then
            printf "└── **%s** \n&nbsp;&nbsp;&nbsp;&nbsp;└── %s  \n" "$name" "$links" >> README.md
        else
            printf "├── **%s** \n│&nbsp;&nbsp;&nbsp;└── %s  \n" "$name" "$links" >> README.md
        fi
    fi
done

# 5. Footer and Git
file_count=$(ls -1 *.md | grep -v "README.md" | wc -l)
printf "\n---\n\n*Note: Tree 2 clusters problems by proof architecture (e.g. NU formalism vs. Physical stability).*\n" >> README.md

git add .
git commit -m "Auto-index: Semantic logical grouping ($file_count files)"
git push origin main