from typing import Literal

from pydantic import BaseModel, Field


RiskLevel = Literal["low", "medium", "high", "cannot_assess"]
ConfidenceLevel = Literal["low", "medium", "high"]


class ImageFinding(BaseModel):
    area: str
    severity: Literal["low", "medium", "high"]
    finding: str
    visible_evidence: str
    uncertainty: str | None = None


class ImageClassification(BaseModel):
    detected_type: str
    usable: bool
    quality_score: float = Field(ge=0, le=1)
    issues: list[str] = Field(default_factory=list)
    findings: list[ImageFinding] = Field(default_factory=list)


class BuyerRiskReport(BaseModel):
    overall_risk: RiskLevel
    confidence: ConfidenceLevel
    missing_evidence: list[str] = Field(default_factory=list)
    visible_concerns: list[ImageFinding] = Field(default_factory=list)
    seller_questions: list[str] = Field(default_factory=list)
    recommended_next_step: str
    safe_summary: str
