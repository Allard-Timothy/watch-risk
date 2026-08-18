# WatchTell project guidelines

## Product

WatchTell is a pre-purchase buyer-risk assessment app for watch listings,
including replica-community listings.

Users upload listing details, photos, seller claims, reference information, and price. The app generates a buyer-risk report that identifies missing evidence, visible inconsistencies, seller-risk signals, and questions to ask before buying.

WatchTell does not authenticate watches. It does not certify watches. It does not guarantee authenticity. Forum TD status is evidence, not a universal trust score.

## Product language rules

Never describe a watch as:

- authentic
- genuine
- fake
- counterfeit
- certified
- verified
- guaranteed
- passed

Use safer language:

- no obvious photo-based red flags detected
- visible concern
- missing evidence
- cannot assess from submitted images
- inconsistent with the claimed reference
- independent inspection recommended
- high-risk listing
- medium-risk listing
- low visible risk

## Target MVP

Build a mobile-first web app with this flow:

1. User creates a watch case.
2. User enters brand, model, reference, claimed year, price, seller platform, listing URL, listing text, and seller claims.
3. User uploads photos.
4. App validates photo completeness.
5. User pays through Stripe Checkout.
6. App runs AI-assisted report generation.
7. User views a structured buyer-risk report.

## Current rewrite direction

Use a TypeScript-first web stack:

- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Prisma
- Postgres
- Google Cloud Storage
- Stripe Checkout
- OpenAI API
- Cloud Run

Prefer a monolith first. Do not introduce microservices unless necessary.

## Architecture rules

Keep the app boring and shippable.

Do not add:

- native mobile app
- Kubernetes
- GraphQL
- custom auth unless needed
- marketplace features
- human-review workflow before basic reports work
- multi-brand deep support before the first supported references work

## AI/reporting rules

AI output must be structured JSON and validated before saving.

Separate:

- uploaded evidence
- model observations
- deterministic rules
- final report language

The model should not be the only decision-maker.

Apply deterministic caps:

- no dial photo means confidence cannot be high
- no movement photo means movement cannot be assessed
- poor image quality lowers confidence
- missing clasp photo limits bracelet assessment
- missing price limits price-risk assessment
- seller refusal to provide photos increases listing risk

## Code style

Use clear, boring TypeScript.

Prefer:

- explicit types
- small functions
- server-side validation
- Zod schemas
- Prisma migrations
- clean folder boundaries
- simple server actions or route handlers
- minimal client components

Avoid clever abstractions before the MVP works.

## Suggested repo structure

```text
app/
  page.tsx
  layout.tsx
  cases/
    new/
      page.tsx
    [caseId]/
      page.tsx
  reports/
    [reportId]/
      page.tsx

components/
  app-shell.tsx
  case-form.tsx
  photo-upload.tsx
  risk-report-card.tsx
  report-section.tsx

lib/
  auth/
  db/
  storage/
  stripe/
  openai/
  reports/
  validation/

prisma/
  schema.prisma

docs/
  product-brief.md
  architecture-typescript.md
  migration-plan.md
  report-rules.md
  ai-contract.md
  design-guidance.md

assets/
  watchdesk-risk-report-dashboard.png
```

## MVP priority

The first priority is not visual polish. It is a paid workflow that produces a useful report.

Build in this order:

1. Data model
2. Case creation
3. Photo upload
4. Report schema
5. Placeholder report generation
6. Stripe Checkout
7. Real OpenAI call
8. Report UI
9. Admin review
10. Deployment
