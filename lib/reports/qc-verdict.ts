import type { ImageFinding, QcVerdict, RiskLevel } from "@/lib/validation";

export const QC_VERDICT_COPY: Record<QcVerdict, string> = {
  gl: "GL",
  gl_with_reservations: "GL with reservations",
  conditional_gl: "Conditional GL",
  request_additional_evidence: "Request additional evidence",
  rl: "RL",
  insufficient_evidence: "Insufficient evidence",
};

export function deriveQcVerdict(input: {
  overallRisk: RiskLevel;
  missingEvidenceCount: number;
  visibleConcerns: readonly ImageFinding[];
  stockPhotosOnly?: boolean;
}): QcVerdict {
  if (input.stockPhotosOnly || input.missingEvidenceCount >= 4) {
    return "insufficient_evidence";
  }
  if (input.missingEvidenceCount >= 1) {
    return "request_additional_evidence";
  }

  const highConcerns = input.visibleConcerns.filter(
    (item) => item.severity === "high",
  );
  if (highConcerns.length > 0 || input.overallRisk === "high") {
    return "rl";
  }

  const mediumConcerns = input.visibleConcerns.filter(
    (item) => item.severity === "medium",
  );
  if (mediumConcerns.length >= 2 || input.overallRisk === "medium") {
    return "conditional_gl";
  }
  if (mediumConcerns.length === 1) {
    return "gl_with_reservations";
  }
  if (input.overallRisk === "cannot_assess") {
    return "insufficient_evidence";
  }
  return "gl";
}

export function qcVerdictToRiskHeadline(qcVerdict: QcVerdict): RiskLevel {
  switch (qcVerdict) {
    case "gl":
      return "low";
    case "gl_with_reservations":
    case "conditional_gl":
      return "medium";
    case "rl":
      return "high";
    case "request_additional_evidence":
    case "insufficient_evidence":
      return "cannot_assess";
  }
}
