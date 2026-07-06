from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "risk_level", "confidence", "model_used", "prompt_version", "created_at")
    list_filter = ("risk_level", "confidence", "model_used", "prompt_version", "created_at")
    search_fields = ("case__brand", "case__model", "case__reference", "report_text")
    readonly_fields = ("created_at", "updated_at")
