from django.db import models
from django.urls import reverse

from apps.cases.models import WatchCase


class Report(models.Model):
    case = models.OneToOneField(WatchCase, on_delete=models.CASCADE, related_name="report")
    risk_level = models.CharField(max_length=50)
    confidence = models.CharField(max_length=50)
    report_json = models.JSONField(default=dict)
    report_text = models.TextField(blank=True)
    raw_model_output = models.JSONField(default=dict, blank=True)
    model_used = models.CharField(max_length=100)
    prompt_version = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Report for case {self.case_id}"

    def get_absolute_url(self) -> str:
        return reverse("reports:detail", kwargs={"pk": self.pk})
