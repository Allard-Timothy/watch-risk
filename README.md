# WatchTell

WatchTell is a pre-purchase, photo-based buyer-risk assessment app for luxury
watch listings. Buyers submit listing details, seller claims, price, reference
information, and photos, and the app produces a buyer-risk report that flags
missing evidence, visible concerns, seller-risk signals, and questions to ask
before purchase.

WatchTell does not authenticate, certify, or verify watches, and it is not a
substitute for a watchmaker or brand service center. See
[`.cursor/rules/watchrisk.mdc`](.cursor/rules/watchrisk.mdc) and
[`docs/report-rules.md`](docs/report-rules.md) for the product and language
rules.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS, shadcn/ui-ready structure
- Zod validation
- Prisma + Postgres (listing details persist; photos/payments/model still placeholders)
- Stripe / OpenAI / Google Cloud Storage: placeholder modules only

The app lives at the repository root. The earlier Django scaffold has been
removed in favor of this TypeScript-first stack.

## Requirements

- Node.js 20.9 or newer (includes [Corepack](https://nodejs.org/api/corepack.html))
- Docker (optional for overview/sample report; required for local Postgres via `docker-compose.yml` if you want to save cases)

Do not install pnpm globally (`npm i -g pnpm`, Homebrew, apt, etc.). This repo
pins `pnpm@11.9.0` via `packageManager` in `package.json`. Corepack fetches that
exact version into a per-user cache and does not install a system-wide package
manager.

## Run locally

```bash
corepack enable
corepack prepare pnpm@11.9.0 --activate
pnpm install        # also runs `prisma generate` via postinstall
cp .env.example .env
pnpm dev            # http://localhost:3000
```

If you prefer not to put a `pnpm` shim on your PATH, prefix commands with
`corepack` instead (`corepack pnpm install`, `corepack pnpm dev`).

Key routes: `/` (overview), `/cases/new` (case intake), `/cases/[caseId]`
(saved case), `/reports/[reportId]` (placeholder buyer-risk report).

## Checks

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Database

Case intake writes `WatchCase` rows to Postgres. Start the database, copy env,
and apply migrations before saving a case:

```bash
docker compose up -d db
cp .env.example .env
pnpm exec prisma migrate deploy
```

`DATABASE_URL` in `.env.example` matches the `watchrisk` database in
[`docker-compose.yml`](docker-compose.yml). `pnpm install` still runs
`prisma generate` only; it does not start Postgres or apply migrations.

Overview (`/`) and the sample report still render without a database. Creating
or opening a saved case requires Postgres.

## Documentation

See [`docs/`](docs/) — notably `product-brief.md`, `architecture-typescript.md`,
`ai-contract.md`, `report-rules.md`, `migration-plan.md`, `design-guidance.md`,
and `knowledge-architecture.md`.

## Current boundaries

- No account or login flow
- Photos are not persisted (in-browser only)
- No file storage, payment, or model calls (placeholders only)
