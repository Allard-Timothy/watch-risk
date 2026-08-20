# Report rules

The intended report capabilities and status live in
[`docs/product/features.md`](product/features.md) (`REPORT-*`, `VERDICT-*`).
This file remains the wording and confidence-cap contract for whatever report
is currently generated.

## Core rule

WatchTell produces buyer-risk reports. It does not authenticate watches.

QC verdicts (GL, GL with reservations, Conditional GL, request additional
evidence, RL, insufficient evidence) may appear **inside** the report.
They are photo-based QC language, not authenticity conclusions. The
buyer-risk headline remains the primary shipped conclusion (`DEC-001`).

## Forbidden final-output words

Do not use these words in final user-facing conclusions:

- authentic
- genuine
- fake
- counterfeit
- certified
- verified
- guaranteed
- passed

These words can appear only in internal tests, safety docs, or explicit legal/product boundary explanations.

## Safer phrasing

Use:

- no obvious photo-based red flags detected
- visible concern
- missing evidence
- cannot assess from submitted images
- inconsistent with the claimed reference
- independent inspection recommended
- high-risk listing
- medium-risk listing
- low visible risk
- photo set is incomplete
- claim is not supported by submitted images
- GL / GL with reservations / Conditional GL (QC verdict, not authenticity)
- RL (QC verdict: photo-based reason to decline or request a replacement)
- insufficient evidence / request additional evidence

## Report structure

Every report should include:

1. Summary
2. Overall risk (buyer-risk headline)
3. QC verdict (GL / RL family; `DEC-001`)
4. Confidence level
5. Photo completeness
6. Missing evidence
7. Visible concerns
8. Reference consistency notes
9. Seller-risk signals
10. Seller questions
11. Recommended next step
12. Disclaimer

## Confidence caps

Apply these before final report text is produced:

- no dial photo: confidence cannot be high
- no movement photo: movement cannot be assessed
- no clasp photo: bracelet confidence is limited
- poor photo quality: confidence decreases
- missing price: price-risk analysis is limited
- seller refusal to provide more photos: risk increases
- stock photos only: high risk or cannot assess
- heavily cropped photos: confidence decreases

## Disclaimer

Use this language or close equivalent:

> This report is a photo-based buyer-risk assessment. It is not an authentication certificate. It does not guarantee authenticity. Use an independent watchmaker, escrow, or brand service center when purchase risk is material.

## Later-phase evidence model

Longer term, report inputs will draw on structured WatchTell knowledge — claims,
evidence, and provenance, temporal seller/factory intelligence, and materialized
dossiers/snapshots — rather than ad hoc retrieval. This is later-phase
architecture, not current MVP scope, and the wording rules above still apply.
See `docs/knowledge-architecture.md`.
