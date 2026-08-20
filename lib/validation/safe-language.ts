/**
 * Guards user-facing report language against unsupported authentication or
 * certification wording. See docs/reference/report-rules.md and docs/reference/ai-contract.md.
 *
 * These words may appear in internal tests and safety docs, but must not appear
 * in final user-facing report conclusions.
 */

export const FORBIDDEN_REPORT_WORDS = [
  "authentic",
  "genuine",
  "fake",
  "counterfeit",
  "certified",
  "verified",
  "guaranteed",
  "passed",
] as const;

export type ForbiddenReportWord = (typeof FORBIDDEN_REPORT_WORDS)[number];

const FORBIDDEN_PATTERN = new RegExp(
  `\\b(${FORBIDDEN_REPORT_WORDS.join("|")})\\b`,
  "i",
);

/**
 * Returns the forbidden words found in a piece of user-facing text.
 * Matching is case-insensitive and word-boundary aware, so "authentication"
 * (a legitimate word) does not match "authentic".
 */
export function findForbiddenWords(text: string): ForbiddenReportWord[] {
  const found = new Set<ForbiddenReportWord>();
  for (const word of FORBIDDEN_REPORT_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    if (pattern.test(text)) {
      found.add(word);
    }
  }
  return [...found];
}

export function containsForbiddenLanguage(text: string): boolean {
  return FORBIDDEN_PATTERN.test(text);
}
