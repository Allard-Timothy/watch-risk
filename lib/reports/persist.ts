import type {
  AnalysisRunStatus,
  ConfidenceLevel,
  RiskLevel,
} from "@prisma/client";

import { getDbClient } from "@/lib/db";
import { toPrismaEnum } from "@/lib/knowledge/enums";
import type { GeneratedReport } from "./generate-report";

export const DETERMINISTIC_MODEL = "deterministic-rules";
export const DETERMINISTIC_PROMPT_VERSION = "knowledge-v2";

/**
 * Persist the latest deterministic report for a saved case.
 * Reuses the most recent Report row when one exists so reloads do not
 * accumulate AnalysisRun rows.
 */
export async function persistGeneratedReport(
  caseId: string,
  report: GeneratedReport,
) {
  const db = getDbClient();
  const payload = {
    riskLevel: toPrismaEnum<RiskLevel>(report.overallRisk),
    confidence: toPrismaEnum<ConfidenceLevel>(report.confidence),
    reportJson: report,
    reportText: [report.safeSummary, report.recommendedNextStep].join("\n\n"),
    modelUsed: DETERMINISTIC_MODEL,
    promptVersion: DETERMINISTIC_PROMPT_VERSION,
  };

  const existing = await db.report.findFirst({
    where: { caseId },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    return db.report.update({
      where: { id: existing.id },
      data: payload,
    });
  }

  const run = await db.analysisRun.create({
    data: {
      caseId,
      status: toPrismaEnum<AnalysisRunStatus>("complete"),
      modelUsed: DETERMINISTIC_MODEL,
      promptVersion: DETERMINISTIC_PROMPT_VERSION,
    },
  });

  return db.report.create({
    data: {
      ...payload,
      caseId,
      analysisRunId: run.id,
    },
  });
}
