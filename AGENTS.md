# WatchTell project instructions

## Source of truth

Use the uploaded project files as the source of truth before making product,
design, architecture, or code recommendations.

Work in small, reviewable steps. Prefer exact file trees, code patches, commands,
and implementation order.

## Product

WatchTell is a pre-purchase buyer-risk assessment app for luxury watch listings.

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

WatchTell is a single Next.js (App Router) + TypeScript app at the repository
root. The earlier Django scaffold has been removed. Standard commands are in
`README.md`: `pnpm install`, `pnpm dev` (http://localhost:3000), `pnpm typecheck`,
`pnpm build`. Key routes: `/`, `/cases/new`, `/reports/[reportId]`.

Startup/run caveats (non-obvious):

- `pnpm install` runs `prisma generate` via the `postinstall` hook; it does not
  need a database or `DATABASE_URL`. The data model is defined but not wired to a
  database yet (no migrations; `lib/db/client.ts` is a lazy placeholder), so the
  app runs without Postgres.
- The app pins pnpm 11 (via `packageManager`). Build-script approval lives in
  `pnpm-workspace.yaml` under `allowBuilds` (e.g. `sharp: true`, `prisma: true`);
  the legacy `pnpm.onlyBuiltDependencies` field is ignored by pnpm 11.
- Prisma is pinned to v6. Do not bump to v7 without a rewrite: v7 removed
  `datasource.url` from the schema and requires a `prisma.config.ts`
  adapter-based client.
- A local Postgres is available for future Prisma work via `docker compose up -d db`
  (`docker-compose.yml`); `DATABASE_URL` in `.env.example` matches it. It is not
  required to run the app today.
- Do not run `pnpm build` and then `pnpm dev` in the same working tree: the
  production build overwrites `.next` and breaks the dev server (500s, e.g.
  missing `.next/dev/routes-manifest.json`). If dev starts 500ing after a build,
  stop dev, `rm -rf .next`, and restart `pnpm dev`.
