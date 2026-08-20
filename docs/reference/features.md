# WatchTell product feature registry

This is the canonical inventory of WatchTell **product capabilities**.

- The feature registry describes the **intended product**.
- Architecture documentation describes **how** capabilities are designed.
- The codebase describes **what is currently implemented**.

Agents must never treat those three things as interchangeable.

A listed feature is **not** evidence that the feature currently exists.
Status values below are based on repository evidence at the time of the last
registry update. Do not infer implementation from architecture diagrams.

Related documents:

- Vision: [`docs/explanation/vision.md`](../explanation/vision.md)
- Principles: [`docs/explanation/principles.md`](../explanation/principles.md)
- Roadmap: [`docs/explanation/roadmap.md`](../explanation/roadmap.md)
- Resolved decisions: [`docs/explanation/decisions.md`](../explanation/decisions.md)
- Current MVP brief: [`docs/explanation/product-brief.md`](../explanation/product-brief.md)
- Architecture: [`docs/reference/architecture-typescript.md`](architecture-typescript.md)
- Knowledge architecture: [`docs/explanation/knowledge-architecture.md`](../explanation/knowledge-architecture.md)
- AI contract: [`docs/reference/ai-contract.md`](ai-contract.md)
- Report rules: [`docs/reference/report-rules.md`](report-rules.md)

## How agents should use this file

When asked to implement WatchTell functionality:

1. Identify relevant feature IDs (read only those sections and their
   dependencies).
2. Inspect current implementation.
3. Determine current feature status.
4. Limit work to the requested feature scope.
5. Do not automatically implement adjacent backlog items.
6. Update **status** (and notes) when implementation materially changes.
7. Update architecture docs only when architecture materially changes.

Stable IDs may be used in issues, plans, commits, and prompts
(`Implement FACTORY-004 and QC-006`).

Do not paste this entire file into agent context. `AGENTS.md` points here;
agents should open the relevant IDs only.

## Metadata

| Field | Allowed values |
|---|---|
| `id` | Stable, unique, domain-prefixed (`QC-001`, `SELLER-003`, …) |
| `status` | `proposed` · `planned` · `in-progress` · `implemented` · `deferred` |
| `phase` | `MVP` · `V1` · `V2` · `Later` |
| `priority` | `critical` · `high` · `medium` · `low` |

**Status** is repository evidence. **Phase** is product timing (a judgment;
see the roadmap). Do not reuse an ID for unrelated functionality. If a
feature is retired, keep the ID and mark it rather than deleting history.

Phase and priority are labeled judgments where the existing product brief
and knowledge-architecture plan do not already decide them.

## Core systems

Planning groups only. They do not merge distinct user capabilities.

| System | Feature IDs |
|---|---|
| A. Watch identification | `IDENT-001`–`IDENT-005` |
| B. Factory-specific QC engine | `QC-001`–`QC-010` |
| C. Verdict and risk engine | `VERDICT-001`–`VERDICT-005` |
| D. Watch knowledge layer | `FACTORY-*`, `MODEL-*`, `MOVE-*`, `KNOW-001`–`KNOW-004` |
| E. Seller intelligence | `SELLER-*`, `TD-*` |
| F. Evidence system | `EVID-*` |
| G. WatchTell report | `REPORT-*` |
| H. Ingestion and evaluation | `OUTCOME-*`, `EVAL-*`, `KNOW-005` |

## Overlapping concepts (intentionally separate)

These are related but not the same capability:

| Concept | IDs | Difference |
|---|---|---|
| Factory QC profile vs known flaw vs known defect vs variance | `QC-006`, `QC-007`, `FACTORY-005`, `QC-008`, `FACTORY-006` | Profile = expectations; recognition = applying them to a watch; defect DB = durable catalog; variance DB = acceptable spread |
| Model dossier vs QC checklist vs model-specific QC | `MODEL-002`, `MODEL-004`, `QC-001` | Dossier = knowledge; checklist = what to inspect; analysis = using that on a case |
| Compact dossiers vs entity pages vs explorers | `KNOW-004`, `FACTORY-001`, `MODEL-002`, `SELLER-001`, `RESEARCH-*` | Runtime artifacts vs browsable research UI |
| Buyer-risk headline vs QC verdict | `REPORT-002`, `VERDICT-003` | Both ship: buyer-risk is the primary conclusion; GL/RL QC verdicts are included in the report (`DEC-001`) |
| Claim vs evidence vs source | `EVID-001`, `EVID-002`, `EVID-003` | Statement vs support vs origin |
| Independence vs corroboration vs consensus | `EVID-006`, `EVID-005`, Rule 2 | Same ecosystem ≠ more evidence |

---

# Index

| ID | Name | Status | Phase | Priority |
|---|---|---|---|---|
| QC-001 | Model-specific QC analysis | in-progress | MVP | critical |
| QC-002 | QC photo analysis | proposed | MVP | critical |
| QC-003 | QC video analysis | proposed | MVP | critical |
| QC-004 | Timegrapher analysis | proposed | V2 | high |
| QC-005 | Weight and dimension analysis | proposed | V2 | medium |
| QC-006 | Factory-specific QC profiles | in-progress | MVP | critical |
| QC-007 | Known flaw recognition | in-progress | MVP | critical |
| QC-008 | Normal variance recognition | in-progress | MVP | high |
| QC-009 | Photo and lighting artifact detection | proposed | MVP | high |
| QC-010 | Additional evidence requests | implemented | MVP | critical |
| VERDICT-001 | Issue classification | in-progress | MVP | critical |
| VERDICT-002 | Severity scoring | in-progress | MVP | high |
| VERDICT-003 | QC verdict system | proposed | MVP | critical |
| VERDICT-004 | Confidence score | in-progress | MVP | critical |
| VERDICT-005 | Explainable verdict | in-progress | MVP | critical |
| IDENT-001 | Brand and reference identification | in-progress | MVP | critical |
| IDENT-002 | Factory identification | in-progress | MVP | critical |
| IDENT-003 | Factory version identification | in-progress | V1 | high |
| IDENT-004 | Batch and production-period awareness | proposed | V2 | medium |
| IDENT-005 | Movement identification | proposed | V2 | high |
| FACTORY-001 | Factory dossiers | in-progress | MVP | critical |
| FACTORY-002 | Factory-by-reference knowledge | in-progress | MVP | critical |
| FACTORY-003 | Factory version history | in-progress | V1 | high |
| FACTORY-004 | Known tells database | proposed | V1 | high |
| FACTORY-005 | Known defect database | in-progress | MVP | critical |
| FACTORY-006 | Acceptable variance database | in-progress | MVP | high |
| FACTORY-007 | Factory comparison | proposed | V2 | high |
| FACTORY-008 | Best factory by model guidance | proposed | V2 | medium |
| MODEL-001 | Brand knowledge pages | proposed | V1 | medium |
| MODEL-002 | Model and reference dossiers | in-progress | MVP | critical |
| MODEL-003 | Top replicated brands and models | proposed | V1 | medium |
| MODEL-004 | Reference-specific QC checklist | implemented | MVP | critical |
| MOVE-001 | Movement dossiers | proposed | V2 | high |
| MOVE-002 | Movement reliability history | proposed | V2 | high |
| MOVE-003 | Movement and reference compatibility | proposed | V2 | high |
| SELLER-001 | Seller dossiers | in-progress | MVP | critical |
| SELLER-002 | Seller reliability scoring | in-progress | MVP | high |
| SELLER-003 | Time-aware seller reputation | in-progress | V1 | high |
| SELLER-004 | QC communication rating | in-progress | MVP | high |
| SELLER-005 | Fulfillment reliability | in-progress | MVP | high |
| SELLER-006 | Issue resolution history | in-progress | V1 | high |
| SELLER-007 | Representation accuracy | in-progress | V1 | high |
| SELLER-008 | Payment risk | proposed | V2 | medium |
| SELLER-009 | Seller comparison | proposed | V2 | medium |
| SELLER-010 | Seller recommendation context | proposed | V2 | medium |
| TD-001 | Cross-forum trusted dealer comparison | in-progress | MVP | high |
| TD-002 | TD overlap analysis | implemented | MVP | high |
| TD-003 | Forum-specific seller analysis | in-progress | MVP | high |
| TD-004 | Seller provenance | in-progress | MVP | critical |
| PRICE-001 | Price reasonableness analysis | proposed | V1 | medium |
| PRICE-002 | Price versus quality assessment | proposed | V2 | medium |
| PRICE-003 | Modification and value assessment | proposed | V2 | medium |
| EVID-001 | Claim extraction | in-progress | V1 | high |
| EVID-002 | Evidence attachment | in-progress | MVP | high |
| EVID-003 | Source provenance | in-progress | MVP | high |
| EVID-004 | Source quality scoring | proposed | V1 | high |
| EVID-005 | Corroboration scoring | proposed | V2 | high |
| EVID-006 | Source independence detection | implemented | MVP | critical |
| EVID-007 | Recency weighting | in-progress | V1 | high |
| EVID-008 | Conflict detection | proposed | V2 | high |
| EVID-009 | Conflict-of-interest and incentive context | in-progress | MVP | high |
| KNOW-001 | Structured watch ontology | in-progress | MVP | critical |
| KNOW-002 | Entity resolution | in-progress | MVP | critical |
| KNOW-003 | Versioned knowledge snapshots | proposed | V2 | high |
| KNOW-004 | Compact knowledge dossiers | in-progress | MVP | critical |
| KNOW-005 | Selective raw retrieval | proposed | Later | medium |
| REPORT-001 | Structured QC report | in-progress | MVP | critical |
| REPORT-002 | Overall WatchTell assessment | in-progress | MVP | critical |
| REPORT-003 | Risk breakdown | in-progress | MVP | high |
| REPORT-004 | Confidence indicators | implemented | MVP | critical |
| REPORT-005 | Source citations | proposed | V1 | high |
| REPORT-006 | Evidence drill-down | proposed | V2 | medium |
| REPORT-007 | Recency indicators | proposed | V1 | medium |
| REPORT-008 | Disagreement indicators | proposed | V1 | high |
| REPORT-009 | Calm decision-oriented UI | in-progress | MVP | high |
| OUTCOME-001 | Post-purchase outcome reporting | proposed | Later | medium |
| OUTCOME-002 | Seller outcome feedback | proposed | Later | medium |
| OUTCOME-003 | Factory and version confirmation | proposed | Later | medium |
| OUTCOME-004 | Service and failure reports | proposed | Later | medium |
| OUTCOME-005 | Prediction versus outcome tracking | proposed | Later | high |
| EVAL-001 | Evaluation dataset | proposed | V1 | high |
| EVAL-002 | Scoring calibration | proposed | V2 | medium |
| EVAL-003 | Provider-independent reasoning | in-progress | MVP | critical |
| EVAL-004 | Auditable reasoning inputs | in-progress | V1 | high |
| RESEARCH-001 | Factory × brand × model knowledge explorer | in-progress | V2 | medium |
| RESEARCH-002 | Known tells explorer | proposed | V2 | medium |
| RESEARCH-003 | Seller intelligence explorer | in-progress | V1 | high |
| RESEARCH-004 | Factory comparison explorer | proposed | V2 | medium |
| RESEARCH-005 | Community intelligence summaries | proposed | Later | medium |

