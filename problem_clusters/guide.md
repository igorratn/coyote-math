# Comprehensive Mathematical Problem Clustering Guide (Updated)

**Version: 3.0**  
**Date: January 31, 2026**

This guide provides detailed instructions for clustering mathematical problems based on **solution methodology**, using a **combined-file approach** that creates larger, more practical documents organized by chapter or theme.

## Key Update in v3.0

**NEW APPROACH:** Create larger combined files (30-50 files each) organized by:
- **N-U book chapters** for comprehensive topics (e.g., all of Chapter II orthogonal polynomials)
- **Major themes** for cohesive standalone topics (e.g., Bessel functions, Spherical harmonics)
- **Miscellaneous combined** for smaller remaining topics

**PREVIOUS APPROACH (v2.0):** Created many small individual cluster files (3-4 files each)

**WHY CHANGED:** Larger files are more practical for users - fewer documents to navigate, comprehensive coverage of each major topic in one place.

---

## CRITICAL: Work Process Requirements

**BEFORE attempting to cluster, you MUST:**
1. Read the ENTIRE all.md file completely (do not stop at truncation)
2. Extract ALL problem texts for every single file
3. Manually verify you have all files by checking the count
4. Read and understand EACH problem's actual content, not just keywords
5. Identify the SOLUTION METHODOLOGY used (not just the topic)
6. Only AFTER understanding all problems, begin clustering

**Do NOT:**
- Use keyword searches as your primary categorization method
- Generate output before reading all files
- Assume categories without reading the actual solution methods
- Rush to produce output - thoroughness is required

---

## 1. File Organization Strategy (NEW in v3.0)

### Decide on File Structure First

Before clustering, decide how to organize into files:

#### Large Combined Files (30-50 files each)

**When to use:**
- Comprehensive chapter coverage (e.g., all Chapter II orthogonal polynomials)
- Multiple related sub-topics that naturally fit together
- Users benefit from seeing full picture in one document

**Examples:**
- `CLUSTER_CHAPTER_02_ORTHOGONAL_POLYNOMIALS.md` (40 files)
  - Modified weights, second kind, asymptotics, extremal, generating functions, zero distribution, integrals, series expansions
- `CLUSTER_MISCELLANEOUS_TOPICS.md` (15 files)
  - Differential geometry + Boundary value problems + Hypergeometric functions

**Structure:**
```markdown
# Chapter II: Classical Orthogonal Polynomials - Complete Clustering

**Total files: 40**

## PART I: MODIFIED WEIGHT ORTHOGONALITY (8 files)
### Cluster 1.1: ...
#### 1.1.1 Method Name
[Typical Example]
[Other files]

## PART II: FUNCTIONS OF THE SECOND KIND (9 files)
### Cluster 2.1: ...
[Continue...]

## PART III: ASYMPTOTIC BEHAVIOR (6 files)
[Continue...]
```

#### Large Thematic Files (7-20 files each)

**When to use:**
- Cohesive standalone topic with strong thematic unity
- Self-contained mathematical subject
- Already naturally forms a complete unit

**Examples:**
- `bessel_functions_cluster.md` (7 files)
- `cluster_spherical_harmonics.md` (19 files)
- `cluster_quantum_angular_momentum.md` (10 files)
- `cluster_sine_gordon_pdes.md` (12 files)

**Structure:** Standard hierarchical clustering with typical examples

#### Small Combined Files (3-8 files)

**When to use:**
- Very small leftover topics that don't fit elsewhere
- Truly miscellaneous items with no natural home
- **Avoid if possible** - prefer combining into larger files

---

## 2. Dynamic Discovery & Verification

- Scan the entire all.md file to discover every unique filename with "### File:" header
- **Count total files found and verify this number multiple times**
- Skip for now: List every single file found in a numbered inventory (1-N)
- Do not truncate, skip, or assume any files

---

## 3. Fine-Grained Multi-Level Clustering

### Base Clusters on SOLUTION METHODOLOGY

**Group by the mathematical TECHNIQUE used to solve:**
- Example: "orthogonality relations + parameter shift"
- Example: "Christoffel-Darboux kernel analysis"  
- Example: "recurrence relation + zero interlacing"

**NOT by:**
- Polynomial name alone
- Presence of certain functions
- Keyword matching

### Three-Level Hierarchy

