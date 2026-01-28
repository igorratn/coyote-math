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

## **Decision Tree: Which One to Use?**

```
START: Do you want to create special function problems?
  │
  ├─→ YES, with OLD guides (unpruned)
  │     └─→ Use prompt.md (but NOT recommended)
  │
  └─→ YES, with NEW guides (pruned)
        └─→ Use how_to_use_conversation_starter.md ✅ RECOMMENDED
```

---

## **Recommended: Use the New System**

### **Why?**

1. **Much shorter guides** (69% reduction)
2. **No redundancy** between guides
3. **Updated cluster** (5 problems vs 3)
4. **Works for multiple domains** (Bessel, SH)
5. **Better instructions** (step-by-step)
6. **Proper emphasis on uniqueness**

### **What You Need:**

**Files from outputs folder:**
- `stumble_guide_pruned.md` (645 lines) ✅
- `bessel_functions_guide_pruned.md` (92 lines) ✅
- `bessel_functions_cluster_updated.md` (5 problems) ✅
- `how_to_use_conversation_starter.md` (instructions) ✅

**NOT needed:**
- ~~`stumble_guide.md`~~ (old, 2326 lines)
- ~~`bessel_functions_guide.md`~~ (old, 299 lines)
- ~~`bessel_functions_cluster.md`~~ (old, 3 problems)
- ~~`prompt.md`~~ (old instructions)

---

## **If You Still Want to Use prompt.md**

You can, but you'll need to **update it** first:

### **Changes Required:**

1. **Update file names:**
   ```diff
   - stumble_guide.md
   + stumble_guide_pruned.md
   
   - bessel_functions_guide.md
   + bessel_functions_guide_pruned.md
   
   - bessel_functions_cluster.md
   + bessel_functions_cluster_updated.md
   ```

2. **Update problem count:**
   ```diff
   - Current cluster status: 3 existing problems
   + Current cluster status: 5 existing problems
   ```

3. **Add uniqueness emphasis:**
   ```diff
   + Must differ in 2-3 dimensions (object, domain, insight, technique)
   + Check against existing cluster before creating
   ```

4. **Update gaps:**
   ```diff
   - Gaps: orthogonality, spherical Bessel, addition theorems
   + Gaps: §16 (integrals), §18 (addition theorems), §19 (WKB/large order)
   ```

---

## **Practical Recommendation**

### **Option 1: Fresh Start (RECOMMENDED)**

1. **Ignore prompt.md entirely**
2. **Use `how_to_use_conversation_starter.md`**
3. **Upload the 3 pruned files**
4. **Follow step-by-step instructions**

**Advantages:**
- ✅ Everything is up-to-date
- ✅ Much shorter context (891 vs 2869 lines)
- ✅ Better organized
- ✅ Complete instructions

---

### **Option 2: Hybrid Approach**

If you really like something specific in prompt.md:

1. **Start with the new system** (Step 1-3 from `how_to_use_conversation_starter.md`)
2. **Add any custom instructions** from prompt.md that you particularly like
3. **But use the NEW pruned files**

**Example hybrid prompt:**

```
[Copy the main prompt from how_to_use_conversation_starter.md]

Additional preferences from my workflow:
- [Add any specific preferences you had in prompt.md]
- [Keep them brief]

Ready when you confirm you've read the guides.
```

---

## **Migration Guide: From Old to New**

If you've been using prompt.md:

### **Step 1: Gather New Files**

From `/mnt/user-data/outputs/`:
- ✅ `stumble_guide_pruned.md`
- ✅ `bessel_functions_guide_pruned.md`
- ✅ `bessel_functions_cluster_updated.md`

### **Step 2: Delete Old Files (Optional)**

You can archive these:
- `stumble_guide.md` (replaced)
- `bessel_functions_guide.md` (replaced)
- `bessel_functions_cluster.md` (replaced)
- `prompt.md` (replaced)

### **Step 3: Use New Instructions**

Open `how_to_use_conversation_starter.md` and follow **Step 1-5**.

---

## **Summary**

**Simple answer:**
- ❌ **Don't use prompt.md anymore**
- ✅ **Use how_to_use_conversation_starter.md instead**
- ✅ **Upload the 3 pruned guides**
- ✅ **Follow the step-by-step process**

**Why?**
- Shorter (69% reduction in guide length)
- Updated (5 problems vs 3)
- Better organized (no overlap)
- Complete instructions (step-by-step)
- Works for multiple domains

**The new system is a complete replacement, not an addition.**