---

# Domain 1: Watch QC analysis

## QC-001: Model-specific QC analysis

**Category:** QC Analysis  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Evaluate a submitted watch against expectations for its specific brand,
reference, factory, and known version rather than applying generic
watch-quality rules.

### Dependencies

- IDENT-001
- FACTORY-002
- MODEL-004
- KNOW-004

### Acceptance Criteria

- Analysis can use reference-specific QC rules.
- Factory-specific known flaws are considered.
- Known production variance is not automatically classified as a defect.
- Findings identify the knowledge context used.
- Unsupported specificity is not invented.
- When the exact factory/version is unknown, the system falls back explicitly
  and lowers confidence (Rule 1).
- Replica and grey-market genuine listings use separate QC decision trees
  and must not share QC photos (`DEC-004`).

### Implementation Notes

Curated dossiers under `data/knowledge/references/` supply
`requiredPhotos`, `riskCheckpoints`, `knownVariance`, and
`highValueChecks`. `generateReport` uses those for missing-evidence concerns
and seller questions. There is **no pixel analysis** yet (`QC-002` is MVP
per `DEC-002`). A matched dossier is not a conclusion that the watch is
that reference. Listing-market type (replica vs grey-market) is not
modeled on `WatchCase` yet.

## QC-002: QC photo analysis

**Category:** QC Analysis  
**Status:** proposed  
**Phase:** MVP  
**Priority:** critical

### Purpose

Automate and standardize visual QC currently performed manually through
community inspection.

### Dependencies

- QC-001
- QC-006
- IDENT-001
- VERDICT-001
- QC-009

### Acceptance Criteria

- Submitted still photos can be inspected for relevant characteristics
  (dial alignment, indices, printing, bezel, rehaut, date window, cyclops,
  crystal, hands, case finishing, crown, SELs, bracelet, clasp, lume,
  visible movement details, and model-specific tells).
- Observations are structured and tied to a photo area.
- Analysis does not claim authenticity.
- Missing or unusable photos produce `cannot assess from submitted images`,
  not invented findings.

### Implementation Notes

`CaseImage` has unused `detectedType`, `qualityScore`, `usable`, and
`analysisJson` fields. `imageClassificationSchema` exists in
`lib/validation/report.ts`. OpenAI is a placeholder; the generator
explicitly does not inspect pixels. **Decided:** implement as soon as
practical (`DEC-002`). Replica and grey-market photo corpora must stay
separate (`DEC-004`).

## QC-003: QC video analysis

**Category:** QC Analysis  
**Status:** proposed  
**Phase:** MVP  
**Priority:** critical

### Purpose

Detect functional problems that cannot be evaluated reliably using
photographs.

### Dependencies

- QC-001
- IDENT-005
- VERDICT-001

### Acceptance Criteria

- Functional videos can be evaluated for behavior such as hand setting,
  crown positions, winding, date change, GMT/chronograph/moonphase/
  calendar operation, bezel action, rotor behavior, and movement function.
- Findings distinguish “not shown” from “shown and concerning”.

### Implementation Notes

No video upload, storage type, or analysis path exists. **Decided:**
implement as soon as practical (`DEC-002`). Do not mix replica and
grey-market QC video (`DEC-004`).

## QC-004: Timegrapher analysis

**Category:** QC Analysis  
**Status:** proposed  
**Phase:** V2  
**Priority:** high

### Purpose

Determine whether movement readings appear healthy, questionable,
abnormal, or require additional evidence.

### Dependencies

- IDENT-005
- MOVE-002
- QC-010

### Acceptance Criteria

- Rate, amplitude, beat error, lift angle, orientation, and measurement
  conditions can be interpreted against expected ranges for the movement
  family when known.
- Missing timegrapher evidence is requested rather than assumed.

### Implementation Notes

Some `highValueChecks` already ask for a timegrapher reading
(e.g. VSF 116610LV). That is `QC-010`, not interpretation of numbers.
No timegrapher input fields exist on `WatchCase`.

## QC-005: Weight and dimension analysis

**Category:** QC Analysis  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Identify incorrect versions, suspicious seller claims, unusual builds, or
manufacturing deviations.

### Dependencies

- MODEL-002
- IDENT-002
- SELLER-007

### Acceptance Criteria

- Supplied weight, case diameter, thickness, lug width, bracelet, and
  component measurements can be compared to expected ranges.
- Out-of-range values are claims-versus-knowledge, not authentication.

### Implementation Notes

Dossiers store `caseSize` as a string. No measurement intake or range
comparison exists.

## QC-006: Factory-specific QC profiles

**Category:** QC Analysis  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Judge watches according to realistic expectations for the actual
factory/reference combination. Profiles must be model-specific where
possible. Coverage should grow beyond the seed set (VSF, Clean, APSF,
PPF, CCF, RXF, RGF/RCF, QF, GMF, BPF, ZF, ARF, and others).

### Dependencies

- FACTORY-001
- FACTORY-002
- MODEL-004
- KNOW-004

### Acceptance Criteria

- A factory/reference pair can load a QC profile.
- Generic “factory X is good” rules are not applied sideways to other
  references (Rule 1).
- Unknown factory falls back explicitly.
- Top-10 major factory coverage is required before `FACTORY-007`
  comparison is honest (`DEC-006`).

### Implementation Notes

Factory seed exists for `vsf` and `unknown` (`data/knowledge/factories/`).
Dossiers name a factory; `matchFactory` resolves it. This is not yet a
full per-factory QC profile catalog.

## QC-007: Known flaw recognition

**Category:** QC Analysis  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Prevent unnecessary RL recommendations for characteristics likely to
appear on replacement examples as well.

### Dependencies

- FACTORY-005
- QC-006
- VERDICT-001

### Acceptance Criteria

- Characteristics known to be inherent or common to a
  factory/reference/version are recognizable as such.
- A known flaw is not treated as proof that *this* photo shows that flaw.
- Known flaws remain distinct from unique defects on one watch.

### Implementation Notes

Factory `Defect` rows and dossier `knownVariance` are shown as “Known
factory variance” on saved-case reports. Concerns are added only when the
relevant photo is **missing**. No visual recognition of the flaw in a
photo.

