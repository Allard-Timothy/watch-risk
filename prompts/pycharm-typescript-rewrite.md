# PyCharm / Junie prompt

Read these files before making changes:

- `.junie/AGENTS.md`
- `docs/explanation/product-brief.md`
- `docs/reference/architecture-typescript.md`
- `docs/explanation/migration-plan.md`
- `docs/reference/report-rules.md`
- `docs/reference/ai-contract.md`
- `docs/reference/design-guidance.md`
- `assets/watchdesk-risk-report-dashboard.png`

We are rewriting the current Django scaffold into a TypeScript-first Next.js app.

Create the initial Next.js architecture using:

- TypeScript
- App Router
- Tailwind
- shadcn/ui-ready structure
- Prisma
- Postgres
- Zod validation
- Stripe placeholder module
- OpenAI placeholder module
- Google Cloud Storage placeholder module

Do not implement real payment or model calls yet.

First create:

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- app layout
- landing page
- case creation page
- case detail page
- report placeholder page
- Prisma schema
- Zod schemas
- placeholder report generator
- design tokens or Tailwind theme direction
- `docs/reference/architecture-typescript.md` updates if needed

Follow the product constraints in `.junie/AGENTS.md`.

Avoid authentication language.

Use the reference image in `assets/watchdesk-risk-report-dashboard.png` as visual guidance, not a pixel-perfect requirement.

Keep the MVP boring and shippable.

After scaffolding, provide:

1. the file tree changed
2. commands to install dependencies
3. commands to run locally
4. any unresolved assumptions
