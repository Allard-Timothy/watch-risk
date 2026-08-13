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
- Prisma + Postgres (data model defined; not wired to a database yet)
- Stripe / OpenAI / Google Cloud Storage: placeholder modules only

The app lives at the repository root. The earlier Django scaffold has been
removed in favor of this TypeScript-first stack.

## Requirements

- Node.js 20.9 or newer
- pnpm (this repo pins pnpm 11 via `packageManager`)
- Docker (optional, only for a local Postgres via `docker-compose.yml`)

## Run locally

```bash
pnpm install        # also runs `prisma generate` via postinstall
cp .env.example .env
pnpm dev            # http://localhost:3000
```

Key routes: `/` (landing), `/cases/new` (case intake), `/reports/[reportId]`
(placeholder buyer-risk report).

## Checks

```bash
pnpm typecheck
pnpm build
```

## Database (optional, not wired yet)

Prisma is configured (`prisma/schema.prisma`) but the app does not query a
database yet. A local Postgres is available via Docker for future work:

```bash
docker compose up -d db
pnpm exec prisma validate
pnpm exec prisma generate
```

`DATABASE_URL` in `.env.example` matches the `watchrisk` database defined in
[`docker-compose.yml`](docker-compose.yml).

## Documentation

See [`docs/`](docs/) — notably `product-brief.md`, `architecture-typescript.md`,
`ai-contract.md`, `report-rules.md`, `migration-plan.md`, `design-guidance.md`,
and `knowledge-architecture.md`.

## Current boundaries

- No account or login flow
- No database persistence yet
- No file storage, payment, or model calls (placeholders only)
