# Comprehensive Mathematical Problem Clustering Guide (Updated)

**Version: 2.0**  
**Date: January 31, 2026**

This guide provides detailed instructions for clustering mathematical problems based on **solution methodology**, following the template established in `bessel_functions_cluster.md`.

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

## 1. Dynamic Discovery & Verification

- Scan the entire all.md file to discover every unique filename with "### File:" header
- **Count total files found and verify this number multiple times**
- Skip for now: List every single file found in a numbered inventory (1-N)
- Do not truncate, skip, or assume any files

---

## 2. Fine-Grained Multi-Level Clustering

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

## 3. Cluster Statistics

**Include counts at EVERY level:**
- Main cluster: `**Total files: X**`
- Each sub-cluster: `**Total files: Y**`
- Each method sub-sub-cluster: `**Total files: Z**`
- **Verify counts add up correctly at each level**

---

## 4. Descriptions (CRITICAL - Updated Requirement)

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

## 5. Complete Linking

### Link Format

```markdown
[filename.md](https://github.com/igorratn/coyote-math/blob/main/filename.md)
```

### Rules

- Show each filename/link exactly **ONCE**
- **Correct:** `[027f10a7.md](link) - Problem description **(True)**`
- **Wrong:** `027f10a7.md - [027f10a7.md](link) - Problem description **(True)**`

---

## 6. Document Structure Template

```markdown
# [Topic]: Comprehensive Clustering by Solution Methodology

**Total files discovered: N**  
**Total files verified: N**  
**Date: [date]**  
**N-U Reference:** [Chapter/Section if applicable]

This document clusters all [topic] problems based on their **solution methodology**.

---

## Overview

[2-3 paragraphs explaining the topic, its importance, and scope]

---

## Cluster 1: [Methodology Name]

**Total files: X**

[Brief description of this methodological approach]

---

### 1.1 [Sub-cluster Name]

**Total files: Y**

[Brief description of this sub-cluster]

#### 1.1.1 [Specific Method Name]

**Total files: Z**

**Typical Example: [first-file.md](link)**

[Full problem statement in LaTeX]

**Claim:** [state the claim]

**Solution Methodology:** [4-6 sentences explaining technique]

**Conclusion:** True/False or **Answer:** [result]

**Other files in this method:**
- [file2.md](link): Specific one-line description. **(True/False)**
- [file3.md](link): Specific one-line description. **(Answer: value)**

#### 1.1.2 [Different Method Name]

**Total files: W**

**Typical Example: [another-file.md](link)**

[Full problem statement in LaTeX]

[Full solution methodology]

**Conclusion:** [result]

**Other files:**
- [fileN.md](link): Description. **(Result)**

---

### 1.2 [Another Sub-cluster]

[Continue same pattern...]

---

## Summary Statistics

[Tables showing file counts by cluster, sub-cluster, method]

---

## Connections to Reference Material

[If applicable, cross-reference to N-U book or other sources]

---

## Quality Control Checklist

- [ ] Read entire all.md file
- [ ] Extracted all problem texts
- [ ] Verified file count multiple times
- [ ] Identified methodology for each problem
- [ ] **Every method (####) has "Typical Example" for first file**
- [ ] All other files have specific one-line descriptions
- [ ] All counts verified at every level
- [ ] Each file appears exactly once
- [ ] All links formatted correctly
- [ ] Methodology-based clustering (not keyword-based)

---

**End of Clustering Document**
```

---

## 7. Quality Control Checklist

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

## 8. Key Differences from Previous Version

**Major clarifications:**

1. **✓ Explicit requirement:** EVERY #### method needs "Typical Example" format for first file
2. **✓ Template expanded:** Shows multiple methods within same sub-cluster
3. **✓ Quality checklist:** Added specific item about typical examples for all methods
4. **✓ Examples improved:** Better good/bad examples for descriptions

**What was unclear before:**
- Users thought only the first cluster/sub-cluster needed typical example
- Now explicitly states: "For EVERY Method Sub-Sub-Cluster (#### heading)"

---

## 9. Examples of Correct vs Incorrect Application

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

## 10. Final Reminders

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

**End of Updated Clustering Guide*