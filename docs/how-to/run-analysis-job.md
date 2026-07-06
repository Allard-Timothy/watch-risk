# How to run an analysis job

Use this guide when manually generating or regenerating a report.

## Run locally

```bash
uv run python manage.py analyze_case CASE_ID
```

Example:

```bash
uv run python manage.py analyze_case 123
```

## Expected behavior

The command should:

1. Load the case.
2. Read uploaded image metadata.
3. Determine missing evidence.
4. Build the report payload.
5. Save or update the report.
6. Mark the case complete.

## When to rerun

Rerun analysis when:

- new photos are added
- prompt version changes
- schema version changes
- deterministic rules change
- a previous run failed

## Safety rule

Rerunning must not remove the original raw output unless the old output is intentionally archived. Reports are product and evaluation data.
