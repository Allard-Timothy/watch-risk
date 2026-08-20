# Local magic-link sign-in and mock checkout

Use this flow when developing the commercial MVP without SMTP, Stripe, or
production billing.

## Prerequisites

1. Copy `.env.example` to `.env` and set at least:

   ```bash
   DATABASE_URL="postgresql://watchtell:watchtell@localhost:5432/watchtell"
   AUTH_SECRET="dev-only-change-me"
   PAYMENTS_MODE=mock
   ```

2. Start Postgres and apply migrations:

   ```bash
   docker compose up -d db
   pnpm exec prisma migrate deploy
   ```

3. Start the dev server:

   ```bash
   pnpm dev
   ```

## Magic-link sign-in (Auth.js)

1. Open [http://localhost:3000/login](http://localhost:3000/login).
2. Enter your email and submit.
3. Watch the **server terminal** — `lib/email/console.ts` logs the full magic
   link URL instead of sending mail when no SMTP/Resend credentials are set.
4. Open the logged URL in your browser to complete sign-in.
5. Visit `/account` to see saved cases and credit balance.

Unauthenticated users can still draft intake locally (`sessionStorage`). Saving
a case to Postgres requires a session; `WatchCase.userId` is set on create.

## Mock checkout and credits

With `PAYMENTS_MODE=mock`:

- `/pricing` lists single-report, bundle, and subscription SKUs.
- Checkout redirects to `/api/checkout/mock`, which marks the `PaymentRecord`
  as `PAID` and grants credits or activates a subscription.
- In development and mock mode, reports and knowledge explorers stay open
  without consuming credits (`lib/billing/access.ts`).

To exercise production-style gating locally, set `NODE_ENV=production` and
`PAYMENTS_MODE=stripe` (without `STRIPE_SECRET_KEY`) — explorers require a
subscription and reports require credits.

## Integration status

The overview page and `server/integrations.ts` reflect which adapters are
active: local storage, deterministic analysis, mock payments, and Postgres when
`DATABASE_URL` is set.

## Related docs

- [`docs/architecture-typescript.md`](../architecture-typescript.md) — adapter
  modules (`lib/storage`, `lib/payments`, `lib/analysis`, `lib/email`)
- [`docs/product/decisions.md`](../product/decisions.md) — DEC-008 commercial MVP
- [`docs/ai-contract.md`](../ai-contract.md) — report JSON including `qcVerdict`
