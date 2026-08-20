# WatchTell product vision

WatchTell is a watch intelligence and decision-support platform, focused
initially on the replica-watch ecosystem.

It helps a buyer answer questions such as:

- Is this watch acceptable?
- Is this defect meaningful?
- Is this characteristic normal for this factory?
- Is the seller accurately representing the watch?
- What additional evidence should I request?
- Which factory should I buy for this reference?
- Which seller is the safer choice?
- What are the known weaknesses of this factory or version?
- How reliable is the movement?
- How strong is the evidence behind this conclusion?

WatchTell should combine visual analysis, watch-specific technical knowledge,
factory and version intelligence, seller intelligence, community knowledge,
evidence provenance, temporal context, and explicit uncertainty.

The system should produce practical decisions rather than generic commentary.

## What WatchTell is not

WatchTell is not an authentication product. It does not certify watches, verify
watches, or guarantee authenticity. Forum TD status is evidence, not a universal
trust score. Independent inspection remains appropriate when purchase risk is
material.

See [`docs/explanation/product-boundaries.md`](../explanation/product-boundaries.md)
and [`docs/report-rules.md`](../report-rules.md).

## Near-term product

The current shipped loop is a **photo-based buyer-risk report**: a buyer
captures listing details, photos, and seller claims; WatchTell flags missing
evidence, curated concerns, seller-risk signals, and questions to ask before
purchase.

The paid product is that listing report. It is backed by WatchTell
knowledge explorers; subscribers get explorer access (`DEC-003`).

QC GL/RL verdicts belong in the report alongside buyer-risk (`DEC-001`).
Pixel and video analysis are in MVP scope (`DEC-002`). Replica and
grey-market QC stay on separate trees and photo corpora (`DEC-004`).

That loop is the first useful product. It is not the whole product.

## Long-term product

The intended durable asset is WatchTell knowledge: structured claims, evidence,
provenance, factory/reference/movement dossiers, seller intelligence, and
real-world outcomes. LLMs, if used, consume that knowledge. They are not the
knowledge store.

The canonical capability list is [`docs/product/features.md`](features.md).
Principles are in [`docs/product/principles.md`](principles.md). Phasing is in
[`docs/product/roadmap.md`](roadmap.md). Resolved questions are in
[`docs/product/decisions.md`](decisions.md).

The existing short MVP brief remains [`docs/product-brief.md`](../product-brief.md).
Do not treat that brief as a reason to delete later-phase capabilities from the
registry.
