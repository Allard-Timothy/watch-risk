# Migration plan from Django scaffold to TypeScript app

## Goal

Replace the Django scaffold with a TypeScript-first Next.js app while preserving the product decisions from the original planning work.

## Phase 1: repo reset (done)

Complete. The project took the clean-rewrite path: the Django scaffold has been
removed and the Next.js app was promoted from `apps/web/` to the repository root,
so WatchTell is now a single TypeScript-first project. `docker-compose.yml`
(Postgres) is retained for future Prisma work.

## Phase 2: create Next.js foundation

Create:

- `package.json`
- `next.config.ts`
- `tsconfig.json`
- `tailwind.config.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `components/`
- `lib/`
- `prisma/schema.prisma`

## Phase 3: data model

Implement Prisma models for:

- WatchCase
- CaseImage
- AnalysisRun
- Report
- PaymentRecord

Do not add full auth before the basic case/report flow works locally.

## Phase 4: case workflow

Build:

- landing page
- case creation page
- case detail page
- placeholder image upload UI
- placeholder report generation

## Phase 5: report workflow

Build:

- Zod report schema
- placeholder report generator
- report detail page
- report language guard tests

## Phase 6: integrations

Add integrations only after local placeholder workflow is functional.

Order:

1. Postgres
2. Google Cloud Storage
3. Stripe Checkout
4. OpenAI structured output
5. Cloud Run
6. Cloud Tasks or worker route

## Phase 7: design pass

Use `assets/watchdesk-risk-report-dashboard.png` as visual guidance.

Design goals:

- confidence
- intelligence
- trust
- sharpness
- calm
- mechanical/technical feel
- no overused AI purple/blue branding

## Phase 8: beta path

Ship a manually reviewed beta before automating everything.

The first sellable version can be:

- user submits case
- user pays
- system generates draft report
- owner reviews/edits report
- user receives report

## Later-phase: AI knowledge architecture

After the paid placeholder workflow and initial integrations, evolve the AI
layer toward structured claims, evidence, and provenance, temporal
seller/factory intelligence, and materialized dossiers/snapshots consumed at
runtime. This is later-phase architecture that extends the plan above — not
immediate MVP scope, and it does not require crawling, scraping, embeddings, or
vector search to begin. See `docs/knowledge-architecture.md`.