## QC-008: Normal variance recognition

**Category:** QC Analysis  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Reduce false-positive defect detection by differentiating factory flaws,
manufacturing defects, normal production variance, genuine variance, and
harmless cosmetic variation.

### Dependencies

- FACTORY-006
- VERDICT-001
- QC-007

### Acceptance Criteria

- Findings can be classified as variance rather than defect when knowledge
  supports it.
- Variance notes state what photos cannot show.

### Implementation Notes

`knownVariance` on model dossiers is the current catalog. The generator
does not yet classify a visual observation as variance vs defect because
there are no visual observations.

## QC-009: Photo and lighting artifact detection

**Category:** QC Analysis  
**Status:** proposed  
**Phase:** MVP  
**Priority:** high

### Purpose

Prevent confident QC conclusions from misleading photography.

### Dependencies

- QC-002
- VERDICT-001
- VERDICT-004

### Acceptance Criteria

- Apparent defects that may result from perspective, angle, distortion,
  glare, reflection, lighting, compression, motion blur, or low resolution
  can be flagged as possible artifacts.
- Artifact suspicion lowers confidence rather than silently dropping the
  finding.

### Implementation Notes

`imageQuality` on `ReportInput` (`clear` / `mixed` / `poor`) only caps
confidence. No artifact detector exists. Travels with `QC-002` (`DEC-002`).

## QC-010: Additional evidence requests

**Category:** QC Analysis  
**Status:** implemented  
**Phase:** MVP  
**Priority:** critical

### Purpose

Convert uncertainty into a useful next action.

### Dependencies

- MODEL-004
- REPORT-001

### Acceptance Criteria

- When confidence is insufficient, WatchTell specifies exactly what is
  needed (straight-on dial, side profile, date values, crown, movement,
  bezel video, hand-setting video, timegrapher, serial/reference photo,
  weight, additional lighting, and similar).
- Requests are reference-specific when a dossier exists.
- Generic “send more photos” is not the only output.

### Implementation Notes

`generateReport` emits `missingEvidence` and `sellerQuestions` from
required photos and `highValueChecks`. Coverage is still-photo-centric;
video/weight/serial requests appear only when encoded in a dossier check.

---

# Domain 2: QC classification and verdicts

## VERDICT-001: Issue classification

**Category:** Verdicts  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Give context to observations instead of presenting an undifferentiated
defect list.

### Dependencies

- QC-001
- QC-007
- QC-008
- QC-009

### Acceptance Criteria

- Findings can be classified into concepts such as objective defect, known
  factory flaw, known factory tell, normal production variance, possible
  photo artifact, possible defect requiring evidence, cosmetic issue,
  functional issue, movement concern, authenticity concern (internal
  only — not a user-facing authenticity conclusion), factory
  identification concern, seller/process concern, and insufficient
  evidence.

### Implementation Notes

`ImageFinding` has `area`, `severity`, `finding`, `visibleEvidence`.
Current concerns are mostly missing-checkpoint, seller `product_claim`
flags, and manual notes. No classification enum yet. User-facing text
must still follow `docs/reference/report-rules.md`.

## VERDICT-002: Severity scoring

**Category:** Verdicts  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Separate meaningful QC issues from minor imperfections (Rule 9).

### Dependencies

- VERDICT-001
- QC-007
- FACTORY-006

### Acceptance Criteria

- Severity considers visibility, wrist visibility, functional impact,
  permanence, fixability, replacement likelihood, expected factory
  characteristics, and whether replacements likely share the issue.
- Scores are not dummy precision.

### Implementation Notes

Findings use `low` / `medium` / `high`. Missing factory-variance photos
are hardcoded `medium`. No wrist-visibility or fixability model.

## VERDICT-003: QC verdict system

**Category:** Verdicts  
**Status:** proposed  
**Phase:** MVP  
**Priority:** critical

### Purpose

Give users a clear recommendation while retaining nuance.

### Dependencies

- VERDICT-001
- VERDICT-002
- VERDICT-004
- VERDICT-005
- REPORT-002

### Acceptance Criteria

- Support verdicts such as GL, GL with reservations, Conditional GL,
  Request additional evidence, RL, and Insufficient evidence.
- Verdicts remain explainable and must not use forbidden authentication
  words.
- The buyer-risk headline (`REPORT-002`) remains the primary shipped
  conclusion; QC verdicts are included in the same report (`DEC-001`).

### Implementation Notes

Not implemented. Current reports use `overallRisk` buyer-risk language.
**Decided:** include GL/RL QC verdicts inside the buyer-risk report
(`DEC-001`). Do not replace the headline with GL/RL alone. See mapping
in `docs/explanation/decisions.md`.

## VERDICT-004: Confidence score

**Category:** Verdicts  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Make uncertainty visible (Rule 3).

### Dependencies

- QC-010
- EVID-004
- IDENT-001

### Acceptance Criteria

- Confidence can attach to individual observations, identification,
  knowledge claims, seller assessments, and the overall verdict.
- Caps apply when evidence is missing (`docs/reference/report-rules.md`).

### Implementation Notes

Report-level `confidence` (`low` / `medium` / `high`) is implemented with
deterministic caps (no dial, poor/stock photos, missing photo count).
Per-observation and identification confidence are not implemented.
Seller `trustDimensions` are separate qualitative labels.

## VERDICT-005: Explainable verdict

**Category:** Verdicts  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Prevent WatchTell from becoming an opaque scoring engine (Rule 8).

### Dependencies

- VERDICT-001
- QC-007
- SELLER-001
- EVID-002

### Acceptance Criteria

- The recommendation can cite which observations, factory characteristics,
  evidence, known issues, and transaction concerns drove it.
- Knowledge context used is identifiable.

### Implementation Notes

`safeSummary`, `recommendedNextStep`, `visibleEvidence` strings, factory
variance disclaimer, and seller recognition groups exist. There is no
structured observation → knowledge → evidence → recommendation chain.

---

# Domain 3: Watch identification

## IDENT-001: Brand and reference identification

**Category:** Identification  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Load the correct knowledge and QC profile.

### Dependencies

- MODEL-002
- KNOW-002

### Acceptance Criteria

- Probable brand, collection, model, and reference can be determined from
  submitted images and metadata.
- Unmatched references do not invent a dossier.
- Confidence drops when identification is claim-only.

### Implementation Notes

Buyers type brand/reference on intake. `matchModelDossier` matches
normalized reference (and brand when multiple hit). No image-based
identification. Three seed dossiers: VSF 116610LV, VSF 126610LN, Omega
310.30.42.50.01.001.

## IDENT-002: Factory identification

**Category:** Identification  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Detect incorrect representation and choose correct factory-specific
knowledge when factory is unknown, seller claims are uncertain, evidence
contradicts the claimed factory, or the user asks for identification.

### Dependencies

- FACTORY-001
- FACTORY-004
- IDENT-001
- SELLER-007

### Acceptance Criteria

- Probable factory can be estimated from claims and, later, visual tells.
- A listing factory label remains a claim until evidence supports it.
- Unknown factory is explicit.

### Implementation Notes

`matchFactory` maps a dossier/listing label to `vsf` or `unknown`.
Reports show “Factory claim” from the dossier. No tell-based factory
estimation from photos.

## IDENT-003: Factory version identification

**Category:** Identification  
**Status:** in-progress  
**Phase:** V1  
**Priority:** high

### Purpose

Account for changes, fixes, regressions, and updated components between
factory releases (V1–V5 and similar).

### Dependencies

- FACTORY-003
- IDENT-002
- FACTORY-004

### Acceptance Criteria

- Known production versions can be distinguished when evidence exists.
- Version is not guessed from a generic factory label.

### Implementation Notes

Dossiers may set `factoryVersion` (e.g. `vsf-current`). Factory seed has
a single “Current curated notes” version. MVP copy states version is not
resolved from listing photos.

## IDENT-004: Batch and production-period awareness

**Category:** Identification  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Prevent outdated assumptions from being applied to current examples.

### Dependencies

- FACTORY-003
- EVID-007
- KNOW-001

### Acceptance Criteria

- Meaningful batch or production-period differences are tracked when
  evidence supports them.
- Knowledge validity windows are visible.

### Implementation Notes

No `Batch` / `FactoryBatch` entity is implemented (named in
knowledge-architecture only).

## IDENT-005: Movement identification

**Category:** Identification  
**Status:** proposed  
**Phase:** V2  
**Priority:** high

### Purpose

Support movement reliability, watch identification, and seller-claim
verification.

### Dependencies

- MOVE-001
- MOVE-003
- QC-002
- QC-003

### Acceptance Criteria

