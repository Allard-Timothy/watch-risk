# Report schema

The buyer-risk report schema is defined in `apps/analysis/schemas.py`.

## BuyerRiskReport

```json
{
  "overall_risk": "low | medium | high | cannot_assess",
  "confidence": "low | medium | high",
  "missing_evidence": [],
  "visible_concerns": [],
  "seller_questions": [],
  "recommended_next_step": "",
  "safe_summary": ""
}
```

## ImageFinding

```json
{
  "area": "",
  "severity": "low | medium | high",
  "finding": "",
  "visible_evidence": "",
  "uncertainty": ""
}
```

## Wording constraints

Reports must not use:

- authentic
- genuine
- fake
- counterfeit
- certified
- verified
- guaranteed
- passed

Reports should use:

- visible concern
- missing evidence
- cannot assess
- photo-based risk
- independent inspection recommended
