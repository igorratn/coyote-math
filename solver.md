I have updated the requirements to include the **Stress Test** layer. These new directives are designed to move beyond algebraic difficulty and target the specific cognitive biases (smoothness, global validity, and basis heuristics) that cause models to stumble.

---

## **Problem Creation Requirements**

### **1. Problem Creation Goals**

* **Source**: Chapter 10 (Spherical Harmonics) from Nikiforov-Uvarov.
* **Type**: **Reasoning-heavy** (insight-based). Avoid "knowledge retrieval" or "plug-and-play" problems.
* **Uniqueness**: Every problem must be checked against existing entries in `all.md` and the Spherical Harmonics cluster to avoid duplication.
* **Analytical Bridge**: Avoid identities solved by direct substitution. The proof must require a logical bridge between two or more distinct properties (e.g., connecting a geometric symmetry to an algebraic representation property).
* **Stress Test (The Stumble Layer)**:
* **Boundary/Singularity**: Exploit coordinate singularities at the poles () where differential operators are often misapplied by models.
* **Basis/Phase Mismatch**: Force the model to reconcile different quantization axes (e.g., rotating a -basis operator into an -basis eigenstate).
* **Conditional Validity**: Construct claims that appear globally true but are conditionally false (e.g., holding for even  but failing for odd , or holding in  but failing pointwise).



### **2. Formatting Rules**

* **Style**: Publication-style paper format.
* **No Section Headers**: Do not use labels like "Proof", "Step 1", or "Solution". The text must flow naturally.
* **KaTeX**: Use proper `$...$` for inline and `$$...$$` for display math.
* **Grammar**: Strictly follow proper capitalization and grammar rules. No highlight, bolding, or special formatting.

### **3. Structure (Strict Order)**

1. **Problem Statement**: Define functions, parameters, and domain. Start with **Let...** and use double-line breaks between mathematical definitions to maintain a **spacy** visual layout.
2. **Claim**: State the mathematical assertion clearly. **Always add "Determine with rigorous proof whether the claim is True or False"** and **"Determine with rigorous proof!!"** to the claim.
3. **Conclusion**: State only **Conclusion: True** or **Conclusion: False**.
4. **Proof**: Provide a rigorous derivation. Use a neutral tone, maintain a natural flow between paragraphs, and draw from Chapter 10 properties without explicitly citing the book within the text.

### **4. Category & Solution Style**

* **Category Identification**: Match an existing category from `all.md` or propose a **new category based on the method used**.
* **Citations**: Use matching citations from similar problems in `all.md`.
* **Tone**: Objective and neutral. No first-person pronouns (no "we" or "us").
* **Rigor**: Ensure a complete, concise logical chain with no verbose filler.
