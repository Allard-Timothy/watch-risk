import type { Metadata } from "next";
import Link from "next/link";

import { PhotoUpload } from "@/components/photo-upload";

export const metadata: Metadata = {
  title: "Case photos | WatchTell",
  description:
    "Add listing photos and label the photo type. Files stay in the browser.",
};

export default function DraftPhotosPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Evidence
        </p>
        <h1 className="font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          Add listing photos
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Label each shot so the review can tell what is present and what is
          missing. This step does not upload files to cloud storage.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <PhotoUpload />
      </section>

      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/cases/draft" className="font-medium text-foreground underline-offset-2 hover:underline">
          Back to case
        </Link>
      </p>
    </main>
  );
}
