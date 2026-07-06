from django import forms

from .models import WatchCase


class WatchCaseForm(forms.ModelForm):
    class Meta:
        model = WatchCase
        fields = [
            "brand",
            "model",
            "reference",
            "claimed_year",
            "asking_price",
            "seller_platform",
            "listing_url",
            "listing_text",
            "seller_claims",
        ]
        widgets = {
            "listing_text": forms.Textarea(attrs={"rows": 5}),
            "seller_claims": forms.Textarea(attrs={"rows": 4}),
        }
