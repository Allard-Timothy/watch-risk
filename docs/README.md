# WatchTell documentation

WatchTell docs follow the [Divio documentation system](https://docs.divio.com/documentation-system/).
There is no single kind of documentation. Every page belongs in one of four
quadrants:

| Quadrant | Oriented to | Answers | Lives in |
|---|---|---|---|
| Tutorials | Learning | “Can I do this?” | `docs/tutorials/` |
| How-to guides | A goal | “How do I…?” | `docs/how-to/` |
| Reference | Information | “What is this, exactly?” | `docs/reference/` |
| Explanation | Understanding | “Why is it this way?” | `docs/explanation/` |

Do not mix those purposes on one page. Link across quadrants instead.

## Tutorials

Lessons that take a beginner through a working result. The author chooses the
path. Keep explanation to the minimum needed to finish the steps.

- [Getting started](tutorials/getting-started.md) — run the app and open a
  sample buyer-risk report

## How-to guides

Recipes for a specific problem. Assume the reader already knows the product.
Title them so they can be prefixed with “How to”.

- [How to add a new watch reference](how-to/add-a-new-watch-reference.md)
- [How to persist cases locally](how-to/persist-cases-locally.md)

## Reference

Descriptions of the machinery: inventories, contracts, schemas, visual spec.
Describe. Do not teach, and do not argue why.

- [Product feature registry](reference/features.md) — canonical capability
  inventory (a listed feature is not evidence it is implemented)
- [TypeScript architecture](reference/architecture-typescript.md)
- [AI contract](reference/ai-contract.md)
- [Report rules](reference/report-rules.md)
- [Design guidance](reference/design-guidance.md)

## Explanation

Background, rationale, and discussion. Read away from the keyboard. Do not
include step-by-step recipes or API inventories.

- [Product vision](explanation/vision.md)
- [Product principles](explanation/principles.md)
- [Product decisions](explanation/decisions.md)
- [Product roadmap](explanation/roadmap.md)
- [Product brief](explanation/product-brief.md) — near-term MVP
- [Product boundaries](explanation/product-boundaries.md)
- [Risk scoring](explanation/risk-scoring.md)
- [Knowledge architecture](explanation/knowledge-architecture.md)
- [Migration plan](explanation/migration-plan.md)

## Choosing a quadrant

- A new engineer should be able to finish a **tutorial** without knowing WatchTell.
- An experienced contributor with a job to do needs a **how-to**.
- Code, schemas, feature IDs, and wording contracts belong in **reference**.
- “Why we do not authenticate,” scoring philosophy, and knowledge design belong
  in **explanation**.

If a page is doing two jobs, split it.

Product capability status still comes from the feature registry plus the
codebase. Architecture describes how something is designed. Code is what exists
today.
