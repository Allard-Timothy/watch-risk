# Adding a factory tell

Factory tells are qualitative buyer-checklist items stored on factory seed JSON.
They are **not** authentication proof and must not use forbidden conclusion
words (see `docs/product/decisions.md` and `AGENTS.md`).

## Where tells live

- Schema: `factoryTellSeedSchema` in `lib/knowledge/schemas.ts`
- Seed files: `data/knowledge/factories/<factoryId>.json`
- UI: `/factories/[factoryId]` via `components/factory-profile.tsx`

## Tell record shape

Each tell in the `tells[]` array should include:

| Field | Purpose |
|---|---|
| `id` | Stable slug, e.g. `vsf-sub-dial-alignment` |
| `area` | Human label for the watch area |
| `photoType` | Optional `DetectedPhotoType` when a specific photo helps |
| `whatBuyersShouldLookFor` | What to inspect before purchase |
| `whatPhotosCannotShow` | Limits of photo-only assessment |
| `references` | Model/reference ids this tell applies to (optional) |
| `factoryVersionId` | Version scope when known (optional) |

Known variances (`knownVariances[]`, formerly `defects[]`) remain separate:
they feed the report “Known factory variance” section. Tells are first-class
curated guidance on factory profile pages (`FACTORY-004`).

## Steps

1. Open or create `data/knowledge/factories/<factoryId>.json`.
2. Add a tell object under `tells[]` using safe, evidence-oriented language.
3. Run `pnpm test lib/knowledge/schemas.test.ts` and
   `pnpm test lib/knowledge/load.test.ts`.
4. If the factory is new, upsert tests may require Postgres —
   `pnpm exec prisma migrate deploy` then `pnpm test lib/knowledge/persist.test.ts`.
5. Verify `/factories/<factoryId>` renders the new tell section.

## Example (abbreviated)

```json
{
  "factoryId": "clean",
  "canonicalName": "Clean Factory",
  "tells": [
    {
      "id": "clean-date-wheel-font",
      "area": "Date wheel",
      "photoType": "date_cyclops",
      "whatBuyersShouldLookFor": "Compare date numeral shape and spacing to reference photos for this model.",
      "whatPhotosCannotShow": "Cannot assess alignment or feel from a single listing photo.",
      "references": ["tudor-black-bay-58"]
    }
  ]
}
```

## Report wiring

Tells appear on factory pages first. Report provenance may cite factory tell ids
when the generator references curated guidance (`REPORT-005`). Do not treat a
tell as proof of a visible defect in submitted photos.
