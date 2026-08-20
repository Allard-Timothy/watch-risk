# WatchTell product roadmap

This roadmap groups [`features.md`](features.md) IDs into phases. It does **not**
replace the registry, and it is **not** permission to implement anything.

Assumptions below are product judgments unless a matching entry exists in
[`docs/product/decisions.md`](decisions.md). Decisions win over this file.

Existing architecture plans remain:

- [`docs/architecture-typescript.md`](../architecture-typescript.md) — app
  shape, placeholders, report module
- [`docs/knowledge-architecture.md`](../knowledge-architecture.md) — ontology,
  claims, snapshots, later retrieval
- [`docs/migration-plan.md`](../migration-plan.md) — TypeScript rewrite and
  integration order
- [`docs/ai-contract.md`](../ai-contract.md) — structured output and safety

Those documents describe **how**. This file describes **when, hypothetically**.

## How to read status vs phase

- **Status** in the registry is repository evidence (`implemented`,
  `in-progress`, and so on).
- **Phase** is intended product timing (`MVP`, `V1`, `V2`, `Later`).
- A feature can be `in-progress` and still `MVP`.
- A feature can be `proposed` and `MVP` if the product needs it next.
- Do not implement a later-phase feature because it sits next to an MVP ID.

## Current repository position

As of the registry's first writing, WatchTell already has:

- Case intake, local photo storage, and a deterministic photo-completeness
  report (`REPORT-001`, `QC-010`)
- Curated seller, community, factory, and reference knowledge
  (`SELLER-001`, `FACTORY-001`, `MODEL-002`)
- Community TD comparison with independence grouping (`TD-001`–`TD-004`,
  `EVID-006`)
- No vision model, no video/timegrapher interpretation, no GL/RL verdicts,
  no outcome loop, no scraping, no embeddings

The live product is a **buyer-risk report**. QC GL/RL verdicts belong
**in** that report (`DEC-001`). Pixel and video analysis are MVP
(`DEC-002`) but are not implemented yet.

Resolved questions: [`docs/product/decisions.md`](decisions.md).

## Core systems (planning context only)

| System | Includes | Typical phase |
|---|---|---|
| A. Watch identification | `IDENT-001`–`IDENT-005` | MVP match from listing claims; V1–V2 from photos/movement |
| B. Factory-specific QC engine | `QC-001`–`QC-010` | MVP checklists plus photo/video analysis (`DEC-002`) |
| C. Verdict and risk engine | `VERDICT-001`–`VERDICT-005` | MVP buyer-risk headline plus GL/RL QC verdicts (`DEC-001`) |
| D. Watch knowledge layer | `FACTORY-*`, `MODEL-*`, `MOVE-*`, `KNOW-*` | MVP curated dossiers; V2 snapshots/movements |
| E. Seller intelligence | `SELLER-*`, `TD-*` | MVP curated dossiers; V1 time-aware scores |
| F. Evidence system | `EVID-*` | MVP provenance fields; V1 scoring; V2 conflict engine |
| G. WatchTell report | `REPORT-*` | MVP structured buyer-risk UI; V1 citations/drill-down |
| H. Ingestion and evaluation | `OUTCOME-*`, `EVAL-*`, `KNOW-005` | Later, except provider-independence now |

## MVP

**Hypothesis:** the first useful WatchTell system is a listing-level
decision aid that uses curated, reference- and factory-specific knowledge,
asks for the right evidence, and refuses to fake visual conclusions.

Why this stage exists: buyers already lose money on incomplete photos,
generic QC advice, and TD labels that do not travel across forums. The
repository already implements much of this loop.

### Identification and knowledge (listing claims, not pixels)

- `IDENT-001` Brand and reference identification (typed match)
- `IDENT-002` Factory identification (dossier/claim match)
- `FACTORY-001` Factory dossiers (curated seed)
- `FACTORY-002` Factory-by-reference knowledge
- `FACTORY-005` Known defect database (qualitative)
- `FACTORY-006` Acceptable variance database
- `MODEL-002` Model and reference dossiers
- `MODEL-004` Reference-specific QC checklist
- `KNOW-001` Structured watch ontology (seed subset)
- `KNOW-002` Entity resolution (exact alias / normalized reference)
- `KNOW-004` Compact knowledge dossiers (manually curated)

