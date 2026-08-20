# Risk scoring

Risk scoring combines model output with deterministic product rules.

The model can identify photo types, visible issues, and missing evidence. Deterministic rules cap confidence and adjust risk when evidence is missing.

## Risk levels

### Low

Use only when:

- required photo set is mostly complete
- photo quality is usable
- no visible concerns are found
- no major seller-risk signal exists

Low risk must still say:

> No obvious photo-based red flags detected.

It must not say:

> Authentic.

### Medium

Use when:

- some important evidence is missing
- photos are partially useful
- listing details are incomplete
- price or seller behavior deserves caution

### High

Use when:

- visible details conflict with the claim
- seller refuses basic evidence
- pricing is suspiciously low
- listing uses stock photos
- claims are unsupported

### Cannot assess

Use when:

- photo set is too incomplete
- photos are too blurry
- submitted content does not show the watch clearly
- required evidence is missing for the claimed assessment

## Confidence caps

Examples:

- No dial photo: confidence cannot be high.
- No movement photo: movement cannot be assessed.
- No clasp photo: bracelet confidence is limited.
- Poor image quality: confidence decreases.
- Missing price: price-risk analysis is limited.

## Why deterministic rules matter

The model should not be the only decision-maker.

Rules keep the product conservative, repeatable, and safer.

## High-value checks

When a listing matches a curated model dossier, `highValueChecks` become seller
questions on the photo-based buyer-risk report. They do not invent pixel
findings. Known variance is what buyers should ask to see; it is not proof of a
defect in submitted photos.
