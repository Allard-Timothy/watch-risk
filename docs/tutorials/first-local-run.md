# Tutorial: first local run

This tutorial gets WatchRisk running locally for the first time.

At the end, you will have:

- local Postgres running
- Django migrations applied
- an admin user
- the development server running
- one watch case created
- one placeholder report generated

## 1. Clone the repository

```bash
git clone git@github.com:YOUR_ORG/watch-risk.git
cd watch-risk
```

## 2. Create local environment file

```bash
cp .env.example .env
```

For the first run, you can leave OpenAI and Stripe values as placeholders. The placeholder analysis path does not call external APIs yet.

## 3. Start Postgres

```bash
docker compose up -d db
```

## 4. Install dependencies

```bash
uv sync
```

## 5. Run migrations

```bash
uv run python manage.py migrate
```

## 6. Create admin user

```bash
uv run python manage.py createsuperuser
```

## 7. Start Django

```bash
uv run python manage.py runserver
```

Open:

```text
http://localhost:8000
```

## 8. Create a case

Log in, then create a case.

Use sample data:

```text
Brand: Rolex
Model: Submariner Date
Reference: 126610LN
Claimed year: 2023
Asking price: 12500
Seller platform: Private seller
```

## 9. Generate a placeholder report

Find the case ID in the URL or Django admin.

Run:

```bash
uv run python manage.py analyze_case CASE_ID
```

Reload the case page. A report link should appear.

## 10. Review the report

Open the report.

The report should clearly say it is a buyer-risk report, not an authentication certificate.
