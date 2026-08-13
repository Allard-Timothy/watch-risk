import type { Metadata } from "next";

import { CaseForm } from "@/components/case-form";

export const metadata: Metadata = {
  title: "New case | WatchTell",
  description:
    "Record a luxury watch listing to start a photo-based buyer-risk review.",
};

export default function NewCasePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Case intake
        </p>
        <h1 className="font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          Start a buyer-risk case
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Add what the listing states about the watch. Only the brand is
          required now; the more detail you provide, the more useful the
          photo-based buyer-risk review will be.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <CaseForm />
      </section>
    </main>
  );
}
