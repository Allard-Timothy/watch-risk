# WatchTell AI Knowledge Architecture

This document describes **how** the knowledge layer is designed. Intended
product capabilities and current implementation status live in
[`docs/reference/features.md`](../reference/features.md). Do not treat a later-phase
diagram here as permission to implement embeddings, scraping, or retrieval.

Incorporate this architecture into the WatchTell implementation plan.

## Goal

WatchTell should not behave like a generic LLM that retrieves Reddit/forum posts for every question. Build a persistent, structured intelligence layer from seller reviews, QC feedback, factory/model discussions, technical deep dives, transaction reports, and other watch-community sources.

The LLM should normally reason over compact, versioned WatchTell knowledge rather than repeatedly retrieving raw source material.

The resulting system should prioritize:

* consistency between analyses
* traceability to underlying evidence
* time-aware seller and factory intelligence
* confidence scoring
* source-quality weighting
* low runtime token usage
* ability to update knowledge without retraining the model
* provider independence so WatchTell knowledge is not tied to one LLM vendor

## Core Design Principle

Separate:

1. Knowledge

   * facts, claims, observations, historical patterns, seller performance, known QC defects, movement characteristics, factory changes, etc.
2. Reasoning behavior

   * how WatchTell performs QC, weighs evidence, communicates uncertainty, determines GL/RL, identifies risk, and explains conclusions.

Do not attempt to encode the community corpus directly into model weights.

Fine-tuning, if used later, should improve WatchTell reasoning behavior and output consistency rather than memorize Reddit/forum knowledge.

## Data Pipeline

Build an ingestion pipeline capable of processing approved sources such as:

* Reddit discussions
* replica-watch forums
* seller reviews
* QC threads
* customer transaction reports
* factory comparisons
* movement discussions
* technical deep dives
* TimeUltra technical/deep-dive content
* WatchTell user-submitted outcomes
* other manually approved watch-information sources

Pipeline:

```text
Raw Sources
↓
Normalization
↓
Entity Resolution
↓
Claim Extraction
↓
Evidence Classification
↓
Source / Evidence Scoring
↓
Conflict + Corroboration Analysis
↓
Structured WatchTell Knowledge
↓
Materialized Knowledge Snapshots
↓
WatchTell AI Runtime
```

Raw source material must retain provenance whenever legally and technically permissible.

## Domain Ontology

Design the knowledge model around explicit domain entities rather than unstructured documents.

At minimum support:

* Brand
* Reference
* Factory
* FactoryVersion
* Movement
* Seller
* Dealer
* Watch
* Component
* Defect
* QCObservation
* Transaction
* Claim
* Evidence
* Source
* SourceAuthor
* FactoryBatch
* KnowledgeSnapshot
* SellerDossier
* FactoryDossier
* ModelDossier
* MovementDossier
* QCProfile

Relationships should support questions such as:

* Which factory produced this reference?
* Which version/batch is likely represented?
* What defects are common for this factory/reference/version?
* Which defects are acceptable factory variance?
* Which defects are unusual?
* Has this issue improved or worsened across versions?
* How reliable is this seller recently?
* What evidence supports a seller reputation score?
* Does a source have a potential conflict of interest?
* Has a movement shown recurring reliability issues?
* What should be checked during QC for this specific model?

## Claims as First-Class Data

Do not model knowledge only as documents.

Create explicit claims.

Example:

```json
{
  "subject": {
    "factory": "VSF",
    "reference": "116610LV",
    "factory_version": "unknown"
  },
  "predicate": "crystal_quality",
  "value": "excellent",
  "source_id": "...",
  "source_type": "independent_owner",
  "evidence_type": "photos_and_written_observation",
  "observed_at": "2026-05-18",
  "confidence": 0.87,
  "provenance": {
    "url": "...",
    "source_post_id": "..."
  }
}
```

Claims may:

* corroborate one another
* contradict one another
* become stale
* apply only to a particular batch/version
* apply only during a particular time period

