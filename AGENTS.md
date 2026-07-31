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
