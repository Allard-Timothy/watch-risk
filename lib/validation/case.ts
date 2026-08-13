import { z } from "zod";

/**
 * Input validation for creating a watch case. Used by case-intake forms and
 * API/route handlers. Only `brand` is required; the remaining listing details
 * are optional at intake and can be completed before analysis.
 */

const optionalTrimmedString = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((value) => (value ? value : undefined));

export const caseCreateSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required").max(100),
  model: z.string().trim().max(100).optional(),
  reference: z.string().trim().max(100).optional(),
  claimedYear: z.string().trim().max(20).optional(),
  askingPrice: z.number().nonnegative().finite().optional(),
  sellerPlatform: z.string().trim().max(100).optional(),
  listingUrl: z.string().trim().url("Enter a valid URL").max(2000).optional(),
  listingText: optionalTrimmedString,
  sellerClaims: optionalTrimmedString,
});
export type CaseCreateInput = z.infer<typeof caseCreateSchema>;

/**
 * Coercing variant for HTML form submissions, where every field arrives as a
 * string. `askingPrice` is coerced from its string input to a number.
 */
export const caseCreateFormSchema = caseCreateSchema.extend({
  askingPrice: z.coerce.number().nonnegative().finite().optional(),
});
export type CaseCreateFormInput = z.input<typeof caseCreateFormSchema>;
