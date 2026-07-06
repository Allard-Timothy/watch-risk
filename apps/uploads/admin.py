from django.contrib import admin

from .models import CaseImage


@admin.register(CaseImage)
class CaseImageAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "claimed_type", "detected_type", "quality_score", "usable", "created_at")
    list_filter = ("claimed_type", "detected_type", "usable", "created_at")
    search_fields = ("case__brand", "case__model", "case__reference")
