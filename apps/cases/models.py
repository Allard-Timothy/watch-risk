from django.conf import settings
from django.db import models
from django.urls import reverse


class WatchCase(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        READY_FOR_PAYMENT = "ready_for_payment", "Ready for payment"
        PAID = "paid", "Paid"
        ANALYZING = "analyzing", "Analyzing"
        COMPLETE = "complete", "Complete"
        ERROR = "error", "Error"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100, blank=True)
    reference = models.CharField(max_length=100, blank=True)
    claimed_year = models.CharField(max_length=20, blank=True)
    asking_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    seller_platform = models.CharField(max_length=100, blank=True)
    listing_url = models.URLField(blank=True)
    listing_text = models.TextField(blank=True)
    seller_claims = models.TextField(blank=True)
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        parts = [self.brand, self.model, self.reference]
        return " ".join(part for part in parts if part) or f"Case {self.pk}"

    def get_absolute_url(self) -> str:
        return reverse("cases:detail", kwargs={"pk": self.pk})
