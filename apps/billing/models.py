from django.db import models

from apps.cases.models import WatchCase


class PaymentRecord(models.Model):
    class Status(models.TextChoices):
        CREATED = "created", "Created"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    case = models.ForeignKey(WatchCase, on_delete=models.CASCADE, related_name="payments")
    stripe_checkout_session_id = models.CharField(max_length=255, blank=True)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    amount_cents = models.PositiveIntegerField(default=0)
    currency = models.CharField(max_length=10, default="usd")
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.CREATED)
    raw_event = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
