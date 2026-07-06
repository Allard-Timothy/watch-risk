# Data model

This reference describes the initial data model.

## WatchCase

Represents a listing under review.

Fields:

- `user`
- `brand`
- `model`
- `reference`
- `claimed_year`
- `asking_price`
- `seller_platform`
- `listing_url`
- `listing_text`
- `seller_claims`
- `status`
- `created_at`
- `updated_at`

## CaseImage

Represents one uploaded image for a case.

Fields:

- `case`
- `image`
- `claimed_type`
- `detected_type`
- `quality_score`
- `usable`
- `analysis_json`
- `created_at`

## Report

Represents the generated buyer-risk report.

Fields:

- `case`
- `risk_level`
- `confidence`
- `report_json`
- `report_text`
- `raw_model_output`
- `model_used`
- `prompt_version`
- `created_at`
- `updated_at`

## PaymentRecord

Represents payment state for a case.

Fields:

- `case`
- `stripe_checkout_session_id`
- `stripe_payment_intent_id`
- `amount_cents`
- `currency`
- `status`
- `raw_event`
- `created_at`
- `updated_at`