- Movement family/version can be estimated from movement photos,
  architecture, balance layout, regulating hardware, bridges, rotor,
  markings, hand/crown behavior, and known factory configuration.
- Without a movement photo, movement cannot be assessed.

### Implementation Notes

`movementFamily` is a dossier string framed as a listing claim. Reports
say movement cannot be assessed without a movement photo. No movement
entity or photo identification.

---

# Domain 4: Factory intelligence

## FACTORY-001: Factory dossiers

**Category:** Factory Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Provide durable factory intelligence without repeatedly researching basic
facts.

### Dependencies

- KNOW-001
- KNOW-004
- EVID-003

### Acceptance Criteria

- Structured profiles exist per known factory, with room for aliases,
  specialties, production history, active/inactive status, known models,
  quality patterns, issues, strengths, movement usage, release history,
  and evidence confidence.
- A factory label is not a numeric score.

### Implementation Notes

Prisma `Factory` / `FactoryVersion` / `Defect`; JSON under
`data/knowledge/factories/`; UI at `/factories` and `/factories/[factoryId]`.
Seed is VSF + unknown. Dossiers are thin (notes, versions, qualitative
defects).

## FACTORY-002: Factory-by-reference knowledge

**Category:** Factory Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Avoid overly broad statements such as “VSF is best.” Factory quality
depends heavily on the watch being produced.

### Dependencies

- FACTORY-001
- MODEL-002
- QC-006

### Acceptance Criteria

- Factory performance and known issues can be tracked at the individual
  reference level.
- Cross-reference generalization is explicit fallback, not default.

### Implementation Notes

`Defect.references[]` and per-reference model dossiers. No factory×reference
quality comparison object.

## FACTORY-003: Factory version history

**Category:** Factory Intelligence  
**Status:** in-progress  
**Phase:** V1  
**Priority:** high

### Purpose

Keep analysis aware of factory evolution: releases, upgrades, regressions,
and component/movement/dial/crystal/case changes.

### Dependencies

- FACTORY-001
- IDENT-003
- EVID-007

### Acceptance Criteria

- Version-specific problems and changes are stored with temporal context.
- Older version issues are not applied to a newer version by default.

### Implementation Notes

`FactoryVersion` exists with a single current snapshot per seed factory.
No upgrade/regression timeline.

## FACTORY-004: Known tells database

**Category:** Factory Intelligence  
**Status:** proposed  
**Phase:** V1  
**Priority:** high

### Purpose

Support identification, QC, comparison, and education with visual and
functional tells tied to factory, reference, version, component, and
production period.

### Dependencies

- FACTORY-002
- IDENT-002
- RESEARCH-002

### Acceptance Criteria

- Tells are first-class records, not only free-text notes.
- Tells are not treated as authentication proof.

### Implementation Notes

No `Tell` entity. Closest data is defect/variance copy. Preserve this ID
even though it overlaps `FACTORY-005`.

## FACTORY-005: Known defect database

**Category:** Factory Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Separate systemic factory/reference problems from defects unique to one
watch (crystals, cyclops, date fonts, bezel action, rehaut, crown,
movement, dial color, plating, weight, bracelet/clasp, lume, hand stack,
chronograph, waterproofing, decoration, and similar).

### Dependencies

- FACTORY-001
- FACTORY-002
- QC-007

### Acceptance Criteria

- Recurring problems are stored with area, what buyers should look for,
  and what photos cannot show.
- A catalog entry is not proof of a defect in submitted photos.

### Implementation Notes

Prisma `Defect` and factory seed `defects`. Product copy treats these as
known-variance notes. **Decided:** rename the Prisma model/seed to match
known variance (`DEC-005`). Not renamed yet.

## FACTORY-006: Acceptable variance database

**Category:** Factory Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Provide realistic QC tolerances for variations commonly seen in acceptable
factory examples.

### Dependencies

- FACTORY-005
- QC-008
- MODEL-002

### Acceptance Criteria

- Acceptable variance is stored separately from unique defects and from
  “this watch should be RL” issues.
- Version-specific variance is supported.

### Implementation Notes

`knownVariance` on model dossiers, with optional `factoryVersionId`. Not
a standalone table. Intentionally kept distinct from `FACTORY-005`.

## FACTORY-007: Factory comparison

**Category:** Factory Intelligence  
**Status:** proposed  
**Phase:** V2  
**Priority:** high

### Purpose

Help buyers choose which factory best matches their priorities for the
same watch.

### Dependencies

- FACTORY-002
- MODEL-002
- PRICE-001

### Acceptance Criteria

- Multiple factories producing the same reference can be compared on
  visual accuracy, movement, reliability, crystal, dial, case, bracelet,
  weight, finishing, known flaws, price, and availability.
- Comparisons cite evidence and recency; they are not global ranking
  scores.
- Comparison is not shipped until the **top 10 major factories** have
  curated coverage (`DEC-006`). VSF-versus-unknown is not sufficient.

### Implementation Notes

None yet. Do not invent dummy comparison scores. Do not ship this on a
two-row seed.

## FACTORY-008: Best factory by model guidance

**Category:** Factory Intelligence  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Replace generic factory rankings with reference-specific guidance.

### Dependencies

- FACTORY-007
- VERDICT-005
- PRICE-002

### Acceptance Criteria

- Strongest factory choices can be recommended or categorized per
  reference, with tradeoffs and confidence.
- “Best” is contextual (looks vs reliability vs price), not a single
  number.

### Implementation Notes

None yet.

---

# Domain 5: Brand and model intelligence

## MODEL-001: Brand knowledge pages

**Category:** Model Intelligence  
**Status:** proposed  
**Phase:** V1  
**Priority:** medium

### Purpose

Create an intuitive research hierarchy organized by genuine watch brand.

### Dependencies

- MODEL-002
- MODEL-003

### Acceptance Criteria

- Users can browse replica knowledge by brand, then collection/reference.
- Pages do not imply brand affiliation or certification.

### Implementation Notes

No `/brands` route. Brand is a string on dossiers and cases.

## MODEL-002: Model and reference dossiers

**Category:** Model Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Centralize everything known about a particular watch: genuine reference
details, factories, versions, movements, tells, defects, best-factory
candidates, QC checklist, weight/measurements, factory comparisons, and
service considerations.

### Dependencies

- KNOW-004
- FACTORY-002
- MODEL-004
- MOVE-001

### Acceptance Criteria

- Each supported reference has a structured dossier consumed at runtime.
- Adding a reference follows
  `docs/how-to/add-a-new-watch-reference.md`.
- Forbidden conclusion words stay out of seed copy.

### Implementation Notes

Three JSON dossiers; read-only `/references` and `/references/[referenceId]`.
Generator matches them for checklists. Many intended fields (comparisons,
service, tells DB) are absent.

## MODEL-003: Top replicated brands and models

**Category:** Model Intelligence  
**Status:** proposed  
**Phase:** V1  
**Priority:** medium

### Purpose

Prioritize knowledge ingestion and product coverage.

### Dependencies

- MODEL-002
- RESEARCH-001

### Acceptance Criteria

- Commonly replicated brands, collections, and references are tracked as
  coverage priorities.
- Coverage gaps are visible internally.

### Implementation Notes

None yet. Seed set is not a ranked coverage list.

## MODEL-004: Reference-specific QC checklist

**Category:** Model Intelligence  
**Status:** implemented  
**Phase:** MVP  
**Priority:** critical

### Purpose

Focus attention on the issues that materially matter for that reference
instead of a generic checklist.

### Dependencies

- MODEL-002
- QC-010

### Acceptance Criteria

- The highest-value QC checks for the exact watch can be generated.
- Missing required photos map to those checks.
- Checks do not invent pixel findings.
- Replica and grey-market checklists are separate (`DEC-004`).

### Implementation Notes

`requiredPhotos`, `riskCheckpoints`, and `highValueChecks` drive
`generateReport` and the case photo checklist. Generic default photo set
is used when no dossier matches. Listing-market type is not modeled yet.

---

# Domain 6: Movement intelligence

## MOVE-001: Movement dossiers

**Category:** Movement Intelligence  
**Status:** proposed  
**Phase:** V2  
**Priority:** high

### Purpose

Make movement knowledge first-class: clone, decorated, modified, generic,
and factory-specific variants, with family, manufacturer, known clones,
reliability, serviceability, architecture, visual tells, failure
patterns, and compatible factories/references.

### Dependencies

- KNOW-001
- KNOW-004
- IDENT-005

### Acceptance Criteria

- Structured movement profiles can be loaded independently of a single
  watch dossier.
- Listing-claimed movement is not stored as a photo conclusion.

### Implementation Notes

`movementFamily` string only. No Movement Prisma model or seed directory.

## MOVE-002: Movement reliability history

