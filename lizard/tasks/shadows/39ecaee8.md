# Shadow Task: 39ecaee8

- **SA Task ID:** Flyer_Poster_00062_1000_F_61329058_IAFlLVfW5aalR2scgcvZA8lxUOsAcULl_88e34197.json
- **Annotation:** 1
- **Cycle:** 1
- **Rating:** Approve
- **Fired at:** 2026-05-08T17:25:14.019Z
- **HAI Link:** https://ai.joinhandshake.com/annotations/fellow/task/39ecaee8-2e4a-4149-bd4d-bd2ef53a5674/run
- **Status:** ✅ submitted
- **Verdict source:** igor
- **HAI LLM eval:** clean
- **Review file:** [Flyer_Poster_00062_1000_F_61329058_IAFlLVfW5aalR2scgcvZA8lxUOsAcULl_88e34197.md](../Flyer_Poster_00062_1000_F_61329058_IAFlLVfW5aalR2scgcvZA8lxUOsAcULl_88e34197.md) → Annotation 1

## Prompt
Use only the bird silhouettes in the sky.

Read the birds from left to right according to the horizontal position of their centers. Compare each bird to the next bird in sequence:

encode U if the next bird is positioned higher
encode D if the next bird is positioned lower
encode S if the next bird is at approximately the same height

Ignore tiny wing-angle differences and use the body center for vertical comparison.

What is the resulting code?

Answer format: Answer with uppercase letters only using U, D, and S (e.g., UDSD).

## Rewrite Answer
DUDUUD