Do not overwrite conflicting claims. Preserve them and aggregate them.

## Evidence Weighting

Not all community information should be treated equally.

Design an evidence-scoring framework that considers factors such as:

* SourceReliability
* EvidenceQuality
* Corroboration
* Recency
* Independence
* Specificity
* HistoricalAccuracy
* PossibleConflictOfInterest

The exact scoring algorithm can evolve, but the underlying factors should remain explicit and inspectable.

A detailed owner report containing order date, QC date, shipping date, delivery date, payment method, photographs, and issue-resolution history should carry substantially more weight than a low-detail comment like “Great TD, GL!”

A dealer's technical deep dive may be highly valuable for component photography, movement identification, dimensions, factory comparisons, and manufacturing observations, but should receive reduced independence weighting when the same source is evaluating its own reliability, customer service, seller ranking, or claims that materially benefit its own sales.

Source weighting should be contextual rather than assigning one universal trust score to an author.

## Temporal Knowledge

Treat factory and seller information as time-dependent.

Do not store simplistic permanent assertions such as:

* Seller X = reliable
* Factory Y Daytona = excellent

Instead, model observations over time using validity windows and time-weighted scores.

Factory intelligence should distinguish:

* Factory
* Reference
* Version
* Batch
* Production Period

Seller intelligence should support:

* Current reliability
* Recent 90-day reliability
* 12-month reliability
* Historical reliability
* QC communication
* Fulfillment
* Issue resolution
* Payment risk
* Accuracy of representation

Older information should not automatically carry the same weight as recent evidence.

## Materialized Knowledge Snapshots

Create precomputed, compact model-ready knowledge artifacts.

Examples:

* SellerDossier
* FactoryDossier
* ModelDossier
* MovementDossier
* QCProfile

Example model dossier:

```json
{
  "factory": "VSF",
  "reference": "116610LV",
  "snapshot_version": 17,
  "updated_at": "2026-08-10",
  "knowledge": {
    "crystal": {
      "assessment": "excellent",
      "confidence": 0.94,
      "known_variance": [
        "minor cyclops alignment variation"
      ]
    },
    "dial": {
      "assessment": "excellent",
      "confidence": 0.91,
      "known_variance": [
        "sunburst appearance changes significantly with lighting"
      ]
    },
    "movement": {
      "family": "DD3135",
      "reliability": "strong",
      "confidence": 0.89
    },
    "qc": {
      "high_value_checks": [
        "rehaut alignment",
        "date centering",
        "SEL fit",
        "bezel alignment",
        "timegrapher"
      ]
    }
  },
  "evidence_summary": {
    "independent_reports": 183,
    "technical_reviews": 12,
    "dealer_sources": 7,
    "conflicting_claims": 4
  }
}
```

These snapshots should be versioned and regenerated when meaningful new evidence arrives.

Runtime AI requests should consume these compact dossiers by default.

## Retrieval Strategy

Do not make semantic RAG the primary source of WatchTell intelligence.

The normal runtime flow should be:

```text
User Input
↓
Identify Watch / Factory / Reference / Seller
↓
Load Relevant WatchTell Knowledge Snapshot
↓
Analyze User-Specific Evidence
↓
Determine Confidence
↓
If sufficient: Generate Analysis
↓
If insufficient or unusual: Retrieve Raw Supporting Evidence
↓
Augment Analysis
```

Raw semantic retrieval should be used primarily for:

* uncommon defects
* conflicting evidence
* novel questions
* sparse knowledge areas
* source verification
* detailed supporting evidence
* newly emerging factory/seller behavior
* cases where confidence falls below a defined threshold

Do not inject large quantities of forum posts into every model call.

## Semantic Evidence Store

Maintain a searchable semantic index of approved raw evidence.

The evidence store should support queries combining semantic similarity and structured filters such as:

* factory
* reference
* factory_version
* movement
* seller
* component
* defect
* date range
* source type
* evidence type
* confidence

