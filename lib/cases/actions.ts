"use server";

import { createWatchCase } from "@/lib/cases/repository";
import {
  caseCreateFormSchema,
  type CaseCreateInput,
} from "@/lib/validation";

type FieldName = keyof CaseCreateInput;

export type CreateCaseResult =
  | Readonly<{ ok: true; id: string }>
  | Readonly<{
      ok: false;
      errors?: Partial<Record<FieldName, string>>;
      message?: string;
    }>;

export async function createCaseAction(
  raw: Record<string, string>,
): Promise<CreateCaseResult> {
  const parsed = caseCreateFormSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<FieldName, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as FieldName | undefined;
      if (key && !errors[key]) {
        errors[key] = issue.message;
      }
    }
    return { ok: false, errors };
  }

  try {
    const created = await createWatchCase(parsed.data as CaseCreateInput);
    return { ok: true, id: created.id };
  } catch (error) {
    console.error("createWatchCase failed", error);
    return {
      ok: false,
      message:
        "Could not save the case. Check that Postgres is running and DATABASE_URL is set.",
    };
  }
}
