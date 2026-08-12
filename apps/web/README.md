# WatchRisk web

Initial TypeScript-first Next.js application for WatchRisk.

This directory is intentionally isolated from the existing Django scaffold. The
first step includes only the application shell, Tailwind theme, shadcn/ui-ready
aliases, and typed integration boundaries. It does not connect to external
services or a database.

## Requirements

- Node.js 20.9 or newer
- pnpm

## Run locally

```bash
cd apps/web
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Checks

```bash
pnpm typecheck
pnpm build
```

## Current boundaries

- No account or login flow
- No database access
- No file storage calls
- No payment calls
- No model calls
- No shadcn/ui components generated yet
