Here's an improved prompt that addresses the mistakes:

---

I have a file called all.md that contains multiple math problem entries, each identified by a header "### File: [filename].md".

Please perform a comprehensive, fine-grained clustering of all problems found in the file based on their mathematical methodology. Follow these instructions strictly:

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

## 1. Dynamic Discovery & Verification
- Scan the entire all.md file to discover every unique filename with "### File:" header
- **Count total files found and verify this number multiple times**
- List every single file found in a numbered inventory (1-N)
- Do not truncate, skip, or assume any files

## 2. Fine-Grained Multi-Level Clustering

**Base clusters on SOLUTION METHODOLOGY, not topic names:**
- Group by the mathematical TECHNIQUE used to solve (e.g., "orthogonality relations + parameter shift", "Christoffel-Darboux kernel analysis", "recurrence relation + zero interlacing")
- **NOT by:** polynomial name alone, presence of certain functions, or keyword matching

**Three-level hierarchy:**
- **Main clusters**: Broad methodological approaches (e.g., "Modified Weight Orthogonality Theory", "Asymptotic Analysis Techniques")
- **Sub-clusters**: Specific problem types within that methodology (e.g., "Rational weight modifications", "Polynomial weight modifications")
- **Method sub-sub-clusters**: The precise solving technique (e.g., "Pole cancellation via polynomial decomposition")

**For True/False problems:**
- Group them together by their METHODOLOGY, not by their answer
- A True and False problem using the same method go in the same cluster
- Indicate (True) or (False) after each file link

## 3. Cluster Statistics
Include counts at EVERY level:
- Main cluster: total files
- Each sub-cluster: total files  
- Each method sub-sub-cluster: total files
- Verify counts add up correctly

## 4. Descriptions

**For each method-based sub-sub-cluster:**

**First file - FULL detailed description must include:**
- Complete problem statement (2-3 sentences explaining what's being asked)
- Complete solution methodology (4-6 sentences explaining the technique):
  - What is the key insight?
  - What mathematical tool/identity is used?
  - What are the steps in the solution?
  - Why does this method work?
- Conclusion/Result clearly stated

**All other files in that cluster:**
- One sentence describing the SPECIFIC problem (not generic)
- Conclusion/result in parentheses at the end
- Example: "Tests whether orthogonality to H_{n-3} determines coefficient in modified Hermite polynomial (False)"

**DO NOT write:**
- Generic descriptions like "Problem involving Jacobi polynomials"
- Vague phrases like "Uses orthogonality"
- Descriptions that could apply to multiple problems

## 5. Complete Linking
- Format: `[filename.md](https://github.com/igorratn/coyote-math/blob/main/filename.md)`
- Show each filename/link exactly ONCE
- Do NOT write "filename.md - [filename.md](link)" 
- Correct: `[027f10a7.md](link) - Problem description (True)`
- Wrong: `027f10a7.md - [027f10a7.md](link) - Problem description (True)`

## 6. Special Cluster: Spherical Harmonics

**Search carefully for ALL variations:**
- "spherical harmonic" (exact phrase)
- Y_l^m, Y_lm, Y_{l,m}, Y_{lm}
- Θ_l^m, Theta_lm, Θ_{lm}
- "associated Legendre function" or "associated Legendre polynomial"
- P_l^m in context of spherical coordinates
- Problems involving (θ, φ) angular variables on sphere

Create a dedicated cluster for these, separate from regular Legendre polynomial problems.

## 7. Formatting
```
## Cluster 1: [Methodology Name]

**Total files: X**

### 1.1 [Sub-cluster Name]

**Total files: Y**

#### 1.1.1 [Specific Method]

**Total files: Z**

[First file with FULL description]

[Other files with brief descriptions]
```

## 8. Final Summary

Must include:
- Total number of files discovered (verify matches initial count)
- Table showing breakdown by main cluster with counts
- Table showing breakdown by sub-cluster with counts  
- Table showing breakdown by methodology with counts
- Verification that all counts sum correctly

## 9. Quality Control

Before presenting output:
- Verify you read ALL files (count matches)
- Verify every file appears exactly once in the clustering
- Verify all descriptions are specific, not generic
- Verify all counts are accurate
- Verify methodology-based clustering (not topic-based)

