# How prompt.md and the New Instructions Work Together

## **Quick Answer**

**prompt.md is REPLACED by the new instructions.**

The new `how_to_use_conversation_starter.md` is an **improved, updated version** that supersedes `prompt.md`.

---

## **What Changed**

| Feature | Old (prompt.md) | New (how_to_use_conversation_starter.md) |
|---------|-----------------|------------------------------------------|
| **Guide files** | Old unpruned guides (2869 lines) | New pruned guides (891 lines) |
| **Cluster files** | Old 3-problem cluster | New 5-problem cluster (Bessel) |
| **Prompt length** | Long, detailed | Concise, actionable |
| **Domain support** | Bessel only | Bessel + Spherical Harmonics |
| **Instructions** | Basic | Complete step-by-step |
| **Examples** | Minimal | Full session flow |

---

## **HOW TO USE THIS SYSTEM**

### **Step 1: Copy This Prompt**

**For Bessel Functions:**
```
I'm creating reasoning-first problems for Bessel Functions based on 
Nikiforov & Uvarov (1988) Chapter III.

Reference documents uploaded:
1. stumble_guide_pruned.md - General framework
2. bessel_functions_guide_pruned.md - Bessel-specific reference
3. bessel_functions_cluster_updated.md - Current 5 problems

Current Status:
- 5 existing problems covering: Lommel equation, Modified Bessel basis, 
  Mehler-Heine limit, Sturm-Liouville orthogonality, Phase synchronization
- Goal: Create NEW problems that differ in 2-3 dimensions (mathematical object, 
  domain/region, core insight, technique combination)

Approach:
- Reasoning-first: Require genuine mathematical insight, not just calculation
- Natural traps: Emerge from mathematics, prevent shortcuts
- Proper structure: Problem statement with NO citations, solution with FULL citations
- No duplicates: Check uniqueness against cluster before creating

Process:
Read the guides first, then confirm you understand the approach.
```
---

### **Step 2: Start New Claude Conversation**

1. Open new chat with Claude
2. **Paste the prompt** (from Step 1)
3. **Attach the 3 files** (drag and drop into message)
4. **Send**

**Files to attach (Bessel):**
- `stumble_guide_pruned.md`
- `bessel_functions_guide_pruned.md`
- `bessel_functions_cluster_updated.md`

**Files to attach (Spherical Harmonics):**
- `stumble_guide_pruned.md`
- `spherical_harmonics_guide_pruned.md`
- `spherical_harmonics_cluster.md`

---

### **Step 3: Wait for Claude's Confirmation**

Claude should respond:
```
I've read all three guides. I understand:

[For Bessel:]
1. The 5 existing problems cover different methodologies
2. Gaps: §16 (integrals), §18 (addition theorems), §19 (WKB)
3. Must check uniqueness in 4 dimensions before creating
4. Problem statement: NO citations; Solution: FULL citations

Ready to create new problems. What would you like to work on?
```

---

### **Step 4: Start Working**

**Option A - Explore gaps:**
```
Looking at the cluster, we haven't covered NU §18 (addition theorems). 
What problems could we create there?
```

**Option B - Review specific idea:**
```
I'm thinking about Hankel function asymptotics. Would this duplicate 
existing problems?
```

**Option C - Brainstorm:**
```
What gaps do you see in the current cluster?
```

---

## **Complete Example Session**

### **You:**
[Paste Bessel prompt + attach 3 files]

### **Claude:**
```
I've read all three guides. I understand:

1. The 5 existing problems:
   - Lommel equation (inhomogeneous, growth comparison)
   - Modified Bessel (Frobenius, Wronskian)
   - Mehler-Heine (Legendre→Bessel limit)
   - Sturm-Liouville (singular endpoint orthogonality)
   - Phase synchronization (Wronskian divergence near zeros)

2. NU Chapter III coverage gaps:
   - §16: Sommerfeld integral representations
   - §18: Addition theorems (Graf, Gegenbauer)
   - §19: Large order asymptotics (Langer)

3. Uniqueness requirements:
   - Must differ in 2-3 dimensions
   - Check against existing before finalizing

Ready to work on new problems. What interests you?
```

### **You:**
```
Let's create a problem about Graf's addition theorem.
```

### **Claude:**
```
Good choice! Checking cluster... None of the 5 problems use addition 
theorems, so this is NEW territory.

Graf's theorem: J_ν(r) = J_ν(a)J_0(b) + 2∑[k=1 to ∞]J_ν+k(a)J_k(b)cos(kφ)

For reasoning-first, we could:
1. Test convergence in different parameter regimes
2. Examine coordinate transformation behavior
3. Look at truncation error growth

Which direction?
```

### **You continue iterating...**

---

## **Decision Tree: Which System to Use?**

```
START: Do you want to create special function problems?
  │
  ├─→ YES, with OLD guides (unpruned, 2869 lines)
  │     └─→ DON'T - guides are outdated
  │
  └─→ YES, with NEW guides (pruned, 891 lines)
        └─→ Follow steps 1-4 above ✅
```

---

## **Files You Need**

**From `/mnt/user-data/outputs/`:**
- ✅ `stumble_guide_pruned.md` (645 lines)
- ✅ `bessel_functions_guide_pruned.md` (92 lines) OR `spherical_harmonics_guide_pruned.md` (154 lines)
- ✅ `bessel_functions_cluster_updated.md` (5 problems) OR `spherical_harmonics_cluster.md` (19 problems)

**DON'T use these (outdated):**
- ❌ `stumble_guide.md` (2326 lines - replaced)
- ❌ `bessel_functions_guide.md` (299 lines - replaced)
- ❌ `bessel_functions_cluster.md` (3 problems - replaced)

---

## **Summary: Quick Start**

1. ✅ **Copy prompt** (Bessel or SH from Step 1)
2. ✅ **Open new Claude chat**
3. ✅ **Paste prompt + attach 3 pruned files**
4. ✅ **Send**
5. ✅ **Start working with Claude**

**That's it!**

---

## **Why Use the New System?**

1. **Much shorter** - 69% reduction (891 vs 2869 lines)
2. **No redundancy** - Guides don't overlap
3. **Updated** - 5 Bessel problems (not 3), 19 SH problems
4. **Better organized** - Clear structure, no duplication
5. **Complete instructions** - Step-by-step with examples
6. **Multi-domain** - Works for Bessel, SH, or future domains

---

## **Migration from Old System**

If you were using the old unpruned guides:

**Replace these files:**
- `stumble_guide.md` → `stumble_guide_pruned.md`
- `bessel_functions_guide.md` → `bessel_functions_guide_pruned.md`
- `bessel_functions_cluster.md` → `bessel_functions_cluster_updated.md`

**Then use the prompt from Step 1 above.**

---

**The new system is a complete replacement. Just follow Steps 1-4 and start creating problems!**
