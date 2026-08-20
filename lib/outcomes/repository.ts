import { getDbClient } from "@/lib/db";

export type OutcomeInput = Readonly<{
  userId: string;
  caseId: string;
  receivedWatch?: boolean;
  qcPhotosMatched?: boolean;
  fulfillmentIssue?: string;
  factoryClaimNote?: string;
  consentToStore?: boolean;
}>;

export async function createOutcome(input: OutcomeInput) {
  const db = getDbClient();
  return db.outcome.create({
    data: {
      userId: input.userId,
      caseId: input.caseId,
      receivedWatch: input.receivedWatch,
      qcPhotosMatched: input.qcPhotosMatched,
      fulfillmentIssue: input.fulfillmentIssue?.trim() || undefined,
      factoryClaimNote: input.factoryClaimNote?.trim() || undefined,
      consentToStore: input.consentToStore ?? true,
    },
  });
}

export async function listOutcomesForCase(caseId: string) {
  const db = getDbClient();
  return db.outcome.findMany({
    where: { caseId },
    orderBy: { createdAt: "desc" },
  });
}

export function formatOutcomeEvidence(outcome: {
  receivedWatch: boolean | null;
  qcPhotosMatched: boolean | null;
  fulfillmentIssue: string | null;
  factoryClaimNote: string | null;
}): string {
  const parts: string[] = [];
  if (outcome.receivedWatch != null) {
    parts.push(
      outcome.receivedWatch
        ? "Buyer reported receiving the watch."
        : "Buyer reported not receiving the watch.",
    );
  }
  if (outcome.qcPhotosMatched != null) {
    parts.push(
      outcome.qcPhotosMatched
        ? "QC photos matched the listing."
        : "QC photos did not match the listing.",
    );
  }
  if (outcome.fulfillmentIssue) {
    parts.push(`Fulfillment note: ${outcome.fulfillmentIssue}`);
  }
  if (outcome.factoryClaimNote) {
    parts.push(`Factory claim note: ${outcome.factoryClaimNote}`);
  }
  return parts.join(" ");
}
