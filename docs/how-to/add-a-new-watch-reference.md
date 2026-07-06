# How to add a new watch reference

Use this guide when adding structured support for a new watch reference.

The initial implementation may not have a full reference database yet. This guide describes the intended path.

## 1. Create the reference record

Capture:

- brand
- model family
- reference number
- case size
- movement family
- bracelet options
- clasp type
- bezel type
- dial variants
- expected photo checklist

## 2. Add risk checkpoints

For each reference, document:

- dial checks
- date/cyclops checks
- rehaut checks
- bracelet checks
- clasp checks
- caseback checks
- movement checks
- known photo limitations

Do not include counterfeit improvement instructions.

## 3. Update required photos

Set the minimum useful evidence.

Example:

```text
Rolex Submariner 126610LN:
  required:
    - straight-on dial
    - rehaut
    - clasp
    - caseback
  optional:
    - movement
    - warranty card
    - timegrapher
```

## 4. Add prompt context

Add reference-specific context to the analysis layer.

Do not let the prompt produce authentication claims.

## 5. Add tests

Add tests for:

- missing required photos
- confidence capping
- report wording
- unsafe terms
- reference mismatch handling

## 6. Update docs

Update:

- `docs/reference/data-model.md`
- `docs/explanation/risk-scoring.md`