The semantic evidence store exists underneath the structured knowledge system and should not replace it.

## WatchTell AI Runtime

For a normal QC analysis, the runtime context should resemble:

```text
WATCH
* Reference
* Factory
* Probable Version

FACTORY / MODEL KNOWLEDGE
* Compact WatchTell ModelDossier

QC PROFILE
* Known high-value checks
* Acceptable factory variance

SELLER PROFILE
* Relevant compact SellerDossier when seller risk matters

USER EVIDENCE
* QC photographs
* Videos
* Measurements
* Timegrapher results
* Weight
* User-provided seller information

TASK
* Evaluate this specific watch using WatchTell methodology.
```

The model should analyze the submitted watch against factory-specific expectations, not against an abstract notion of perfection.

## QC Reasoning Behavior

WatchTell AI should consistently distinguish between:

* Objective defect
* Known factory flaw
* Normal production variance
* Likely lighting/photography artifact
* Potential defect requiring another photo
* Cosmetic issue
* Functional issue
* Authenticity concern
* Seller/process risk
* Unknown / insufficient evidence

QC recommendations should consider:

* severity
* visibility
* likelihood of receiving a better replacement
* known factory consistency
* functional implications
* expected price/quality tier
* availability
* whether the issue is inherent to the factory rather than specific to the watch

Avoid simplistic GL/RL decisions.

Possible verdicts should support:

* GL
* GL with reservations
* Request additional evidence
* Conditional GL
* RL
* Insufficient evidence

Include calibrated confidence where useful.

## Explainability and Provenance

WatchTell should be capable of explaining:

* why it reached a conclusion
* what knowledge influenced it
* how confident the underlying evidence is
* whether evidence is recent or historical
* whether sources disagree
* whether a source has a potential incentive conflict

The UI does not need to expose every internal claim, but the backend should retain sufficient provenance to audit important conclusions.

Avoid presenting community consensus as established fact when the evidence is weak.

## Knowledge Updates

New evidence should update WatchTell knowledge asynchronously through the ingestion/compilation pipeline rather than forcing runtime retrieval.

Example:

```text
New posts/reviews ingested
↓
Claims extracted
↓
Claims scored
↓
Existing evidence recalculated
↓
Affected dossiers identified
↓
New dossier versions generated
```

The runtime model automatically benefits from updated knowledge without retraining.

## WatchTell User Outcomes

Eventually treat WatchTell's own users as an important evidence source.

Examples:

* GL recommendation → user received watch → outcome reported
* Seller payment → delivery result
* Factory/version identification → later confirmed
* QC defect → replacement obtained
* Service history
* Movement failure
* Waterproofing result
* Plating durability
* Long-term wear observations

These outcomes can create a proprietary dataset that improves WatchTell independently of public forum content.

User-derived evidence must retain privacy controls and appropriate consent.

## Fine-Tuning

Fine-tuning is optional and should not be part of the initial architecture dependency.

If introduced later, use it to improve behaviors such as:

* consistent QC methodology
* classification of defects
* calibrated confidence
* GL/RL reasoning
* explanation structure
* distinguishing lighting artifacts from likely physical defects
* applying factory-specific expectations
* avoiding overconfidence
* following WatchTell terminology

Do not rely on fine-tuning to memorize changing seller, factory, or model knowledge.

## Provider Independence

Keep WatchTell intelligence outside the LLM provider.

The following should belong to WatchTell:

* Ontology
* Claims
* Evidence
* Scores
* Factory history
* Seller history
* QC profiles
* Knowledge snapshots
* Source provenance
* Evaluation datasets
* Reasoning methodology

LLMs should function as replaceable reasoning engines.

Avoid architecture that would make switching between OpenAI, Anthropic, Google, or future providers require rebuilding WatchTell's core knowledge.

## Evaluation System

Build an evaluation dataset as WatchTell develops.

Include known examples covering:

