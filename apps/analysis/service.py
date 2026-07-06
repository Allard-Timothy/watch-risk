from __future__ import annotations

from dataclasses import dataclass

from django.conf import settings

from apps.cases.models import WatchCase
from apps.reports.models import Report

from .schemas import BuyerRiskReport


PROMPT_VERSION = "case_analysis_v1"


@dataclass(frozen=True)
class AnalysisResult:
    report: BuyerRiskReport
    raw_output: dict


class WatchRiskAnalyzer:
    """Analysis orchestrator.

    This initial implementation is intentionally conservative. It creates a useful
    placeholder report without making unsupported authentication claims.

    Replace `_call_model` with real OpenAI structured-output calls once the first
    web flow is working.
    """

    model_name = settings.OPENAI_MODEL

    def analyze_case(self, case: WatchCase) -> AnalysisResult:
        missing = self._missing_evidence(case)
        confidence = "low" if missing else "medium"
        risk = "cannot_assess" if len(missing) >= 3 else "medium"

        report = BuyerRiskReport(
            overall_risk=risk,
            confidence=confidence,
            missing_evidence=missing,
            visible_concerns=[],
            seller_questions=[
                "Can you provide a straight-on dial photo in natural light?",
                "Can you provide clear clasp and end-link photos?",
                "Can you provide a movement photo or arrange independent inspection?",
            ],
            recommended_next_step=(
                "Request the missing photos before proceeding. If the seller refuses, treat the listing as higher risk."
            ),
            safe_summary=(
                "The submitted evidence is not enough to support a low-risk purchase decision."
            ),
        )
        return AnalysisResult(report=report, raw_output=report.model_dump())

    def _missing_evidence(self, case: WatchCase) -> list[str]:
        existing = {image.claimed_type for image in case.images.all() if image.claimed_type}
        required = {
            "dial": "Straight-on dial photo",
            "clasp": "Clear clasp photo",
            "rehaut": "Clear rehaut photo",
            "caseback": "Caseback photo",
        }
        return [label for key, label in required.items() if key not in existing]


def run_analysis_for_case(case: WatchCase) -> Report:
    analyzer = WatchRiskAnalyzer()

    case.status = WatchCase.Status.ANALYZING
    case.save(update_fields=["status", "updated_at"])

    result = analyzer.analyze_case(case)

    report, _ = Report.objects.update_or_create(
        case=case,
        defaults={
            "risk_level": result.report.overall_risk,
            "confidence": result.report.confidence,
            "report_json": result.report.model_dump(),
            "report_text": result.report.safe_summary,
            "raw_model_output": result.raw_output,
            "model_used": analyzer.model_name,
            "prompt_version": PROMPT_VERSION,
        },
    )

    case.status = WatchCase.Status.COMPLETE
    case.save(update_fields=["status", "updated_at"])

    return report