**Level 1: Main Clusters** (## headings)
- Broad methodological approaches
- Example: "Modified Weight Orthogonality Theory"
- Example: "Asymptotic Analysis Techniques"

**Level 2: Sub-Clusters** (### headings)
- Specific problem types within that methodology
- Example: "Rational weight modifications"
- Example: "Polynomial weight modifications"

**Level 3: Method Sub-Sub-Clusters** (#### headings)
- The precise solving technique
- Example: "Pole cancellation via polynomial decomposition"
- Example: "Frobenius method with Wronskian verification"

### For True/False Problems

- Group them together by their METHODOLOGY, not by their answer
- A True and False problem using the same method go in the same cluster
- Indicate **(True)** or **(False)** after each file description

---

## 4. Cluster Statistics

**Include counts at EVERY level:**
- Main cluster: `**Total files: X**`
- Each sub-cluster: `**Total files: Y**`
- Each method sub-sub-cluster: `**Total files: Z**`
- **Verify counts add up correctly at each level**

---

## 5. Descriptions (CRITICAL - Updated Requirement)

### For EVERY Method Sub-Sub-Cluster (#### heading)

**⚠️ IMPORTANT:** The first file in **EVERY method** (every #### section) requires full detailed description.

#### First File Format - "Typical Example"

**Must include ALL of the following:**

1. **Header:** `**Typical Example: [filename.md](github-link)**`

2. **Complete problem statement:**
   - Copy the problem statement as written (in LaTeX/KaTeX format)
   - Include all mathematical notation
   - Include the claim being tested (for True/False)

3. **Solution Methodology (4-6 sentences):**
   - What is the **key mathematical insight**?
   - What **mathematical tool/identity/theorem** is used?
   - What are the **step-by-step procedures** in the solution?
   - **Why does this method work** (theoretical justification)?
   - What makes this technique **distinct** from other methods?

4. **Conclusion/Result:**
   - Clearly state: "**Conclusion:** True" or "**Conclusion:** False"
   - Or: "**Answer:** [explicit formula/value]"

**Example of proper typical example:**

```markdown
#### 1.2.1 Frobenius Method with Wronskian Verification

**Total files: 1**

**Typical Example: [300a11f2.md](https://github.com/igorratn/coyote-math/blob/main/300a11f2.md)**

Let $J_\nu(z)$ denote the Bessel function of the first kind of order $\nu$, satisfying:

$$z^2 u'' + zu' + (z^2 - \nu^2)u = 0.$$

Consider the modified Bessel equation:

$$z^2 v'' + zv' - (z^2 + \nu^2)v = 0.$$

**Claim:** For non-integer $\nu > 0$, the pair $\{I_\nu(z), I_{-\nu}(z)\}$ forms a complete basis.

**Solution Methodology:** The proof applies Frobenius theory to analyze the regular singular point at $z=0$. The modified Bessel equation has indicial exponents $\pm\nu$, which differ by a non-integer, guaranteeing two linearly independent solutions. The functions $I_\nu(z)$ and $I_{-\nu}(z)$ realize these solutions. To verify linear independence, the proof computes the Wronskian: $W[I_\nu, I_{-\nu}]$ satisfies $W' = -\frac{1}{z}W$, giving $W(z) = C/z$. The constant is $W = -\frac{2\sin(\pi\nu)}{\pi z}$, which is nonzero for non-integer $\nu$. Therefore $\{I_\nu, I_{-\nu}\}$ forms a fundamental set, and $K_\nu(z)$ can be written as their linear combination.

**Conclusion:** True
```

#### All Other Files in That Method

**One-sentence specific description:**
- Describe the SPECIFIC problem (not generic)
- Include conclusion/result in parentheses
- Be concrete about what distinguishes this problem

**Good examples:**
- "Studies Hermite polynomials with $n=0$ case using direct integral computation. **(False)**"
- "Laguerre zeros monotonicity in $\alpha$ parameter using auxiliary equation method. **(True)**"

**Bad examples (too generic):**
- "Problem involving Jacobi polynomials **(True)**"
- "Uses orthogonality relations **(False)**"
- "Asymptotic analysis problem"

---

## 6. Complete Linking

### Link Format

```markdown
[filename.md](https://github.com/igorratn/coyote-math/blob/main/filename.md)
```

### Rules

- Show each filename/link exactly **ONCE**
- **Correct:** `[027f10a7.md](link) - Problem description **(True)**`
- **Wrong:** `027f10a7.md - [027f10a7.md](link) - Problem description **(True)**`

---

## 7. Document Structure Templates

### Template A: Large Combined File (Chapter-Based)

Use for comprehensive chapter coverage (30-50 files).

```markdown
# Chapter [N]: [Topic] - Complete Clustering

**Total files: [X]**  
**N-U Reference:** Chapter [N] (§sections)  
**Date: [date]**

This document clusters all [topic] problems organized by solution methodology.

---

## Chapter Overview

[2-3 paragraphs about chapter scope]

**Files in this combined cluster:**
- Topic area 1: X files
- Topic area 2: Y files
[List all major parts]

**Total: X files**

---

## PART I: [MAJOR TOPIC AREA 1] (X files)

### Cluster 1.1: [Sub-cluster Name]

**Total files: Y**

[Description of sub-cluster]

#### 1.1.1 [Specific Method Name]

**Total files: Z**

**Typical Example: [file.md](link)**

[Full problem statement]

**Claim:** [state claim]

**Solution Methodology:** [4-6 sentences]

**Conclusion/Answer:** [result]

**Other files:**
- [file2.md](link): Specific description. **(Result)**
- [file3.md](link): Specific description. **(Result)**

#### 1.1.2 [Different Method]

**Total files: W**

**Typical Example: [file.md](link)**

[Full problem + methodology]

**Other files:**
[List with one-line descriptions]

---

## PART II: [MAJOR TOPIC AREA 2] (X files)

[Continue same pattern...]

---

## Summary Statistics

| Part | Files | Main Technique |
|------|-------|----------------|
| I. Topic 1 | X | ... |
| II. Topic 2 | Y | ... |
| **Total** | **N** | |

---

## Quality Control Checklist

- [ ] All N files verified
- [ ] Each file appears exactly once
- [ ] Every method has "Typical Example"
- [ ] Methodology-based clustering
- [ ] Counts verified: sum = N ✓

---

**End of Chapter [N] Clustering**
```

### Template B: Large Thematic File (7-20 files)

Use for cohesive standalone topics.

```markdown
# [Topic]: Comprehensive Clustering by Solution Methodology

**Total files: [N]**  
**Date: [date]**  
**N-U Reference:** [if applicable]

[Overview paragraphs]

---

## Cluster 1: [Main Methodology]

**Total files: X**

### 1.1 [Sub-cluster]

**Total files: Y**

#### 1.1.1 [Method]

**Total files: Z**

**Typical Example: [file.md](link)**

[Full problem + methodology]

**Other files:**
[List]

[Continue with standard hierarchical structure]

---

## Summary Statistics

[Table]

---

**End of [Topic] Clustering**
```

### Template C: Miscellaneous Combined File

Use for collecting smaller leftover topics.

```markdown
# Miscellaneous Topics: Combined Clustering

**Total files: [N]**  
**Date: [date]**

This combined document includes:
- **Topic A** (X files)
- **Topic B** (Y files)
- **Topic C** (Z files)

---

## PART A: [TOPIC A] (X files)

[Standard clustering structure]

### A1. [Sub-cluster]

#### A1.1 [Method]

**Typical Example:**
[Full details]

---

## PART B: [TOPIC B] (Y files)

[Continue...]

---

## Summary Statistics

| Part | Topic | Files |
|------|-------|-------|
| A | Topic A | X |
| B | Topic B | Y |
| **Total** | | **N** |

---

**End of Miscellaneous Topics**
```

---

## 8. Document Naming Conventions

### Large Combined Files
- `CLUSTER_CHAPTER_[NN]_[TOPIC].md` - For N-U chapters
- `CLUSTER_MISCELLANEOUS_TOPICS.md` - For combined misc

### Large Thematic Files
- `cluster_[topic_name].md` - Lowercase, underscores
- Examples: `bessel_functions_cluster.md`, `cluster_spherical_harmonics.md`

### Navigation Files
- `MASTER_CLUSTER_INDEX.md` - All caps
- `00_CLUSTERING_SUMMARY.md` - Numbered to appear first
- `CLUSTERING_GUIDE_v3.md` - Versioned

---

## 9. Quality Control Checklist

**Before presenting output, verify:**

- [ ] Read ALL files from all.md (count matches initial discovery)
- [ ] Every file appears exactly once in the clustering
- [ ] **EVERY method sub-sub-cluster (####) has full "Typical Example" for first file**
- [ ] All other files have specific (not generic) one-line descriptions
- [ ] All counts are accurate at every level (##, ###, ####)
- [ ] Counts sum correctly (bottom-up verification)
- [ ] Methodology-based clustering (not topic/keyword-based)
- [ ] All links formatted correctly (no double filename)
- [ ] True/False indicated for all T/F problems
- [ ] Document saved as markdown

---

## 10. Key Differences from Previous Versions

**Major changes in v3.0:**

1. **✓ File organization strategy:** NEW section on when to use combined vs thematic files
2. **✓ Three document templates:** Chapter-based, thematic, and miscellaneous combined
3. **✓ Naming conventions:** Explicit rules for file naming
4. **✓ Practical focus:** Emphasis on creating larger (30-50 file) documents
5. **✓ "PART" structure:** For combined files with multiple major topic areas

**Carried over from v2.0:**
- Explicit requirement: EVERY #### method needs "Typical Example"
- Quality checklist includes typical examples for all methods
- Methodology-first clustering (not keyword-based)

**What changed from v1.0:**
- v1.0: Many small files (3-4 files each)
- v2.0: Clarified typical example requirement
- v3.0: Combined into larger practical files (30-50 files each)

---

## 11. Examples of Correct Application

### ✅ CORRECT: Multiple Methods, Each with Typical Example

```markdown
### 1.2 Functions of the Second Kind

**Total files: 9**

#### 1.2.1 Christoffel-Darboux Formula Method

**Total files: 4**

**Typical Example: [25fec83d.md](link)**

[Full problem with LaTeX]
[Full methodology 4-6 sentences]
**Conclusion:** True

**Other files:**
- [53de3231.md](link): Laguerre second-kind using monic C-D. **(True)**
- [5c7587a5.md](link): Hermite second-kind with normalization. **(True)**

#### 1.2.2 Asymptotic Expansion Method  

**Total files: 3**

**Typical Example: [147341f7.md](link)**

[Full problem with LaTeX]
[Full methodology 4-6 sentences]
**Conclusion:** False

**Other files:**
- [2d61fb16.md](link): Legendre second-kind at $a=2$. **(False)**

#### 1.2.3 Series Expansion Method

**Total files: 2**

**Typical Example: [de28a871.md](link)**

[Full problem with LaTeX]
[Full methodology]
**Conclusion:** True

**Other files:**
- [67128ca2.md](link): Different normalization. **(True)**
```

### ❌ INCORRECT: Missing Typical Examples

```markdown
### 1.2 Functions of the Second Kind

**Total files: 9**

#### 1.2.1 Christoffel-Darboux Formula

**Total files: 4**

**Typical Example: [25fec83d.md](link)**
[Full description - GOOD]

**Other files:**
- [53de3231.md](link): ...
- [5c7587a5.md](link): ...

#### 1.2.2 Asymptotic Expansion

**Total files: 3**

[147341f7.md](link): Uses asymptotic expansion. **(False)**  ❌ WRONG - needs typical example
[2d61fb16.md](link): Similar approach. **(False)**

#### 1.2.3 Series Expansion  

**Total files: 2**

- Uses series expansion method  ❌ WRONG - needs typical example for first file
- [de28a871.md](link): ...
- [67128ca2.md](link): ...
```

---

## 11. Examples of Correct Application

### ✅ CORRECT: Large Combined File (Chapter-Based)

```markdown
# Chapter II: Classical Orthogonal Polynomials - Complete Clustering

**Total files: 40**

## PART I: MODIFIED WEIGHT ORTHOGONALITY (8 files)

### Cluster 1.1: Decomposition & Dimension Counting

**Total files: 3**

#### 1.1.1 Pole Cancellation Method

**Total files: 3**

**Typical Example: [027f10a7.md](link)**

[Full problem with Jacobi polynomials and modified weight]
[Full 4-6 sentence methodology about decomposition]
**Conclusion:** True

**Other files:**
- [2002a358.md](link): Legendre with Cauchy principal value. **(True)**
- [9c2e2dec.md](link): Dimension counting $(n+1)-(n-1)=2$. **(True)**

#### 1.1.2 Recurrence Relations Method

**Total files: 5**

**Typical Example: [076ef56b.md](link)**

[Full problem with Hermite polynomials]
[Full methodology using three-term recurrence]
**Conclusion:** False

**Other files:**
- [3fc90f09.md](link): Hermite $n=0$ case direct computation. **(False)**
[Continue for all 5 files...]

---

## PART II: FUNCTIONS OF THE SECOND KIND (9 files)

### Cluster 2.1: Christoffel-Darboux Applications

**Total files: 4**

#### 2.1.1 Kernel Integration Method

**Total files: 4**

**Typical Example: [25fec83d.md](link)**

[Full problem with Legendre second-kind]
[Full methodology with C-D formula]
**Conclusion:** True

[Continue...]

---

## PART III: ASYMPTOTIC BEHAVIOR (6 files)

[Continue...]
```

**Why this is correct:**
- Combines related topics (all Chapter II) in one file
- Clear PART divisions for major topic areas
- Every #### method has typical example
- All 40 files accounted for in one document

### ✅ CORRECT: Large Thematic File

```markdown
# Quantum Angular Momentum: Comprehensive Clustering

**Total files: 10**

## Cluster 1: Clebsch-Gordan Coefficients

**Total files: 7**

### 1.1 3j Symbol Symmetries

**Total files: 3**

#### 1.1.1 Explicit Formulas

**Total files: 3**

**Typical Example: [0b5cd3f3.md](link)**

[Full problem]
[Full methodology]
**Conclusion:** [result]

**Other files:**
[List all 3 files]

### 1.2 Hahn Polynomial Representation

**Total files: 2**

#### 1.2.1 Racah-Wigner Formula

**Total files: 2**

**Typical Example: [7df49adf.md](link)**

[Full details]

[Continue...]

## Cluster 2: 6j Symbols

**Total files: 2**

[Continue...]
```

**Why this is correct:**
- Cohesive thematic topic (all angular momentum)
- Standard hierarchical clustering
- Every method has typical example
- 10 files in focused standalone document

---

## 12. Common Mistakes to Avoid

### ❌ MISTAKE 1: Too Many Small Files

```
Wrong approach:
- cluster_modified_weights_jacobi.md (3 files)
- cluster_modified_weights_laguerre.md (2 files)  
- cluster_modified_weights_hermite.md (3 files)
- cluster_second_kind_legendre.md (4 files)
- cluster_second_kind_hermite.md (2 files)
[20 separate small files!]

Correct approach:
- CLUSTER_CHAPTER_02_ORTHOGONAL_POLYNOMIALS.md (40 files)
  - PART I: Modified Weights (8 files total)
  - PART II: Second Kind (9 files total)
  [All in one document]
```

### ❌ MISTAKE 2: Missing Typical Examples

```markdown
## PART I: MODIFIED WEIGHTS (8 files)

### Cluster 1.1: Decomposition Methods

#### 1.1.1 Pole Cancellation

**Total files: 3**

- [027f10a7.md](link): Uses decomposition. **(True)** ❌ MISSING TYPICAL EXAMPLE
- [2002a358.md](link): Legendre version. **(True)**
- [9c2e2dec.md](link): Dimension counting. **(True)**
```

**Fix:** First file must have full "Typical Example" format with complete problem statement and 4-6 sentence methodology.

### ❌ MISTAKE 3: No Clear File Organization

```markdown
# Mathematical Problems - Clustering

[Random mix of 105 problems with no clear structure]
```

**Fix:** Decide on file structure FIRST (Step 1), then cluster within each file.

---

## 13. Final Reminders

**The clustering is only complete when:**
1. ✓ Every #### method section starts with "**Typical Example:**"
2. ✓ That typical example includes full problem + full methodology
3. ✓ All subsequent files in that method get one-line descriptions
4. ✓ This pattern repeats for EVERY method in the document

**Success criteria:**
- Count of "**Typical Example:**" headers = Count of #### method sections
- No generic descriptions anywhere
- All file counts verified and correct

---

**End of Updated Clustering Guide**

---

## 14. Quick Decision Tree

**START:** I have N files to cluster from all.md

**STEP 1:** How many files do I have on this general topic?

- **30-50+ files:** Create large combined file by chapter/comprehensive topic
  - Example: All Chapter II orthogonal polynomials → `CLUSTER_CHAPTER_02_*.md`
  
- **7-20 files:** Create large thematic file if topic is cohesive
  - Example: All Bessel functions → `bessel_functions_cluster.md`
  - Example: All spherical harmonics → `cluster_spherical_harmonics.md`
  
- **3-6 files:** Combine with other small topics into miscellaneous file
  - Example: Geometry + BVPs + Hypergeometric → `CLUSTER_MISCELLANEOUS_TOPICS.md`

**STEP 2:** Within chosen file, organize by methodology (not keywords)

**STEP 3:** Apply standard clustering with typical examples for every method

**RESULT:** 6-8 total cluster documents covering all 100+ files

---

## 15. Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v1.0 | - | Original guide: many small files (3-4 each) |
| v2.0 | Jan 2026 | Clarified: EVERY method needs typical example |
| v3.0 | Jan 2026 | NEW: Combined file approach (30-50 files each) |

---

**End of Clustering Guide v3.0**