* clear GL
* clear RL
* borderline QC
* lighting artifacts
* misaligned components
* known factory flaws
* unusual movement readings
* seller-risk scenarios
* conflicting community evidence
* low-confidence cases
* incorrect factory identification
* version-dependent differences

Use this dataset to detect regressions whenever:

* prompts change
* models change
* knowledge scoring changes
* retrieval changes
* dossier generation changes

Consistency should be measured rather than assumed.

## Initial Implementation Priority

Implement this incrementally.

### Phase 1

Focus on:

* Domain ontology
* Source ingestion interface
* Claim schema
* Evidence schema
* Entity resolution
* Source/evidence scoring
* Provenance

Use a small manually curated corpus initially.

### Phase 2

Implement:

* Claim aggregation
* Conflict detection
* Temporal weighting
* FactoryDossier
* ModelDossier
* SellerDossier
* MovementDossier
* QCProfile
* Snapshot versioning

Integrate these snapshots into the existing WatchTell analysis path.

### Phase 3

Add:

* Embeddings
* Semantic raw-evidence retrieval
* Confidence-triggered retrieval
* Hybrid structured + vector search
* Source drill-down
* Evidence citations

### Phase 4

Add:

* Automated ingestion
* WatchTell user outcome feedback
* Reputation time series
* Batch/version detection
* Evaluation harness
* Knowledge-quality monitoring

Do not prematurely build large-scale crawling or vector infrastructure before the ontology, claim model, provenance, and aggregation rules are solid.

## Important Product Constraint

Treat third-party community content carefully.

Before automatically scraping, storing, reproducing, embedding, summarizing, or commercially using Reddit/forum content, evaluate the applicable API terms, site terms, copyright considerations, retention restrictions, and commercial-use requirements.

Design source connectors independently so a prohibited or unavailable data source can be removed without breaking the knowledge architecture.

Do not make WatchTell dependent on unrestricted scraping.

## Desired End State

WatchTell should eventually operate as a domain-specific watch intelligence system.

The valuable system should be:

```text
Raw Community Evidence
↓
WatchTell Evidence Model
↓
WatchTell Knowledge
↓
WatchTell Reasoning Methodology
↓
LLM
↓
Consistent, Evidence-Based Analysis
```

The accumulated WatchTell knowledge, evidence graph, historical observations, scoring methodology, and user outcomes should become the durable product asset.

When adding this to the current implementation plan, preserve existing architecture decisions where reasonable. Identify which existing components can be extended versus replaced, and break the work into reviewable implementation phases rather than attempting a broad rewrite.

## Relationship to the current MVP

Phase 1 of this architecture is now in the local app: a curated seller,
community, evidence, and claim ontology with Zod seed schemas
(`lib/knowledge/`) and Prisma tables. It extends the current plan rather than
replacing it:

* The existing Zod report schema, deterministic report rules, and confidence caps
  (`docs/reference/ai-contract.md`, `docs/reference/report-rules.md`) remain the near-term analysis
  path and are the natural place to later consume compact dossiers/snapshots.
* The current data model (`docs/reference/architecture-typescript.md`) is extended with
  Community, Seller, SellerAlias, SellerCommunity, Evidence, Source, Claim,
  RiskFlag, and TrustDimension. `WatchCase.sellerId` is optional.
* Product positioning is unchanged on authentication: WatchTell remains a
  pre-purchase, photo-based buyer-risk assessment tool and does not
  authenticate, certify, or verify watches; keep the safer language in
  `docs/reference/report-rules.md`. Forum TD labels are stored as community recognition
  with an `independenceGroup` so one ecosystem cannot count as several
  confirmations.
* No crawling, scraping, embeddings, vector search, or automated ingestion is in
  scope yet. Start with the ontology, claim/evidence/provenance schemas, and a
  small manually curated seed corpus; add versioned snapshots and retrieval
  later.
* Never merge two sellers based on similar names. Alias rows require an
  `identityConfidence` and supporting note.
