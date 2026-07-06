from django.contrib import admin

from .models import PaymentRecord


@admin.register(PaymentRecord)
class PaymentRecordAdmin(admin.ModelAdmin):
    list_display = ("id", "case", "status", "amount_cents", "currency", "created_at")
    list_filter = ("status", "currency", "created_at")
    search_fields = ("case__brand", "case__model", "case__reference", "stripe_checkout_session_id")
    readonly_fields = ("created_at", "updated_at")
