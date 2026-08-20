# Getting started

This lesson gets you a running WatchTell app and a buyer-risk report on screen.
You do not need Postgres for these steps.

You will:

1. Install the pinned package manager
2. Install dependencies
3. Start the app
4. Open the sample report

## 1. Enable pnpm through Corepack

From the repository root:

```bash
corepack enable
corepack prepare pnpm@11.9.0 --activate
```

Do not install pnpm globally. The repo pins `pnpm@11.9.0` in `package.json`.

If you prefer not to put a `pnpm` shim on your PATH, prefix later commands with
`corepack` (`corepack pnpm install`, `corepack pnpm dev`).

## 2. Install and configure

```bash
pnpm install
cp .env.example .env
```

`pnpm install` also runs `prisma generate`. It does not start Postgres or apply
migrations. That is fine for this lesson.

## 3. Start the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the
overview dashboard.

## 4. Open a sample buyer-risk report

Go to [http://localhost:3000/reports/WR-2026-0481](http://localhost:3000/reports/WR-2026-0481).

You should see a photo-based buyer-risk report. Notice what it does and does
not claim:

- It flags missing evidence, visible concerns, and seller questions.
- It does not authenticate, certify, or verify the watch.

That is the product boundary. Safer wording lives in the
[report rules](../reference/report-rules.md).

## What you can do next

- Create a case at `/cases/new`. Saving it needs Postgres; see
  [How to persist cases locally](../how-to/persist-cases-locally.md).
- Read [product vision](../explanation/vision.md) if you want the why.
- Look up a capability ID in the
  [feature registry](../reference/features.md) before changing product
  behavior.

## Checks (optional)

In another terminal, from the repository root:

```bash
pnpm typecheck
pnpm test
```

Do not run `pnpm build` and then `pnpm dev` in the same working tree. A
production build overwrites `.next` and breaks the dev server. If that happens,
stop the dev server, run `rm -rf .next`, and start `pnpm dev` again.
