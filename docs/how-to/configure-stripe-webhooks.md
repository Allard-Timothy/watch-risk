# How to configure Stripe webhooks locally

Use this guide when testing Stripe Checkout or webhook handling on your machine.

## 1. Start Django

```bash
uv run python manage.py runserver
```

## 2. Start webhook forwarding

```bash
stripe listen --forward-to localhost:8000/billing/webhooks/stripe/
```

Stripe prints a webhook secret.

It starts with:

```text
whsec_
```

## 3. Update `.env`

Set:

```bash
STRIPE_WEBHOOK_SECRET=whsec_replace_me
```

Restart Django after changing `.env`.

## 4. Trigger a test event

```bash
stripe trigger checkout.session.completed
```

## 5. Confirm webhook response

The local server should return HTTP 200.

The current implementation is a placeholder. The production implementation must:

- verify the Stripe signature
- parse the event
- handle `checkout.session.completed`
- mark the matching case paid
- enqueue analysis
- behave idempotently
