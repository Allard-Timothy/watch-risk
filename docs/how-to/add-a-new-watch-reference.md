# How to add a new watch reference

Use this guide when adding structured support for a new watch reference.

Curated dossiers live under `data/knowledge/references/` as one JSON file per
reference. Zod validates them through `modelDossierSeedSchema` in
`lib/knowledge/schemas.ts`. Do not scrape forums.

## 1. Create the reference record

Add `data/knowledge/references/<id>.json` with:

- `id` (stable slug, for example `vsf-126610ln`)
- `brand`
- `modelFamily`
- `reference`
- `factory` (use a canonical factory label already in
  `data/knowledge/factories/`, or `unknown`)
- `factoryVersion` when a curated factory version id is known
- `requiredPhotos` and `optionalPhotos` (photo-type keys such as `dial`,
  `rehaut`, `clasp`)
- `riskCheckpoints` keyed by photo type
- `knownVariance` (area, optional photo type, what buyers should look for,
  what photos cannot show)
- `highValueChecks` (seller questions for missing evidence)
- `notes`

Keep user-facing copy free of conclusion words such as authentic, genuine,
fake, counterfeit, certified, verified, guaranteed, or passed.

## 2. Add risk checkpoints and known variance

For each reference, document:

- dial checks
- date/cyclops checks
- rehaut checks
- bracelet checks
- clasp checks
- caseback checks
- movement checks
- known photo limitations

Known variance is qualitative. It is what buyers should ask to see, not proof
that a submitted photo shows a defect.

Do not include improvement instructions for replica construction.

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

## 4. High-value seller questions

`highValueChecks` are questions to ask when the matching photo is missing.
They should use safer language (`cannot assess from submitted images`,
`independent inspection recommended`).

The report generator can consume these later; this seed is still useful as a
read-only dossier at `/references/[id]`.

## 5. Add tests

Add or extend tests for:

- seed parse of the new JSON file
- forbidden-word scan on notes, known variance, and seller questions
- missing required photos
- reference mismatch handling

## 6. Update docs

Update:

- `docs/architecture-typescript.md` (data model) when the dossier shape changes
- this file if you add required dossier fields