**Category:** Movement Intelligence  
**Status:** proposed  
**Phase:** V2  
**Priority:** high

### Purpose

Include ownership risk in watch recommendations (failures, common faults,
serviceability, parts, lubrication, winding, calendar, chronograph).

### Dependencies

- MOVE-001
- OUTCOME-004
- EVID-007

### Acceptance Criteria

- Reliability notes are time-aware and evidence-backed.
- Absence of reports is not treated as proof of reliability.

### Implementation Notes

None yet.

## MOVE-003: Movement and reference compatibility

**Category:** Movement Intelligence  
**Status:** proposed  
**Phase:** V2  
**Priority:** high

### Purpose

Detect suspicious or inaccurate seller claims and unusual builds by
mapping movement ↔ factory ↔ reference ↔ version ↔ production period.

### Dependencies

- MOVE-001
- IDENT-005
- SELLER-007

### Acceptance Criteria

- Incompatible or unusual claimed combinations can be flagged as
  representation concerns, not authenticity verdicts.

### Implementation Notes

None yet.

---

# Domain 7: Seller intelligence

## SELLER-001: Seller dossiers

**Category:** Seller Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Evaluate transaction quality in addition to watch quality for TDs,
community dealers, domestic sellers, modders, and watchmakers where
relevant.

### Dependencies

- KNOW-004
- TD-004
- EVID-002
- KNOW-002

### Acceptance Criteria

- Structured profiles can include aliases, communities, channels,
  reputation, recent activity, fulfillment, QC quality, issue resolution,
  payment methods, factory access, evidence, and trend data.
- Similar names are never merged without an explicit alias.

### Implementation Notes

JSON under `data/knowledge/sellers/`, Prisma `Seller` and related tables,
UI at `/sellers` and `/sellers/[sellerId]`. Intake resolves exact id,
canonical name, or alias via `resolveSeller`. Many intended fields
(channels, payment methods, factory access, live trends) are absent.

## SELLER-002: Seller reliability scoring

**Category:** Seller Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Assess seller performance using evidence rather than a permanent binary
label.

### Dependencies

- SELLER-001
- EVID-004
- EVID-006
- SELLER-003

### Acceptance Criteria

- Reputation can improve or decline.
- No universal `trusted: true`.
- No dummy numeric scores.
- Evidence-based reliability scores are in scope (`DEC-007`).

### Implementation Notes

Curated qualitative `trustDimensions` (including `overall`). Not a
computed score from evidence yet. Report fulfillment chip reads that
label. **Decided:** implement evidence-based scores; decorative numbers
remain forbidden (`DEC-007`).

## SELLER-003: Time-aware seller reputation

**Category:** Seller Intelligence  
**Status:** in-progress  
**Phase:** V1  
**Priority:** high

### Purpose

Prevent long historical reputation from hiding recent problems (current,
90-day, 12-month, historical).

### Dependencies

- SELLER-002
- EVID-007

### Acceptance Criteria

- Periodized reputation can be shown and used in assessment.
- Historical TD status does not automatically equal current reliability.

### Implementation Notes

`recencyBucket` helper and `evidenceDepth` year fields exist. No 90-day /
12-month computed reputation. `statusSince` is stored per community
recognition.

## SELLER-004: QC communication rating

**Category:** Seller Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Measure seller behavior during the highest-information stage of the
transaction (QC completeness, responsiveness, transparency, additional
evidence, answer accuracy, delay communication).

### Dependencies

- SELLER-001
- QC-010

### Acceptance Criteria

- QC-process and communication quality are first-class dimensions.
- Ratings remain qualitative until evidence can support more precision.

### Implementation Notes

`communication_quality` and `qc_process_quality` trust dimension keys
exist and render on seller pages when seeded. Not computed from WatchTell
cases.

## SELLER-005: Fulfillment reliability

**Category:** Seller Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Estimate fulfillment risk (sourcing success/delays, availability
accuracy, QC delays, shipping, cancellations, lost packages, failed
delivery, abandonment).

### Dependencies

- SELLER-001
- SELLER-003

### Acceptance Criteria

- Fulfillment is separable from “is this person a TD”.
- Insufficient evidence is a valid label.

### Implementation Notes

`fulfillment_confidence` qualitative dimension; shown on reports as
“Fulfillment”. No structured shipment outcome events.

## SELLER-006: Issue resolution history

**Category:** Seller Intelligence  
**Status:** in-progress  
**Phase:** V1  
**Priority:** high

### Purpose

Evaluate seller quality when transactions do not go smoothly (defects,
wrong watch/factory, RLs, replacements, refunds, shipping, seizures,
disputes, missing items).

### Dependencies

- SELLER-001
- OUTCOME-002
- EVID-002

### Acceptance Criteria

- Resolution behavior is stored as evidence-backed history, not a single
  adjective.

### Implementation Notes

`after_sales_support` and `refund_dispute_behavior` dimensions;
`unresolvedDisputesKnown` on `evidenceDepth`; `RiskFlag` category
`after_sales`. Not a structured case history.

## SELLER-007: Representation accuracy

**Category:** Seller Intelligence  
**Status:** in-progress  
**Phase:** V1  
**Priority:** high

### Purpose

Identify misleading or inaccurate marketing about factory, version,
movement, modifications, plating, weight, stones, crystal, dial,
customization, service work, and waterproofing.

### Dependencies

- IDENT-002
- IDENT-005
- PRICE-003
- EVID-002

### Acceptance Criteria

- Claim-versus-delivery mismatches can be tracked over time.
- A product-claim flag is labeled as curated knowledge, not pixel proof.

### Implementation Notes

`product_claim` risk flags feed `visibleConcerns`.
`product_claim_accuracy` trust dimension exists. No delivery confirmation
loop.

## SELLER-008: Payment risk

**Category:** Seller Intelligence  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Represent financial exposure as part of transaction risk (method,
chargeback/protection, seller history, structure, identity consistency,
unusual payment changes).

### Dependencies

- SELLER-001
- SELLER-002

### Acceptance Criteria

- Payment risk is explicit and separate from watch QC.
- WatchTell does not become a payments product.

### Implementation Notes

`PaymentRecord` is a Stripe placeholder on `WatchCase`, not seller
payment-risk intelligence. `customs_reship_policy` is a trust dimension
key only.

## SELLER-009: Seller comparison

**Category:** Seller Intelligence  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Help users choose sellers for the same intended purchase (price, trust
history, communication, model access, sourcing, QC, shipping, payment,
issue resolution).

### Dependencies

- SELLER-001
- SELLER-010
- PRICE-001
- TD-001

### Acceptance Criteria

- Two or more dealers can be compared for a stated purchase context.
- Comparison is not a single global rank.

### Implementation Notes

`/compare/communities` compares **community TD lists**, not two sellers
for one order. Different capability; keep `TD-001` separate.

## SELLER-010: Seller recommendation context

**Category:** Seller Intelligence  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

A dealer can be excellent generally but weak for a particular factory,
sourcing situation, payment method, or custom build.

### Dependencies

- SELLER-009
- FACTORY-002
- SELLER-008
- VERDICT-005

### Acceptance Criteria

- Recommendations consider the actual transaction, not only global
  ranking.

### Implementation Notes

None yet. Seller pages are global dossiers.

---

# Domain 8: Trusted dealer and forum intelligence

## TD-001: Cross-forum trusted dealer comparison

**Category:** TD Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Show where communities agree or disagree about dealers (RepTime, RWI,
RepGeek, RWG, and other established communities).

### Dependencies

- SELLER-001
- TD-002
- TD-003

### Acceptance Criteria

- Recognition can be compared across communities without flattening lists
  into one trust score.
- Querying any two community ids is supported.

### Implementation Notes

`/compare/communities` with `?a=` / `?b=` query params; default narrative
is RepTime vs RepWatchForum. Seed communities in
`data/knowledge/communities.json`.

## TD-002: TD overlap analysis

**Category:** TD Intelligence  
**Status:** implemented  
**Phase:** MVP  
**Priority:** high

### Purpose

Surface broader independent community recognition by identifying sellers
recognized by multiple communities.

### Dependencies

- TD-001
- EVID-006

### Acceptance Criteria

- Overlap, only-A, and only-B sets are computable.
- Overlap is not treated as independent confirmation when communities
  share an independence group.

### Implementation Notes

`compareCommunitySellers` in `lib/knowledge/compare.ts`. Independence
grouping is applied in report/seller UI separately (`EVID-006`).

## TD-003: Forum-specific seller analysis

**Category:** TD Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Avoid interpreting lack of cross-list presence as evidence of dishonesty.
Lists differ because of vetting models, sponsorship, history, exclusivity,
participation, relationships, geography, applications, and moderation.

### Dependencies

- TD-001
- EVID-009

