# WatchTell project instructions

## Source of truth

Use the uploaded project files as the source of truth before making product,
design, architecture, or code recommendations.

Work in small, reviewable steps. Prefer exact file trees, code patches, commands,
and implementation order.

## Product

WatchTell is a pre-purchase buyer-risk assessment app for watch listings
(including replica-community listings).

The product must not claim to authenticate watches, certify watches, verify
watches, or guarantee authenticity. Forum TD status is evidence, not a
universal trust score.

## User-facing language

Avoid these user-facing conclusion words:

- authentic
- genuine
- fake
- counterfeit
- certified
- verified
- guaranteed
- passed

Use safer language:

- photo-based buyer-risk report
- visible concern
- missing evidence
- cannot assess from submitted images
- no obvious photo-based red flags detected
- independent inspection recommended

## Target stack

- Next.js
- TypeScript
- App Router
- Tailwind
- shadcn/ui-ready components
- Prisma
- Postgres
- Stripe placeholders
- OpenAI placeholders
- Google Cloud Storage placeholders
- Cloud Run later

## Existing detailed guidance

Also follow `.junie/AGENTS.md`, which contains the detailed product flow,
architecture constraints, reporting rules, code style, suggested repository
structure, and MVP implementation order. If guidance conflicts, this root file
and the current uploaded project files take precedence.

## Cursor Cloud specific instructions

Branching: base every branch off `main` and target pull requests at `main`.
`ta/add-scaffolding` is retired as an integration branch — do not branch from it
or target it.

WatchTell is a single Next.js (App Router) + TypeScript app at the repository
root. The earlier Django scaffold has been removed. Standard commands are in
`README.md`: `pnpm install`, `pnpm dev` (http://localhost:3000), `pnpm typecheck`,
`pnpm build`, `pnpm test`. Key routes: `/` (overview), `/cases/new`,
`/cases/[caseId]`, `/reports/[reportId]`, `/sellers`, `/sellers/[sellerId]`,
`/compare/communities`. The chrome is a dashboard shell
(dark sidebar + light canvas) guided by `assets/watchdesk-risk-report-dashboard.png`.

Startup/run caveats (non-obvious):

- `pnpm install` runs `prisma generate` via the `postinstall` hook. It does not
  start Postgres or apply migrations. Overview and the sample report still
  render without a database.
- Case create/detail persist `WatchCase` listing details and `CaseImage`
  metadata. Photo bytes are written under `.data/uploads/{caseId}/`. Before
  saving a case, start Postgres (`docker compose up -d db`) and apply migrations
  (`pnpm exec prisma migrate deploy`). `DATABASE_URL` is in `.env.example`.
- A saved case report is `/reports/{caseId}` (same id as the case). Opening it
  writes or updates `AnalysisRun` + `Report` with `modelUsed: deterministic-rules`.
  The sample layout at `/reports/WR-2026-0481` is unchanged. Photos on a saved-case
  report are served from `/api/cases/{caseId}/images/{imageId}` and are real
  `CaseImage` files only (sample wells may still use placeholders). GCS is not wired.
- Seller handle on intake resolves by exact seller id, canonical name, or an
  explicit alias. Similar names are never merged (Lin Seller ≠ Lin Feng). The
  resolved seller is upserted before `WatchCase.sellerId` is stored so the FK
  succeeds. The report seller card groups community recognition by independence
  group and links to `/sellers/{id}`. Missing RWI TD is not a negative by itself.
- If `WatchCase.reference` matches a curated dossier under `data/knowledge/references/`,
  the generator and case-photo checklist use that required-photo set. `visibleConcerns`
  come from missing checkpoints, seller `product_claim` flags, and optional manual
  notes — never from pixel analysis. Factory claim and fulfillment chips are
  qualitative labels, not dummy scores.
- Seller/community knowledge is curated local seed data (Zod schemas in
  `lib/knowledge/`, Prisma tables from the `seller_knowledge` migration). Do not
  scrape forums. TD recognition is stored per community, not as `trusted: true`.
- The app pins pnpm 11 (via `packageManager`). Use Corepack (`corepack enable`
  then `corepack prepare pnpm@11.9.0 --activate`); do not install pnpm globally.
  Build-script approval lives in `pnpm-workspace.yaml` under `allowBuilds`
  (e.g. `sharp: true`, `prisma: true`); the legacy `pnpm.onlyBuiltDependencies`
  field is ignored by pnpm 11.
- Prisma is pinned to v6. Do not bump to v7 without a rewrite: v7 removed
  `datasource.url` from the schema and requires a `prisma.config.ts`
  adapter-based client.
- A local Postgres is available via `docker compose up -d db`
  (`docker-compose.yml`); `DATABASE_URL` in `.env.example` matches it. It is
  required to save or reload cases and photos, not to view the sample report.
- Do not run `pnpm build` and then `pnpm dev` in the same working tree: the
  production build overwrites `.next` and breaks the dev server (500s, e.g.
  missing `.next/dev/routes-manifest.json`). If dev starts 500ing after a build,
  stop dev, `rm -rf .next`, and restart `pnpm dev`.
