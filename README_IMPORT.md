# WatchTell PyCharm Context Pack

This folder is meant to be copied into the root of the WatchTell repo.

It gives PyCharm AI Assistant, Junie, Cursor, Codex, or another coding assistant enough local context to rewrite the app as a TypeScript-first product.

## How to import

From the root of your repo:

```bash
unzip ~/Downloads/watchrisk-pycharm-context.zip -d /tmp/watchrisk-context
rsync -av /tmp/watchrisk-context/watchrisk-pycharm-context/ .
git status
```

If you want to avoid overwriting existing docs:

```bash
rsync -av --ignore-existing /tmp/watchrisk-context/watchrisk-pycharm-context/ .
```

## What this includes

```text
.junie/AGENTS.md
docs/product-brief.md
docs/architecture-typescript.md
docs/migration-plan.md
docs/report-rules.md
docs/ai-contract.md
docs/design-guidance.md
prompts/pycharm-typescript-rewrite.md
assets/watchdesk-risk-report-dashboard.png
```

## How to use in PyCharm

1. Open the repo in PyCharm.
2. Open `.junie/AGENTS.md`.
3. Open `docs/product-brief.md`.
4. Open `docs/architecture-typescript.md`.
5. Open `docs/design-guidance.md`.
6. Open `assets/watchdesk-risk-report-dashboard.png`.
7. Ask PyCharm AI Assistant or Junie to read those files before changing code.
8. Use the prompt in `prompts/pycharm-typescript-rewrite.md`.

The image in `assets/` is the visual guidance reference. It should guide tone, layout, and product feel. It is not a pixel-perfect design contract.