### Acceptance Criteria

- Compare views can explain *why* trusted lists differ.
- Missing RWI (or any one list) is not a negative by itself.

### Implementation Notes

Compare-case JSON (`vettingDifferences`, `incentiveNotes`) and community
`vettingNotes`. Not a general explainer for every community pair.

## TD-004: Seller provenance

**Category:** TD Intelligence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Replace vague descriptions such as “Reddit TD” with traceable provenance:
where recognition originated, which communities recognize the seller,
since when, under what label, and supporting evidence.

### Dependencies

- SELLER-001
- EVID-003
- EVID-006

### Acceptance Criteria

- TD/trusted-seller labels are stored per community, not as a universal
  boolean.
- Reports can group recognition by independence group.

### Implementation Notes

`SellerCommunity` with status, `statusSince`, vetting/sponsorship flags.
Reports group via `recognitionsByIndependenceGroup`.

---

# Domain 9: Price and purchase context

## PRICE-001: Price reasonableness analysis

**Category:** Price  
**Status:** proposed  
**Phase:** V1  
**Priority:** medium

### Purpose

Flag suspiciously high or low quotes against known factory, dealer,
reference, version, modification, and market ranges.

### Dependencies

- MODEL-002
- FACTORY-002
- SELLER-001

### Acceptance Criteria

- Asking price can be compared to expected ranges when those ranges exist.
- Missing price limits price-risk analysis rather than inventing a number.

### Implementation Notes

`askingPrice` is stored. Missing price adds missing-evidence text.
Report copy says price-risk is limited to the listing asking price. No
range tables.

## PRICE-002: Price versus quality assessment

**Category:** Price  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Make WatchTell recommendations sensitive to whether known flaws and risks
are reasonable for the offered price.

### Dependencies

- PRICE-001
- VERDICT-002
- FACTORY-007

### Acceptance Criteria

- Value judgment is explicit and evidence-limited.
- Cheap-and-known-flawed can be acceptable; expensive-and-unevidenced
  can be high risk.

### Implementation Notes

None yet.

## PRICE-003: Modification and value assessment

**Category:** Price  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Determine whether modification claims (plating, wrapping, tungsten,
gain-weight, crystals, bezels, dials, stones, movement work,
waterproofing, servicing, polishing, bracelet work, and similar)
meaningfully improve the watch, add risk, or justify pricing.

### Dependencies

- SELLER-007
- PRICE-002
- MOVE-001

### Acceptance Criteria

- Modification claims are evaluated as claims with evidence needs.
- WatchTell does not provide counterfeit-improvement instructions.

### Implementation Notes

None yet.

---

# Domain 10: Evidence and source intelligence

## EVID-001: Claim extraction

**Category:** Evidence  
**Status:** in-progress  
**Phase:** V1  
**Priority:** high

### Purpose

Turn unstructured community knowledge (forum/Reddit posts, reviews, QC
threads, articles, dealer statements, owner reports, teardowns, service
findings, comparison posts) into structured claims.

### Dependencies

- EVID-003
- KNOW-002
- KNOW-001

### Acceptance Criteria

- Extracted claims have subject, predicate, value, source, and optional
  confidence/time.
- Extraction does not scrape in the current phase; manual curation is
  valid.
- Claims are not stored as facts.

### Implementation Notes

`Claim` Prisma model and seller-seed `claims[]`. No extraction pipeline.
Do not add crawlers for this ID.

## EVID-002: Evidence attachment

**Category:** Evidence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Make WatchTell knowledge auditable by associating important claims with
supporting evidence.

### Dependencies

- EVID-001
- EVID-003

### Acceptance Criteria

- Evidence records can point at a source, community, independence group,
  type, text, sentiment, confidence, and dates.

### Implementation Notes

`Evidence` model is seller-centric today. Factory/reference evidence is
not first-class. Seller pages show evidence lists.

## EVID-003: Source provenance

**Category:** Evidence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Allow claims to be traced back to original source, author where
appropriate, publication date, location, surrounding context, and
extraction history.

### Dependencies

- EVID-002
- EVID-009

### Acceptance Criteria

- Sources have kind, optional URL, dates, community, and independence
  group.
- Provenance survives aggregation.

### Implementation Notes

`Source` model and `sourceSeedSchema`. Seeds often omit URL/author.
No extraction-history log.

## EVID-004: Source quality scoring

**Category:** Evidence  
**Status:** proposed  
**Phase:** V1  
**Priority:** high

### Purpose

Prevent all online comments from carrying equal weight (specificity,
technical depth, photographic support, ownership evidence, historical
accuracy, independence, conflicts of interest, reproducibility).

### Dependencies

- EVID-003
- EVID-009

### Acceptance Criteria

- Quality factors are explicit and inspectable.
- A detailed owner report outweighs “Great TD, GL!”.

### Implementation Notes

Optional `confidence` float on evidence/claims only. No multi-factor
quality model. Knowledge-architecture names the factors; they are not
implemented.

## EVID-005: Corroboration scoring

**Category:** Evidence  
**Status:** proposed  
**Phase:** V2  
**Priority:** high

### Purpose

Increase confidence when observations occur independently, not when they
are copied.

### Dependencies

- EVID-006
- EVID-004
- EVID-002

### Acceptance Criteria

- Independent supporting evidence can be measured.
- Raw mention count is not the score (Rule 2).

### Implementation Notes

None yet. `uniqueIndependenceGroups` is the foundation, not a score.

## EVID-006: Source independence detection

**Category:** Evidence  
**Status:** implemented  
**Phase:** MVP  
**Priority:** critical

### Purpose

Avoid false consensus when apparently separate reports derive from the
same original information or ecosystem.

### Dependencies

- EVID-003
- TD-004

### Acceptance Criteria

- Evidence from the same independence group counts as one confirmation,
  not N.
- Cross-listed Western TD programs are not automatically independent of
  each other without an explicit group.

### Implementation Notes

`independenceGroup` on communities, evidence, and sources.
`recognitionsByIndependenceGroup` / `uniqueIndependenceGroups` used in
seller and report UI. This is **labeled grouping**, not ML detection of
copied posts.

## EVID-007: Recency weighting

**Category:** Evidence  
**Status:** in-progress  
**Phase:** V1  
**Priority:** high

### Purpose

Keep factory, version, seller, and availability knowledge current.

### Dependencies

- EVID-003
- SELLER-003
- FACTORY-003

### Acceptance Criteria

- Temporal relevance can be applied where facts change.
- Older information is not automatically equal to recent evidence.

### Implementation Notes

`recencyBucket` in `lib/knowledge/independence.ts`;
`evidence_recency` trust dimension; `publishedAt` on evidence. Not applied
inside `generateReport`.

## EVID-008: Conflict detection

**Category:** Evidence  
**Status:** proposed  
**Phase:** V2  
**Priority:** high

### Purpose

Represent uncertainty honestly when evidence competes (Rule 6).

### Dependencies

- EVID-001
- EVID-005
- REPORT-008

### Acceptance Criteria

- Competing claims are preserved and surfaceable.
- The system does not silently pick a cleaner side.

### Implementation Notes

No conflict engine. `ClaimSentiment` includes `mixed`. Conflicting claims
would currently just coexist in seed JSON without analysis.

## EVID-009: Conflict-of-interest and incentive context

**Category:** Evidence  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Adjust confidence based on incentives: seller/factory/dealer marketing,
independent vs paid reviewer, customer, modder, watchmaker, moderator,
technically verified evidence.

### Dependencies

- EVID-003
- EVID-004
- TD-003

### Acceptance Criteria

- Source type and incentive context are stored.
- Weighting is contextual, not one universal author trust score.

### Implementation Notes

`EvidenceKind` includes `giveaway_or_sponsorship`, `seller_promotion`,
`moderator_test_purchase`, etc. `SellerCommunity` has sponsorship and
participation flags. No automated down-weighting algorithm.

---

# Domain 11: WatchTell knowledge layer

## KNOW-001: Structured watch ontology

**Category:** Knowledge Layer  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Give WatchTell a consistent internal representation of watch knowledge.

### Dependencies

- EVID-001
- EVID-002
- EVID-003

### Acceptance Criteria

- First-class entities can include Brand, Reference, Factory,
  FactoryVersion, Batch, Movement, Seller, Watch, Component, Defect, Tell,
  QCProfile, QCObservation, Transaction, Claim, Evidence, Source,
  UserOutcome, and related types as the domain grows.
- Ontology extends the current Prisma/Zod model rather than replacing it.

### Implementation Notes