### QC without inventing pixel findings (until QC-002 lands)

- `QC-001` Model-specific QC analysis (checklist + known variance)
- `QC-002` QC photo analysis (**ASAP / MVP**, `DEC-002`; not implemented)
- `QC-003` QC video analysis (**ASAP / MVP**, `DEC-002`; not implemented)
- `QC-006` Factory-specific QC profiles
- `QC-007` Known flaw recognition (as curated notes, not photo detection)
- `QC-008` Normal variance recognition (as curated notes)
- `QC-009` Photo and lighting artifact detection (with `QC-002`)
- `QC-010` Additional evidence requests

### Verdict, report, and uncertainty

- `VERDICT-001` Issue classification (missing evidence vs seller/process)
- `VERDICT-002` Severity scoring (coarse)
- `VERDICT-003` QC verdict system (GL/RL **inside** the buyer-risk report,
  `DEC-001`)
- `VERDICT-004` Confidence score (report-level caps)
- `VERDICT-005` Explainable verdict (safe summary + next step)
- `REPORT-001` Structured QC / buyer-risk report
- `REPORT-002` Overall WatchTell assessment (buyer-risk headline today)
- `REPORT-003` Risk breakdown (qualitative chips)
- `REPORT-004` Confidence indicators
- `REPORT-009` Calm decision-oriented UI

### Seller and TD evidence already in the product

Seller work is **alongside** the QC MVP, not a later add-on, because the
repository already ships seller dossiers and community comparison.

- `SELLER-001` Seller dossiers
- `SELLER-002` Seller reliability scoring (evidence-based, `DEC-007`)
- `SELLER-004` QC communication rating (curated qualitative)
- `SELLER-005` Fulfillment reliability (curated qualitative)
- `TD-001` Cross-forum TD comparison
- `TD-002` TD overlap analysis
- `TD-003` Forum-specific seller analysis
- `TD-004` Seller provenance
- `EVID-002` Evidence attachment
- `EVID-003` Source provenance
- `EVID-006` Source independence detection
- `EVID-009` Conflict-of-interest context (source/evidence kinds)

### Product constraint to keep now

- `EVAL-003` Provider-independent reasoning (knowledge stays in WatchTell)

**MVP does not include:** timegrapher interpretation (`QC-004`), scraping,
embeddings, or user accounts. Pixel/video QC and GL/RL **are** MVP
(`DEC-002`, `DEC-001`) even though they are not in the codebase yet.

The paid SKU is the listing report; subscribers also get knowledge
explorers (`DEC-003`). Replica and grey-market QC trees stay separate
(`DEC-004`).

## V1

**Hypothesis:** after photo/video QC and GL/RL are in the listing report,
thicken identification, tells, time-aware seller history, and citations.

Why this stage exists: MVP visual QC still needs version/tells depth,
recency-aware seller reputation, and traceable sources.

- `VERDICT-001` fuller taxonomy (defect vs variance vs artifact)
- `IDENT-003` Factory version identification
- `FACTORY-003` Factory version history
- `FACTORY-004` Known tells database
- `MODEL-001` Brand knowledge pages
- `MODEL-003` Top replicated brands and models
- `SELLER-003` Time-aware seller reputation
- `SELLER-006` Issue resolution history
- `SELLER-007` Representation accuracy
- `PRICE-001` Price reasonableness analysis
- `EVID-001` Claim extraction (manual/assisted, not a crawler)
- `EVID-004` Source quality scoring
- `EVID-007` Recency weighting applied at runtime
- `REPORT-005` Source citations
- `REPORT-007` Recency indicators
- `REPORT-008` Disagreement indicators
- `RESEARCH-003` Seller intelligence explorer (filters, trends)
- `EVAL-004` Auditable reasoning inputs
- `EVAL-001` first evaluation cases for photo QC

Integrations that the architecture already lists as placeholders may land
in V1 when the paid report workflow needs them (Postgres is already
required for saved cases; Stripe, OpenAI, and GCS remain placeholders).
Those integrations are infrastructure, not registry features.

## V2

