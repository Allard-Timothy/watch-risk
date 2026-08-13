# Development Guide

This guide explains how to run and work on WatchTell locally.

It is a practical guide for contributors. It assumes basic Python, Django, Postgres, and command-line experience.

## Prerequisites

Install:

- Python 3.12+
- uv
- Docker
- Postgres client tools
- Google Cloud CLI
- Stripe CLI
- Git

Optional but useful:

- direnv
- make
- pre-commit

## Local environment

Create a local `.env` file:

```bash
cp .env.example .env
```

Do not commit `.env`.

## Run Postgres locally

Use Docker Compose:

```bash
docker compose up -d db
```

## Install dependencies

Using `uv`:

```bash
uv sync
```

## Run migrations

```bash
uv run python manage.py migrate
```

## Create an admin user

```bash
uv run python manage.py createsuperuser
```

## Start the development server

```bash
uv run python manage.py runserver
```

Open:

```text
http://localhost:8000
```

Admin:

```text
http://localhost:8000/admin/
```

## Run tests

```bash
uv run python manage.py test
```

If using pytest:

```bash
uv run pytest
```

## Run formatting and linting

```bash
uv run ruff check .
uv run black .
uv run mypy .
uv run djlint templates --check
```

## Run an analysis job manually

During local development, use a management command instead of Cloud Tasks.

```bash
uv run python manage.py analyze_case CASE_ID
```

Expected behavior:

1. Load the case.
2. Load uploaded images.
3. Run image classification.
4. Run case-level analysis.
5. Apply deterministic rules.
6. Save the report.
7. Mark case as complete.