Implemented subset: Seller (+ alias/community), Community, Source,
Evidence, Claim, Factory, FactoryVersion, Defect, WatchCase, CaseImage,
AnalysisRun, Report. Missing as entities: Brand, Batch, Movement, Watch,
Component, Tell, QCProfile, QCObservation, Transaction, UserOutcome.
Reference exists as dossier JSON, not a Prisma model.

## KNOW-002: Entity resolution

**Category:** Knowledge Layer  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Recognize aliases and naming variations (Clean / CF / Clean Factory;
seller names across forums) without creating duplicate fragmented
knowledge.

### Dependencies

- KNOW-001
- SELLER-001
- FACTORY-001

### Acceptance Criteria

- Explicit aliases resolve with recorded identity confidence.
- Similar names are never auto-merged.
- Unresolved intake handles remain visible.

### Implementation Notes

Sellers: exact id/name/alias (`resolveSeller`). Factories: id or canonical
name (`matchFactory`); unknown factory otherwise. References: normalized
punctuation (`matchModelDossier`). Unresolved seller handles: see case
repository/intake copy. No factory alias table.

## KNOW-003: Versioned knowledge snapshots

**Category:** Knowledge Layer  
**Status:** proposed  
**Phase:** V2  
**Priority:** high

### Purpose

Allow WatchTell's understanding to evolve without erasing prior context.

### Dependencies

- KNOW-004
- EVID-007
- EVAL-004

### Acceptance Criteria

- Historical knowledge states or validity windows can be preserved.
- Runtime can record which snapshot version was used.

### Implementation Notes

Not implemented. `promptVersion` on `AnalysisRun` / `Report` is
`knowledge-v2` for the deterministic generator, not a dossier snapshot.

## KNOW-004: Compact knowledge dossiers

**Category:** Knowledge Layer  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Allow routine analysis to consume curated WatchTell knowledge rather than
retrieving hundreds of posts (Rule 4).

### Dependencies

- KNOW-001
- FACTORY-001
- MODEL-002
- SELLER-001
- MOVE-001

### Acceptance Criteria

- Reusable artifacts exist for seller, factory, model, movement, and QC
  profile dossiers.
- Runtime analysis loads the relevant compact dossier by default.

### Implementation Notes

Manually curated JSON loaded by `lib/knowledge/load.ts` and optionally
upserted via `persist.ts`. These are seeds, not generated snapshots.
Movement dossiers do not exist. Report generation consumes seller +
model + factory seeds.

## KNOW-005: Selective raw retrieval

**Category:** Knowledge Layer  
**Status:** proposed  
**Phase:** Later  
**Priority:** medium

### Purpose

Combine durable structured knowledge with targeted fresh research when a
case is unusual, knowledge is incomplete, confidence is low, claims
conflict, information may have changed, a new factory/version appears, or
direct verification is requested.

### Dependencies

- KNOW-004
- EVID-003
- VERDICT-004

### Acceptance Criteria

- Retrieval supplements dossiers; it does not replace them.
- Connectors can be removed without breaking the knowledge model.
- No unrestricted scraping.

### Implementation Notes

Explicitly out of current scope (`docs/explanation/knowledge-architecture.md`).
Do not add vector DBs or Reddit scrapers because this ID exists.

---

# Domain 12: Reports and user interface

## REPORT-001: Structured QC report

**Category:** Reports  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Provide a consistent, understandable result covering identification,
factory/version, QC observations, severity, factory context, movement,
evidence, confidence, seller/process risk, verdict, and next steps.

### Dependencies

- QC-010
- VERDICT-005
- SELLER-001
- MODEL-004
- QC-007

### Acceptance Criteria

- Reports follow `docs/reference/report-rules.md` structure and language.
- Forbidden conclusion words cannot reach the user.
- Sample and saved-case reports share the same dashboard language.

### Implementation Notes

`/reports/[reportId]` + `ReportDashboard`. Sections include overall risk,
confidence, photos, missing evidence, visible concerns, factory variance,
seller recognition, questions, next step. No GL/RL yet (`DEC-001` says
include them). No movement assessment, no source citations. Saved reports
persist `reportJson` with `modelUsed: deterministic-rules`. The listing
report is the paid product; subscribers also get knowledge explorers
(`DEC-003`).

## REPORT-002: Overall WatchTell assessment

**Category:** Reports  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Give users a fast summary without hiding nuance or making one unexplained
numerical score the sole authority.

### Dependencies

- VERDICT-003
- VERDICT-004
- REPORT-003

### Acceptance Criteria

- A concise headline is backed by underlying dimensions.
- Low visible risk still says no obvious photo-based red flags, never
  “authentic”.

### Implementation Notes

`overallRisk` + `safeSummary` headline. No dummy numeric score. QC GL/RL
verdicts belong **in** this report, not instead of it (`DEC-001`).

## REPORT-003: Risk breakdown

**Category:** Reports  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Show where risk actually originates: visual QC, functional, movement,
factory-identification confidence, seller, transaction, evidence quality,
ownership.

### Dependencies

- REPORT-002
- SELLER-005
- IDENT-002
- VERDICT-004

### Acceptance Criteria

- Dimensions are separable.
- “Cannot assess” is allowed per dimension.

### Implementation Notes

Metric chips for visual QC photo counts, mechanical (movement photo
present or not), evidence gaps, seller signals, price, factory claim,
fulfillment. Qualitative, not a scored breakdown model.

## REPORT-004: Confidence indicators

**Category:** Reports  
**Status:** implemented  
**Phase:** MVP  
**Priority:** critical

### Purpose

Prevent uncertain conclusions from appearing definitive.

### Dependencies

- VERDICT-004

### Acceptance Criteria

- Confidence is displayed alongside the overall assessment.
- Caps from missing evidence are reflected.

### Implementation Notes

Report header shows Low/Medium/High confidence. Caps implemented in
`generateReport`. Per-finding confidence UI is not present (`VERDICT-004`
remainder).

## REPORT-005: Source citations

**Category:** Reports  
**Status:** proposed  
**Phase:** V1  
**Priority:** high

### Purpose

Make important findings traceable to underlying evidence.

### Dependencies

- EVID-002
- EVID-003
- VERDICT-005

### Acceptance Criteria

- Important findings can link to sources without dumping raw threads into
  the default view.

### Implementation Notes

Seller pages list evidence text. Reports do not cite `Source` rows.

## REPORT-006: Evidence drill-down

**Category:** Reports  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Provide depth for power users (source evidence, known examples,
corroborating/conflicting reports, factory history, seller history)
without making default reports overwhelming.

### Dependencies

- REPORT-005
- EVID-008
- FACTORY-001
- SELLER-001

### Acceptance Criteria

- Drill-down is opt-in from the default report.

### Implementation Notes

None yet. Seller/factory/reference pages are separate research surfaces,
not report drill-down.

## REPORT-007: Recency indicators

**Category:** Reports  
**Status:** proposed  
**Phase:** V1  
**Priority:** medium

### Purpose

Make potentially stale knowledge obvious (last knowledge update, factory
version, seller reputation period, production period, evidence age).

### Dependencies

- EVID-007
- SELLER-003
- IDENT-003
- KNOW-003

### Acceptance Criteria

- Stale or historical evidence is labeled when dates exist.

### Implementation Notes

Recognition `statusSince` may render on the report seller card. No
knowledge-update timestamp on dossiers.

## REPORT-008: Disagreement indicators

**Category:** Reports  
**Status:** proposed  
**Phase:** V1  
**Priority:** high

### Purpose

Prevent disputed conclusions from being presented as settled fact (Rule 6).

### Dependencies

- EVID-008
- VERDICT-004

### Acceptance Criteria

- Mixed or conflicting evidence is visible in the default report when it
  affects the recommendation.

### Implementation Notes

None yet. Compare-page narrative can describe list disagreement; that is
`TD-003`, not claim-level conflict UI.

## REPORT-009: Calm decision-oriented UI

**Category:** Reports  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** high

### Purpose

Communicate trust, clarity, technical competence, and mechanical-watch
expertise. Avoid stereotypical AI gradients and generic purple/blue AI
identity.

### Dependencies

- REPORT-001

### Acceptance Criteria

- Visual language follows `docs/reference/design-guidance.md` and
  `assets/watchdesk-risk-report-dashboard.png`.
- UI reduces anxiety rather than encouraging microscopic panic (Rule 9).

### Implementation Notes

Dashboard shell (dark sidebar, light canvas), serif headlines, restrained
palette, sample report layout. Design is guidance, not a finished brand
system. Sidebar still emphasizes Visual QC / Mechanical / Seller /
Evidence / Decision rather than knowledge explorers.

---

# Domain 13: User feedback and real-world outcomes

## OUTCOME-001: Post-purchase outcome reporting

**Category:** Outcomes  
**Status:** proposed  
**Phase:** Later  
**Priority:** medium

### Purpose