**Hypothesis:** deepen comparison and movement intelligence. Knowledge
explorers remain subscriber access to the listing-report product
(`DEC-003`), not a separate first SKU.

Why this stage exists: buyers choose factory and seller *before* QC photos
exist. Movement reliability and version/batch differences also cannot be
judged from a dial macro alone. `FACTORY-007` waits on top-10 factory
coverage (`DEC-006`).

- `QC-004` Timegrapher analysis
- `QC-005` Weight and dimension analysis
- `IDENT-004` Batch and production-period awareness
- `IDENT-005` Movement identification
- `FACTORY-007` Factory comparison
- `FACTORY-008` Best factory by model guidance
- `MOVE-001` Movement dossiers
- `MOVE-002` Movement reliability history
- `MOVE-003` Movement and reference compatibility
- `SELLER-008` Payment risk
- `SELLER-009` Seller comparison
- `SELLER-010` Seller recommendation context
- `PRICE-002` Price versus quality assessment
- `PRICE-003` Modification and value assessment
- `EVID-005` Corroboration scoring
- `EVID-008` Conflict detection
- `KNOW-003` Versioned knowledge snapshots
- `REPORT-006` Evidence drill-down
- `RESEARCH-001` Factory × brand × model explorer
- `RESEARCH-002` Known tells explorer
- `RESEARCH-004` Factory comparison explorer
- `EVAL-002` Scoring calibration

## Later

**Hypothesis:** proprietary outcomes, selective raw retrieval, and
evaluation harnesses become durable advantages after the ontology and
curated dossiers are trustworthy.

Why this stage is last: crawling, embeddings, and outcome loops are
expensive and easy to build in the wrong shape. See Rule 4 and
[`docs/knowledge-architecture.md`](../knowledge-architecture.md) Phase 3–4.

- `KNOW-005` Selective raw retrieval
- `RESEARCH-005` Community intelligence summaries
- `OUTCOME-001` Post-purchase outcome reporting
- `OUTCOME-002` Seller outcome feedback
- `OUTCOME-003` Factory and version confirmation
- `OUTCOME-004` Service and failure reports
- `OUTCOME-005` Prediction versus outcome tracking
- `EVAL-001` full evaluation dataset
- Automated ingestion, embeddings, and semantic evidence search as
  *supporting* infrastructure only when `KNOW-005` is requested

Do not add vector databases, scrapers, extra model providers, or graph
databases solely because this phase mentions them.

## Dependency chains

Routine QC path:

```text
Structured knowledge (KNOW-001, KNOW-004)
      ↓
Reference / factory identification (IDENT-001, IDENT-002)
      ↓
Factory-specific QC profiles (QC-006, MODEL-004)
      ↓
QC observations (QC-001, QC-002, QC-003)
      ↓
Severity + confidence (VERDICT-002, VERDICT-004)
      ↓
Verdict / assessment (REPORT-002 + VERDICT-003)
      ↓
Outcome feedback (OUTCOME-*)
      ↓
Evaluation + knowledge improvement (EVAL-*, KNOW-003)
```

Seller path:

```text
Sources (EVID-003)
   ↓
Claims (EVID-001)
   ↓
Evidence / provenance (EVID-002, EVID-006)
   ↓
Seller dossier (SELLER-001)
   ↓
Seller risk assessment (SELLER-002, SELLER-003)
   ↓
Transaction recommendation (SELLER-010)
   ↓
Real outcome (OUTCOME-002)
```

Knowledge compilation path:

```text
Raw source
   ↓
Source metadata (EVID-003)
   ↓
Claim extraction (EVID-001)
   ↓
Entity resolution (KNOW-002)
   ↓
Evidence evaluation (EVID-004)
   ↓
Corroboration / conflict (EVID-005, EVID-008)
   ↓
Structured knowledge (KNOW-001)
   ↓
Dossier / QC profile (KNOW-004, QC-006)
```

Do not implement a later box in a chain because an earlier box exists.

## What this roadmap is not

- Not permission to implement adjacent IDs
- Not a replacement for buyer-risk language: GL/RL is included, not a
  substitute (`DEC-001`)
- Not a license to scrape, embed, or add new cloud services
- Not a license to share replica and grey-market QC photos (`DEC-004`)
