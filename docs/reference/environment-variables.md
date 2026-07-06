# Environment variables

This is the reference list of supported environment variables.

| Name | Required | Description |
|---|---:|---|
| `DJANGO_SETTINGS_MODULE` | Yes | Django settings module. Use `config.settings.local` locally. |
| `DJANGO_SECRET_KEY` | Yes | Django secret key. Use a real secret in production. |
| `DJANGO_DEBUG` | Yes | `true` locally, `false` in production. |
| `DJANGO_ALLOWED_HOSTS` | Yes | Comma-separated allowed hosts. |
| `DATABASE_URL` | Yes | Postgres connection URL. |
| `OPENAI_API_KEY` | Later | OpenAI API key. Required once real model calls are enabled. |
| `OPENAI_MODEL` | Yes | Model name used for analysis. |
| `STRIPE_SECRET_KEY` | Later | Stripe secret key. Required once Checkout is enabled. |
| `STRIPE_WEBHOOK_SECRET` | Later | Stripe webhook signing secret. |
| `STRIPE_PRICE_BASIC` | Later | Stripe Price ID for basic report. |
| `STRIPE_PRICE_FULL` | Later | Stripe Price ID for full report. |
| `GCS_BUCKET_NAME` | Production | Cloud Storage bucket name. |
| `USE_GCS_STORAGE` | Yes | `false` locally, `true` in production. |