Close the loop between WatchTell predictions and real outcomes (watch
received, condition, QC accuracy, new defects, shipping, factory
confirmation).

### Dependencies

- REPORT-001
- KNOW-001

### Acceptance Criteria

- Users can report outcomes with privacy/consent controls.
- Outcomes become evidence, not automatic truth.

### Implementation Notes

No auth, user accounts in the product sense, or outcome forms. Prisma
`User` exists unused for this flow.

## OUTCOME-002: Seller outcome feedback

**Category:** Outcomes  
**Status:** proposed  
**Phase:** Later  
**Priority:** medium

### Purpose

Continuously improve seller intelligence from shipping, communication,
refunds, replacements, disputes, and successful resolution.

### Dependencies

- OUTCOME-001
- SELLER-006

### Acceptance Criteria

- Seller dossiers can ingest WatchTell-originated outcome evidence with
  provenance.

### Implementation Notes

None yet.

## OUTCOME-003: Factory and version confirmation

**Category:** Outcomes  
**Status:** proposed  
**Phase:** Later  
**Priority:** medium

### Purpose

Improve factory-identification models and knowledge after receipt,
caseback opening, servicing, or component inspection.

### Dependencies

- IDENT-002
- IDENT-003
- OUTCOME-001

### Acceptance Criteria

- Later confirmation can update identification confidence without
  rewriting history (KNOW-003).

### Implementation Notes

None yet.

## OUTCOME-004: Service and failure reports

**Category:** Outcomes  
**Status:** proposed  
**Phase:** Later  
**Priority:** medium

### Purpose

Build ownership and reliability intelligence that initial QC cannot
provide (movement failures, repairs, waterproof testing, crystal/bezel/
crown, plating, bracelet, lubrication, accuracy drift).

### Dependencies

- MOVE-002
- OUTCOME-001

### Acceptance Criteria

- Long-term reports are structured and time-stamped.

### Implementation Notes

None yet.

## OUTCOME-005: Prediction versus outcome tracking

**Category:** Outcomes  
**Status:** proposed  
**Phase:** Later  
**Priority:** high

### Purpose

Measure whether WatchTell predictions are useful and improve calibration.

### Dependencies

- OUTCOME-001
- EVAL-002
- VERDICT-003

### Acceptance Criteria

- Recommendations can be compared to eventual results without using
  forbidden authenticity labels as ground truth.

### Implementation Notes

None yet.

---

# Domain 14: Quality and evaluation

## EVAL-001: Evaluation dataset

**Category:** Evaluation  
**Status:** proposed  
**Phase:** V1  
**Priority:** high

### Purpose

Test whether WatchTell improves or regresses over time using known QC
examples (clear GL/RL, known factory flaw, image artifact, incorrect
factory claim, movement issue, seller issue, insufficient evidence).

### Dependencies

- QC-002
- VERDICT-003
- EVAL-004

### Acceptance Criteria

- A maintained set of cases with expected outcomes exists.
- Prompt, model, knowledge, and rule changes can be regression-tested.

### Implementation Notes

Unit tests cover generator rules, language guards, and seed loading.
There is no labeled QC evaluation corpus. First V1 slice can be
checklist/missing-evidence cases without vision.

## EVAL-002: Scoring calibration

**Category:** Evaluation  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Keep confidence values meaningful relative to actual correctness.

### Dependencies

- VERDICT-004
- OUTCOME-005
- EVAL-001

### Acceptance Criteria

- Confidence can be measured against outcomes or gold labels.
- Overconfident reports are detectable.

### Implementation Notes

None yet.

## EVAL-003: Provider-independent reasoning

**Category:** Evaluation  
**Status:** in-progress  
**Phase:** MVP  
**Priority:** critical

### Purpose

Avoid provider lock-in. Durable WatchTell knowledge, domain rules,
evidence, scoring inputs, and product behavior stay product-owned
(Rule 10).

### Dependencies

- KNOW-004
- EVAL-004

### Acceptance Criteria

- Switching LLM providers does not require rebuilding the knowledge
  store.
- Model output is never the final report without deterministic rules.

### Implementation Notes

Knowledge lives in Zod/JSON/Prisma. Reports are assembled by
`lib/reports` (`deterministic-rules`). `lib/openai` is documented but
not present as a module. Keep it that way until a model call is
requested.

## EVAL-004: Auditable reasoning inputs

**Category:** Evaluation  
**Status:** in-progress  
**Phase:** V1  
**Priority:** high

### Purpose

Make incorrect conclusions diagnosable. Store explicit structured inputs
and conclusions, not hidden chain-of-thought.

### Dependencies

- REPORT-001
- KNOW-003
- VERDICT-004

### Acceptance Criteria

- Where appropriate, record observations, evidence, knowledge versions,
  scores, confidence, source inputs, model outputs, and decision inputs.
- Do not store hidden model chain-of-thought.

### Implementation Notes

`AnalysisRun` / `Report` store `reportJson`, `modelUsed`,
`promptVersion`, optional `rawModelOutput`. Knowledge snapshot version
and structured decision traces are not stored. No live model output yet.

---

# Domain 15: Knowledge and research products

## RESEARCH-001: Factory × brand × model knowledge explorer

**Category:** Research Products  
**Status:** in-progress  
**Phase:** V2  
**Priority:** medium

### Purpose

Expose accumulated intelligence as a research product across factory,
brand, model, reference, version, movement, tells, and known issues.

### Dependencies

- FACTORY-001
- MODEL-001
- MODEL-002
- FACTORY-004

### Acceptance Criteria

- Users can browse relationships without submitting a QC case.
- Pages remain non-scoring and non-authenticating.

### Implementation Notes

Separate indexes: `/factories`, `/references`, `/sellers`. No joined
explorer or brand hub. Partial surface only. Paying listing-report
subscribers get explorer access (`DEC-003`).

## RESEARCH-002: Known tells explorer

**Category:** Research Products  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Provide direct search of known tells by factory, model, reference,
version, component, and tell type.

### Dependencies

- FACTORY-004
- RESEARCH-001

### Acceptance Criteria

- Tells are searchable without opening a case.

### Implementation Notes

Depends on `FACTORY-004`. None yet. Subscriber access to explorers is
part of the paid listing-report product (`DEC-003`).

## RESEARCH-003: Seller intelligence explorer

**Category:** Research Products  
**Status:** in-progress  
**Phase:** V1  
**Priority:** high

### Purpose

Make WatchTell useful for seller research independently of a QC
submission (reputation, trend, forum recognition, complaints, strengths,
issue resolution, factory access, fulfillment).

### Dependencies

- SELLER-001
- TD-001
- SELLER-003

### Acceptance Criteria

- Seller index can be filtered by community / recognition.
- Unresolved handles stay visible on cases.

### Implementation Notes

`/sellers` lists all seeds; no community/recognition filters yet.
Detail pages show recognition, dimensions, likes/concerns, evidence.
Paying listing-report subscribers get explorer access (`DEC-003`).

## RESEARCH-004: Factory comparison explorer

**Category:** Research Products  
**Status:** proposed  
**Phase:** V2  
**Priority:** medium

### Purpose

Help buyers decide what to order before QC by comparing factories for the
same reference side by side.

### Dependencies

- FACTORY-007
- MODEL-002
- RESEARCH-001

### Acceptance Criteria

- Side-by-side factory comparison for a reference is possible without a
  case.

### Implementation Notes

None yet. Distinct from community seller comparison (`TD-001`). Requires
top-10 factory coverage before it is honest (`DEC-006`). Subscriber
access is part of the paid listing-report product (`DEC-003`).

## RESEARCH-005: Community intelligence summaries

**Category:** Research Products  
**Status:** proposed  
**Phase:** Later  
**Priority:** medium

### Purpose

Convert large amounts of community discussion into structured,
evidence-backed summaries so users do not read hundreds of repetitive or
conflicting posts.

### Dependencies

- EVID-001
- EVID-005
- EVID-008
- KNOW-004
- KNOW-005

### Acceptance Criteria

- Summaries cite evidence, recency, independence, and disagreement.
- Summaries are compiled knowledge, not live RAG over forums.

### Implementation Notes

One curated compare-case narrative exists. That is not a general
summarization product. Do not scrape to implement this.

---

# Update discipline

Update this registry when:

- a feature begins implementation or is completed
- a feature is intentionally deferred
- product direction changes
- dependencies become clearer
- capabilities are split or merged
- a feature becomes obsolete

After material implementation, change **status** and rewrite
**Implementation Notes** with file evidence. Do not mark `implemented`
from architecture intent alone.

Resolved product questions live in [`docs/explanation/decisions.md`](../explanation/decisions.md).
When a decision changes phase or acceptance criteria, update this registry
in the same change.
