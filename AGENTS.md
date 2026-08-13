# WatchRisk project instructions

## Source of truth

Use the uploaded project files as the source of truth before making product,
design, architecture, or code recommendations.

Work in small, reviewable steps. Prefer exact file trees, code patches, commands,
and implementation order.

## Product

WatchRisk is a pre-purchase buyer-risk assessment app for luxury watch listings.

The product must not claim to authenticate watches, certify watches, verify
watches, or guarantee authenticity.

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

This repo hosts two apps mid-migration; both run in dev:

- Django scaffold at the repo root (the current working product). Python 3.12
  managed with `uv`. Standard dev commands are in `docs/development.md` and
  `README.md` (`uv run python manage.py ...`, `uv run pytest`, `uv run ruff check .`).
- Next.js rewrite in `apps/web/` (currently an app shell only, no DB/auth/API).
  Commands are in `apps/web/README.md` (`pnpm dev`, `pnpm typecheck`, `pnpm build`).

Startup/run caveats (non-obvious):

- Postgres runs locally as a system service, not via Docker (Docker is not
  installed here). Start it with `sudo service postgresql start` before running
  Django. The `watchrisk` role/db and `.env` (copied from `.env.example`) are
  already provisioned in the environment.
- The update script runs `uv sync` and `pnpm install` but intentionally does NOT
  run DB migrations. After pulling changes or on a fresh DB, run
  `uv run python manage.py migrate` yourself. Migrations are committed under
  `apps/*/migrations/`.
- `apps/web` uses pnpm 11 (pinned via `packageManager`). Build-script approval
  lives in `apps/web/pnpm-workspace.yaml` under `allowBuilds` (e.g. `sharp: true`,
  `prisma: true`); the legacy `pnpm.onlyBuiltDependencies` field is ignored by
  pnpm 11.
- `apps/web` uses Prisma pinned to v6. Do not bump to v7 without a rewrite: v7
  removed `datasource.url` from the schema and requires a `prisma.config.ts`
  adapter-based client. The Prisma client is generated into `node_modules` by the
  `postinstall` hook (runs on every `pnpm install`); it does not need a database
  or `DATABASE_URL` to generate. The data model is not wired to a database yet
  (no migrations, `lib/db/client.ts` is a lazy placeholder).
- The Django app has no self-signup UI; log in with an existing/superuser account
  at `/accounts/login/`. Create one with `uv run python manage.py createsuperuser`.
- Report generation is not wired to the UI yet. Create a case at `/cases/new/`,
  then generate its report with `uv run python manage.py analyze_case <case_id>`
  (analysis is a deterministic placeholder; no real OpenAI/Stripe/GCS calls).
- `ruff check .` currently reports pre-existing import-ordering issues in the
  scaffold; these are not caused by environment setup.
- In `apps/web`, do not run `pnpm build` and then `pnpm dev` in the same
  directory: the production build overwrites `.next` and breaks the dev server
  (500s, e.g. missing `.next/dev/routes-manifest.json`). If dev starts 500ing
  after a build, stop dev, `rm -rf apps/web/.next`, and restart `pnpm dev`.
