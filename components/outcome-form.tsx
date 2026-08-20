import { Card, CardTitle } from "@/components/dashboard-main";
import { submitOutcomeAction } from "@/lib/outcomes/actions";

export function OutcomeForm({ caseId }: { caseId: string }) {
  return (
    <Card id="outcome" className="scroll-mt-24">
      <CardTitle>Post-purchase outcome (optional)</CardTitle>
      <p className="mb-4 text-[13px] leading-6 text-muted-foreground">
        Outcomes are stored as WatchTell user evidence with provenance. They do
        not automatically rewrite curated seller or factory dossiers.
      </p>
      <form action={submitOutcomeAction} className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="caseId" value={caseId} />
        <label className="text-[13px]">
          Did you receive the watch?
          <select
            name="receivedWatch"
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2"
            defaultValue=""
          >
            <option value="">Prefer not to say</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className="text-[13px]">
          Did QC photos match the listing?
          <select
            name="qcPhotosMatched"
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2"
            defaultValue=""
          >
            <option value="">Prefer not to say</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className="text-[13px] md:col-span-2">
          Fulfillment issue (optional)
          <textarea
            name="fulfillmentIssue"
            rows={2}
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="text-[13px] md:col-span-2">
          Factory claim note (still a claim)
          <textarea
            name="factoryClaimNote"
            rows={2}
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-[13px] md:col-span-2">
          <input type="checkbox" name="consentToStore" defaultChecked />
          Store this outcome as provenance-tagged evidence
        </label>
        <button
          type="submit"
          className="w-fit rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
        >
          Submit outcome
        </button>
      </form>
    </Card>
  );
}
