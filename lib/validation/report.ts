import { z } from "zod";

import { findForbiddenWords } from "./safe-language";

/**
 * Zod schemas for AI output. All model output must be validated with these
 * before it is saved or shown to a user (docs/reference/ai-contract.md).
 *
 * Field names follow the camelCase JSON contract in docs/reference/ai-contract.md.
 * The string enum values (e.g. "cannot_assess") are the on-the-wire values;
 * the Prisma layer stores the corresponding uppercase enum variants.
 */

export const riskLevelSchema = z.enum([
  "low",
  "medium",
  "high",
  "cannot_assess",
]);
export type RiskLevel = z.infer<typeof riskLevelSchema>;

export const confidenceLevelSchema = z.enum(["low", "medium", "high"]);
export type ConfidenceLevel = z.infer<typeof confidenceLevelSchema>;

export const severitySchema = z.enum(["low", "medium", "high"]);
export type Severity = z.infer<typeof severitySchema>;

export const DETECTED_PHOTO_TYPES = [
  "dial",
  "clasp",
  "rehaut",
  "caseback",
  "bracelet",
  "movement",
  "papers",
  "date_cyclops",
  "other",
] as const;
export const detectedPhotoTypeSchema = z.enum(DETECTED_PHOTO_TYPES);
export type DetectedPhotoType = z.infer<typeof detectedPhotoTypeSchema>;

/** A single structured observation about a photo or the listing. */
export const imageFindingSchema = z.object({
  area: z.string().min(1),
  severity: severitySchema,
  finding: z.string().min(1),
  visibleEvidence: z.string().min(1),
  uncertainty: z.string().nullish(),
});
export type ImageFinding = z.infer<typeof imageFindingSchema>;

/** Per-image classification output. */
export const imageClassificationSchema = z.object({
  detectedType: detectedPhotoTypeSchema,
  usable: z.boolean(),
  qualityScore: z.number().min(0).max(1),
  issues: z.array(z.string()).default([]),
  findings: z.array(imageFindingSchema).default([]),
});
export type ImageClassification = z.infer<typeof imageClassificationSchema>;

/**
 * Final buyer-risk report output.
 *
 * A safety refinement rejects unsupported authentication/certification wording
 * in user-facing conclusion fields so malformed model output cannot reach users.
 */
export const buyerRiskReportSchema = z
  .object({
    overallRisk: riskLevelSchema,
    confidence: confidenceLevelSchema,
    missingEvidence: z.array(z.string()).default([]),
    visibleConcerns: z.array(imageFindingSchema).default([]),
    sellerQuestions: z.array(z.string()).default([]),
    recommendedNextStep: z.string().min(1),
    safeSummary: z.string().min(1),
  })
  .superRefine((report, ctx) => {
    const userFacing: Array<{ path: (string | number)[]; text: string }> = [
      { path: ["safeSummary"], text: report.safeSummary },
      { path: ["recommendedNextStep"], text: report.recommendedNextStep },
      ...report.missingEvidence.map((text, i) => ({
        path: ["missingEvidence", i],
        text,
      })),
      ...report.sellerQuestions.map((text, i) => ({
        path: ["sellerQuestions", i],
        text,
      })),
      ...report.visibleConcerns.map((concern, i) => ({
        path: ["visibleConcerns", i, "finding"],
        text: concern.finding,
      })),
    ];

    for (const { path, text } of userFacing) {
      const forbidden = findForbiddenWords(text);
      if (forbidden.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path,
          message: `Report language must not use authentication/certification wording: ${forbidden.join(", ")}`,
        });
      }
    }
  });
export type BuyerRiskReport = z.infer<typeof buyerRiskReportSchema>;

/** Safe fallback report used when model output fails validation. */
export const SAFE_FALLBACK_REPORT: BuyerRiskReport = {
  overallRisk: "cannot_assess",
  confidence: "low",
  missingEvidence: [],
  visibleConcerns: [],
  sellerQuestions: [],
  recommendedNextStep:
    "We could not produce a report from the submitted images. Request additional photos and consider an independent inspection before proceeding.",
  safeSummary:
    "The submitted evidence could not be assessed. This is a photo-based buyer-risk report, not an authentication certificate.",
};
