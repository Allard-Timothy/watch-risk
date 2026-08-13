# AI contract

The AI layer generates structured buyer-risk observations. It does not authenticate watches.

## Inputs

A case includes:

- brand
- model
- reference
- claimed year
- asking price
- seller platform
- listing URL
- listing text
- seller claims
- uploaded images with photo type labels when available

## Image classification output

Each image should produce:

```json
{
  "detectedType": "dial | clasp | rehaut | caseback | bracelet | movement | papers | other",
  "usable": true,
  "qualityScore": 0.0,
  "issues": [],
  "findings": []
}
```

## Report output

The final report should produce:

```json
{
  "overallRisk": "low | medium | high | cannot_assess",
  "confidence": "low | medium | high",
  "missingEvidence": [],
  "visibleConcerns": [],
  "sellerQuestions": [],
  "recommendedNextStep": "",
  "safeSummary": ""
}
```

## Required safety behavior

The report must not claim authenticity.

Forbidden words in final user-facing conclusions:

- authentic
- genuine
- fake
- counterfeit
- certified
- verified
- guaranteed
- passed

## Validation

All AI output must be validated before saving.

Use Zod schemas for:

- image classification
- case-level analysis
- final report

If model output fails validation:

1. store the raw output for debugging
2. mark the analysis run failed
3. return a safe fallback report state
4. do not show malformed content to users

## Later-phase knowledge source

Longer term, the model should reason over compact, versioned WatchTell knowledge
— structured claims, evidence, and provenance, temporal seller/factory
intelligence, and materialized dossiers/snapshots — rather than raw retrieval on
every call. This is later-phase architecture, not current MVP scope. See
`docs/knowledge-architecture.md`.
