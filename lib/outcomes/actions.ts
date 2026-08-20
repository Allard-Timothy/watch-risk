"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { createOutcome } from "@/lib/outcomes/repository";

const outcomeSchema = z.object({
  caseId: z.string().min(1),
  receivedWatch: z.enum(["yes", "no", ""]).optional(),
  qcPhotosMatched: z.enum(["yes", "no", ""]).optional(),
  fulfillmentIssue: z.string().max(2000).optional(),
  factoryClaimNote: z.string().max(2000).optional(),
  consentToStore: z.enum(["on"]).optional(),
});

export async function submitOutcomeAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const parsed = outcomeSchema.safeParse({
    caseId: formData.get("caseId"),
    receivedWatch: formData.get("receivedWatch") ?? "",
    qcPhotosMatched: formData.get("qcPhotosMatched") ?? "",
    fulfillmentIssue: formData.get("fulfillmentIssue") ?? "",
    factoryClaimNote: formData.get("factoryClaimNote") ?? "",
    consentToStore: formData.get("consentToStore") ?? undefined,
  });

  if (!parsed.success) {
    redirect("/");
  }

  const toBool = (value?: string) =>
    value === "yes" ? true : value === "no" ? false : undefined;

  await createOutcome({
    userId: session.user.id,
    caseId: parsed.data.caseId,
    receivedWatch: toBool(parsed.data.receivedWatch),
    qcPhotosMatched: toBool(parsed.data.qcPhotosMatched),
    fulfillmentIssue: parsed.data.fulfillmentIssue,
    factoryClaimNote: parsed.data.factoryClaimNote,
    consentToStore: parsed.data.consentToStore === "on",
  });

  redirect(`/reports/${parsed.data.caseId}?outcome=saved`);
}
