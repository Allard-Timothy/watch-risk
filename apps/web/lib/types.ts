/**
 * Shared domain types for the WatchTell web app.
 *
 * These are derived from the Zod validation schemas so the runtime validators
 * and the compile-time types cannot drift apart. Import from here when you only
 * need the types (not the schemas).
 */

export type {
  RiskLevel,
  ConfidenceLevel,
  Severity,
  DetectedPhotoType,
  ImageFinding,
  ImageClassification,
  BuyerRiskReport,
} from "./validation/report";

export type { CaseCreateInput, CaseCreateFormInput } from "./validation/case";

export type { ForbiddenReportWord } from "./validation/safe-language";
