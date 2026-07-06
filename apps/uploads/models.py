from django.db import models

from apps.cases.models import WatchCase


class CaseImage(models.Model):
    class PhotoType(models.TextChoices):
        DIAL = "dial", "Dial"
        REHAUT = "rehaut", "Rehaut"
        DATE_CYCLOPS = "date_cyclops", "Date / cyclops"
        BEZEL = "bezel", "Bezel"
        CROWN_GUARDS = "crown_guards", "Crown guards"
        CASEBACK = "caseback", "Caseback"
        BRACELET = "bracelet", "Bracelet"
        CLASP = "clasp", "Clasp"
        END_LINKS = "end_links", "End links"
        MOVEMENT = "movement", "Movement"
        PAPERS = "papers", "Papers"
        OTHER = "other", "Other"

    case = models.ForeignKey(WatchCase, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="case-images/%Y/%m/%d/")
    claimed_type = models.CharField(max_length=50, choices=PhotoType.choices, blank=True)
    detected_type = models.CharField(max_length=50, blank=True)
    quality_score = models.FloatField(null=True, blank=True)
    usable = models.BooleanField(default=True)
    analysis_json = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"Image {self.pk} for case {self.case_id}"
