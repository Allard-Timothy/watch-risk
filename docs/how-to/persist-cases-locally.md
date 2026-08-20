# How to persist cases locally

Use this when overview and the sample report already work, and you need saved
cases and photos in Postgres.

## Prerequisites

- Docker
- The app already runs (`pnpm dev`). See
  [Getting started](../tutorials/getting-started.md) if it does not.

## 1. Start Postgres

```bash
docker compose up -d db
```

`DATABASE_URL` in `.env.example` matches the `watchrisk` database in
`docker-compose.yml`. Copy `.env.example` to `.env` if you have not already.

## 2. Apply migrations

```bash
pnpm exec prisma migrate deploy
```

`pnpm install` only runs `prisma generate`. It does not apply migrations.

## 3. Save a case

1. Open `/cases/new`.
2. Enter listing details and upload photos.
3. Save.

Listing details persist as `WatchCase`. Photo metadata persists as `CaseImage`.
Photo bytes are written under `.data/uploads/{caseId}/` on the app machine, not
to Google Cloud Storage.

The report for that case is `/reports/{caseId}` (same id as the case). Opening
it writes or updates `AnalysisRun` and `Report` with
`modelUsed: deterministic-rules`.

## If the database is down

Overview (`/`) and the sample report at `/reports/WR-2026-0481` still render.
Creating or opening a saved case requires Postgres.
