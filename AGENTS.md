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

## WatchTell product feature registry

The canonical WatchTell product capability registry is:

`docs/product/features.md`

Also read `docs/product/vision.md`, `docs/product/principles.md`, and
`docs/product/roadmap.md`. Do not copy the full inventory into this file.

Agents MUST consult the registry when:

- planning new functionality
- implementing product features
- changing domain models
- proposing architecture
- modifying the knowledge system
- modifying AI analysis behavior
- adding or changing QC, factory, seller, watch/reference, movement,
  evidence, provenance, scoring, or recommendation capabilities

The feature registry describes WatchTell's intended long-term product.

A listed feature is NOT evidence that the feature currently exists.

Before implementing functionality:

1. Identify relevant feature IDs.
2. Inspect current implementation.
3. Determine current feature status.
4. Identify dependencies.
5. Limit work to requested feature scope.
6. Do not automatically implement adjacent backlog items.
7. Update the registry when implementation materially changes feature status.

Use feature IDs in plans, implementation notes, and architectural
discussions where useful.

The feature registry is the product source of truth.
Architecture documentation describes implementation strategy.
Code is the source of truth for current implementation.

## Product principles (summary)

Full text: `docs/product/principles.md`.

1. **Specificity over generic analysis.** Prefer brand → reference →
   factory → version → batch. Do not propagate knowledge sideways.
   Fall back explicitly and lower confidence when specificity is missing.
2. **Evidence over consensus.** Repetition is not independence.
3. **Uncertainty must remain visible.** Do not fabricate certainty or
   dummy numeric scores.
4. **Retrieval is not the knowledge model.** Routine analysis uses
   curated dossiers. Do not scrape forums or add RAG/embeddings unless
   that work is explicitly requested.
5. **Claims and evidence are different.** Do not store extracted text as
   unquestioned fact.
6. **Preserve conflict.** Do not discard disagreement for a cleaner
   answer.
7. **Temporal knowledge matters.** Seller and factory facts go stale.
8. **Explain recommendations.** Observation → knowledge → evidence →
   risk → recommendation.
9. **Evaluate decisions, not microscopic perfection.** Known factory
   variance is not automatically a defect.
10. **Model providers are replaceable.** Knowledge stays product-owned.

## Implementing a requested feature

1. Read this file.
2. Open only the relevant feature IDs and their dependencies in
   `docs/product/features.md`.
3. Inspect current implementation.
4. Check whether architecture docs already govern the area.
5. Plan only the requested IDs.
6. Preserve provenance, confidence, and language rules.
7. Update feature status after material implementation.
8. Update architecture docs when architecture materially changes.
9. Add or update tests where relevant.
10. Do not build vector databases, scrapers, extra model providers, or
    other later-phase infrastructure because a future ID exists.

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
- Cloud Agents commit, push, and open **draft** PRs. A human merges. Do not
  scrape forums. Do not invent dummy numeric scores. Prisma stays on v6.

## Next knowledge-layer PRs (queue)

Land these in order, each as its own `cursor/<short-name>-5373` branch off `main`.
Keep PRs small. Forbidden conclusion words stay out of seed and UI.

1. **Factory + defect ontology and seed.** Add Factory / FactoryVersion / Defect
   Zod schemas and Prisma tables. Curated JSON under `data/knowledge/factories/`
   for the factories already named on model dossiers (at least VSF, plus an
   `unknown` factory). Known defects are qualitative (area, what buyers should
   look for, what photos cannot show). No scraping.
2. **Factory pages.** `/factories` and `/factories/[factoryId]` with known-defect
   lists, version notes, and source-independence copy. Sidebar + overview link.
   Match seller-page density; no WatchDesk numeric scores.
3. **Wire factory defects into reports.** If a case dossier has a factory, show a
   "Known factory variance" section and add checkpoint concerns only when the
   relevant photo is missing (`cannot assess from submitted images`). Still no
   vision model. Do not treat a known variance as proof of a defect in the photos.
4. **Seller and compare follow-through.** Unresolved intake handles stay visible
   ("typed X, no curated match"). Seller index filters by community / recognition.
   Compare page accepts any two community ids (keep the RepTime vs RepWatchForum
   narrative as the default). TD remains evidence with provenance.
5. **Thicker model dossiers and QC profiles.** Expand the three existing
   references with `knownVariance` / `highValueChecks` (and factory version when
   known). Optional `/references/[id]` read-only page. Generator uses those checks
   for seller questions. Follow `docs/how-to/add-a-new-watch-reference.md`.

## Parallel Cloud Agents (collision rules)

Run one Cloud Agent per queued PR. Each agent owns a unique
`cursor/<short-name>-5373` branch off `origin/main` and a draft PR to `main`.
Do not stack on another agent’s unmerged branch unless the prompt says to.

Before editing, check open PRs and your ownership table. If a needed file is
owned by another in-flight PR, stop and say so — do not “just touch it.”

### File ownership (do not overlap)

| Queue PR | Owns (only these) | Do not edit |
|---|---|---|
| 1 Factory ontology + seed | `prisma/schema.prisma`, `prisma/migrations/`, `lib/knowledge/schemas.ts`, `lib/knowledge/enums.ts`, `lib/knowledge/load.ts`, `lib/knowledge/persist.ts`, `lib/knowledge/index.ts`, `data/knowledge/factories/` | UI routes, report generator, seller/compare pages |
| 2 Factory pages | `app/factories/`, factory components, sidebar/overview **link-only** hunks | Prisma, seed schemas, `lib/reports/` |
| 3 Wire defects into reports | `lib/reports/`, `components/report-dashboard.tsx`, `app/reports/` | Prisma, factory seed, seller/compare pages |
| 4 Seller/compare follow-through | `app/sellers/`, `app/compare/`, `lib/knowledge/compare.ts`, `lib/knowledge/resolve.ts`, case-form/detail seller-handle copy | Prisma, `data/knowledge/factories/`, `lib/reports/generate-report.ts` |
| 5 Thicker dossiers | `data/knowledge/references/`, optional `app/references/`, `docs/how-to/add-a-new-watch-reference.md` | Prisma, factory seed, seller/compare pages |

Shared files (`components/sidebar.tsx`, `components/app-shell.tsx`, `app/page.tsx`, `AGENTS.md`): make the smallest possible hunk (one nav link / one sentence). If another PR already changed that file, wait or call it out.

**Never in parallel with another agent:** new npm/pnpm dependencies, `pnpm-lock.yaml`, Prisma migrations, or rewriting `lib/knowledge/schemas.ts`.

Safe parallel sets: **1 + 4 + 5**. Not safe: **2 or 3 until 1 is merged**; **3 until 1 (and preferably 2) is merged**.

Do not rebase, force-push, or merge other agents’ branches. Do not scrape. Draft PR only.
