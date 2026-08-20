# WatchTell product decisions

Resolved product questions. These are the source of truth when a later
roadmap hypothesis disagrees.

Feature status still comes from the codebase. A decision to implement
something does not mark it `implemented`.

Related: [`features.md`](features.md), [`roadmap.md`](roadmap.md),
[`principles.md`](principles.md), [`vision.md`](vision.md).

## DEC-001: Buyer-risk report includes QC verdicts (GL/RL)

**Status:** decided  
**Date:** 2026-08-19

The primary shipped conclusion remains a **photo-based buyer-risk report**
(`REPORT-002`: low / medium / high / cannot assess).

**QC verdicts are included in that report** (`VERDICT-003`):

- GL
- GL with reservations
- Conditional GL
- Request additional evidence
- RL
- Insufficient evidence

GL/RL is replica-community QC language for “green light / red light” on
the submitted evidence. It is not an authenticity conclusion.

Forbidden words still apply (`authentic`, `genuine`, `fake`,
`counterfeit`, `certified`, `verified`, `guaranteed`, `passed`). Explain
verdicts with safer phrasing, for example:

- GL: no obvious photo-based reason to reject given this factory and
  reference; independent inspection is still recommended when purchase
  risk is material
- RL: photo-based QC shows a reason to decline or request a replacement
- Insufficient evidence / request additional evidence: cannot assess
  from submitted images

Suggested mapping (refine when implementing `VERDICT-003`):

| QC verdict | Typical buyer-risk headline |
|---|---|
| GL | low visible risk |
| GL with reservations, Conditional GL | medium-risk listing |
| RL | high-risk listing |
| Request additional evidence, Insufficient evidence | cannot assess |

Do not replace the buyer-risk headline with GL/RL alone. Show both.

Affects: `REPORT-001`, `REPORT-002`, `VERDICT-003`.

## DEC-002: Pixel and video QC are in scope now

**Status:** decided  
**Date:** 2026-08-19

WatchTell should not remain a checklist-and-questions product.

**Pixel photo analysis (`QC-002`) and video analysis (`QC-003`) should be
implemented as soon as practical** (MVP). Artifact detection (`QC-009`)
travels with photo analysis so lighting and camera effects are not
treated as defects.

Until those land, the generator must still not invent pixel findings.

Affects: `QC-002`, `QC-003`, `QC-009`.

## DEC-003: Paid product is the listing report; explorers are subscriber access

**Status:** decided  
**Date:** 2026-08-19

The paid product is the **listing report**.

That report is **backed by WatchTell knowledge explorers**. Paying
subscribers get access to the explorers (`RESEARCH-*`, factory /
reference / seller pages as they exist).

Explorers are not a separate first paid SKU. They are part of what
makes the listing report possible and what subscribers can browse.

Affects: `REPORT-001`, `RESEARCH-001`–`RESEARCH-005`.

## DEC-004: Replica and grey-market QC stay separate

**Status:** decided  
**Date:** 2026-08-19

Replica listings and grey-market genuine listings **must not share QC
photos**.

They **must use separate QC decision trees** (checklists, known
variance, pixel/video rules, and verdicts).

Knowledge may name the same brand/reference, but QC assets, photo
corpora, and decision logic are not mixed. A replica factory tell is
not a grey-market inspection rule.

Affects: `QC-001`, `QC-002`, `QC-006`, `MODEL-004`, `EVAL-001`.

## DEC-005: Rename Prisma `Defect` to match known variance

**Status:** decided (not yet implemented)  
**Date:** 2026-08-19

Yes. Prisma `Defect` / seed `defects` should be renamed so the schema
matches product language: known factory variance is not automatically a
defect in a submitted photo.

Exact identifier (`KnownVariance`, `FactoryVariance`, or similar) is an
implementation choice. Preserve data and update `FACTORY-005` notes when
the migration lands. Do not treat the current table name as product
intent.

Affects: `FACTORY-005`, `QC-007`, `QC-008`.

## DEC-006: Factory comparison requires top-10 factory coverage

**Status:** decided  
**Date:** 2026-08-19

`FACTORY-007` is not honest until WatchTell can compare the **top 10
major factories**, not a two-row seed.

Coverage should include the factories already named as QC-profile
targets (VSF, Clean, APSF, PPF, CCF, RXF, RGF/RCF, QF, GMF, BPF, ZF,
ARF — pick and document the top 10 when seeding). Do not ship
side-by-side factory comparison on VSF-versus-unknown alone.

Affects: `FACTORY-001`, `FACTORY-007`, `QC-006`.

## DEC-007: Implement evidence-based seller reliability scores

**Status:** decided  
**Date:** 2026-08-19

Implement seller reliability scoring (`SELLER-002`).

Scores must be **evidence-based** (independence groups, recency,
fulfillment, QC communication, issue resolution, and similar inputs).
Dummy or decorative numbers remain forbidden.

Qualitative labels may remain as an interim display until a score can be
justified by evidence. A precise-looking number with no supporting
evidence is not allowed (Rule 3).

Affects: `SELLER-002`, `SELLER-003`, `EVAL-002`.
