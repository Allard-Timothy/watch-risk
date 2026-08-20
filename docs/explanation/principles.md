# WatchTell product principles

These rules apply to product design, knowledge modeling, report language, and
agent implementation. They are not optional when a feature is listed as later
phase.

Existing wording and authentication boundaries in
[`docs/report-rules.md`](../report-rules.md) and
[`docs/explanation/product-boundaries.md`](../explanation/product-boundaries.md)
still apply.

## Rule 1: Specificity over generic analysis

WatchTell should reason at the most specific reliable level available.

Preferred hierarchy:

```text
Brand
  → Reference
    → Factory
      → Factory Version
        → Batch / Production Period
```

Knowledge should not automatically propagate upward or sideways.

Examples:

- A VSF 126610LV characteristic does not automatically become a rule for all
  VSF watches.
- A VSF Submariner rule does not automatically become a rule for a VSF
  Datejust.
- A V2 production issue does not automatically become a current V4 issue.

When sufficient specificity is unavailable, WatchTell should explicitly fall
back to a broader knowledge level and reduce confidence accordingly.

Related features: `QC-001`, `IDENT-001`, `FACTORY-002`, `KNOW-001`.

## Rule 2: Evidence over consensus

WatchTell must not equate repetition with independent evidence.

Every meaningful knowledge claim should eventually be capable of carrying:

- source
- provenance
- source type
- date
- independence
- corroboration
- confidence
- specificity
- conflicting evidence

Ten forum comments repeating the same original claim are not ten independent
observations. Prefer multiple independent corroborating observations over raw
mention count.

Related features: `EVID-005`, `EVID-006`, `TD-004`.

## Rule 3: Uncertainty must remain visible

WatchTell must not fabricate certainty.

The system should distinguish concepts such as:

```text
confirmed observation
likely observation
possible observation
known factory characteristic
known factory defect
normal production variance
possible photographic artifact
seller claim
community claim
disputed claim
insufficient evidence
```

Confidence should reflect the evidence available. Do not manufacture
precise-looking scores when the underlying evidence cannot support that
precision. Do not invent dummy numeric scores.

Related features: `VERDICT-001`, `VERDICT-004`, `REPORT-004`, `REPORT-008`.

## Rule 4: Retrieval is not the knowledge model

WatchTell should not become a thin wrapper that searches Reddit or forums for
every user question.

Routine analysis should primarily use structured and curated knowledge.

Raw source retrieval should supplement the knowledge layer when:

- knowledge is missing
- evidence is sparse
- sources conflict
- something appears new
- a factory or seller may have changed
- the requested information is time-sensitive
- confidence is low
- a user explicitly requests current research
- a case is unusual enough to require original-source inspection

Forum and Reddit retrieval should feed and update WatchTell's knowledge system
rather than replace it.

Do not scrape forums in the current phase. Do not add embeddings, vector
search, or crawlers because a future feature might need them.

Related features: `KNOW-004`, `KNOW-005`, `EVID-001`.

## Rule 5: Claims and evidence are different things

A claim is something somebody says or that WatchTell infers.

Evidence is what supports that claim.

Example:

```text
Claim:
"Factory X improved the crystal in V3."

Possible evidence:
- side-by-side macro photography
- seller announcement
- multiple independent owner reports
- teardown
- known V2/V3 examples
```

Do not store claims as unquestioned facts simply because they were extracted
from a source.

Related features: `EVID-001`, `EVID-002`, `KNOW-001`.

## Rule 6: Conflicting information should be preserved

If credible evidence disagrees, represent the disagreement.

Do not silently discard one side merely so WatchTell can return a cleaner
answer.

The system should eventually support conclusions such as:

```text
Evidence is mixed.

Earlier examples show X.

Recent reports suggest Y.

Confidence is moderate because no controlled comparison is currently available.
```

Related features: `EVID-008`, `REPORT-008`.

## Rule 7: Temporal knowledge matters

Factories, sellers, versions, batches, and movements change.

Important knowledge should carry temporal context when possible:

```text
current
last 90 days
last 12 months
historical
production period
factory version
known batch
```

A seller with a strong historical reputation can still have recent fulfillment
problems. A factory flaw documented two years ago may have been fixed.

Related features: `SELLER-003`, `FACTORY-003`, `IDENT-004`, `EVID-007`.

## Rule 8: Explain recommendations

WatchTell should be able to explain why it reached a conclusion.

Important output should connect:

```text
observation
→ relevant knowledge
→ evidence/confidence
→ risk/severity
→ recommendation
```

Avoid opaque recommendations.

Related features: `VERDICT-005`, `REPORT-005`, `EVAL-004`.

## Rule 9: WatchTell evaluates decisions, not microscopic perfection

Replica QC requires context.

A visible characteristic may be:

- expected for the factory
- inherent to every available version
- technically different from genuine but normal for the replica
- genuine production variance
- fixable
- irrelevant during normal wrist use
- serious enough to RL

WatchTell should help users make better decisions rather than encouraging
endless microscopic defect hunting.

Related features: `QC-007`, `QC-008`, `VERDICT-002`, `VERDICT-003`.

## Rule 10: Model providers are replaceable

Do not tightly couple WatchTell's domain knowledge or product logic to one LLM
provider.

Knowledge, scoring rules, evidence models, and domain concepts should remain
product-owned where practical.

LLMs should consume WatchTell knowledge. The LLM itself should not be treated
as WatchTell's durable knowledge store.

Related features: `EVAL-003`, `KNOW-003`, `KNOW-004`.

## Rule 11: Replica and grey-market QC stay separate

Replica listings and grey-market genuine listings must not share QC photos.

They use separate QC decision trees: checklists, known variance, pixel and
video rules, and verdicts.

A replica factory tell is not a grey-market inspection rule. Knowledge may
name the same brand or reference; QC assets and decision logic are not mixed.

Related features: `QC-001`, `QC-002`, `MODEL-004`. Decision: `DEC-004`.

## Additional WatchTell constraints

These are already in force in the current product:

- Do not describe WatchTell as an authentication, certification, or
  verification product.
- Forbidden user-facing conclusion words: authentic, genuine, fake,
  counterfeit, certified, verified, guaranteed, passed.
- Forum TD status is evidence with provenance, not `trusted: true`.
- Never merge two sellers because names look similar.
- Do not invent dummy numeric scores.
- Do not scrape forums.
- A factory or seller label on a listing is a claim, not a photo conclusion.
- Known factory variance is what buyers should look for. It is not proof that
  a submitted photo shows a defect.
- Prisma `Defect` should be renamed to match that language (`DEC-005`).
- Dummy numeric scores remain forbidden. Evidence-based seller reliability
  scores are in scope (`DEC-007`).
- Factory comparison (`FACTORY-007`) requires top-10 factory coverage
  (`DEC-006`).
