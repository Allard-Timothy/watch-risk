from django.contrib import admin

from .models import WatchCase


@admin.register(WatchCase)
class WatchCaseAdmin(admin.ModelAdmin):
    list_display = ("id", "brand", "model", "reference", "status", "user", "created_at")
    list_filter = ("status", "brand", "created_at")
    search_fields = ("brand", "model", "reference", "listing_url", "listing_text", "seller_claims")
    readonly_fields = ("created_at", "updated_at")
