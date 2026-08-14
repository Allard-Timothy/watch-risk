"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { saveDraftCase } from "@/lib/cases/draft-store";
import { caseCreateFormSchema, type CaseCreateInput } from "@/lib/validation";

type FieldName = keyof CaseCreateInput;

type FieldConfig = Readonly<{
  name: FieldName;
  label: string;
  required?: boolean;
  full?: boolean;
  textarea?: boolean;
  type?: "text" | "url" | "number";
  inputMode?: "text" | "decimal" | "url";
  placeholder?: string;
  hint?: string;
}>;

const FIELDS: readonly FieldConfig[] = [
  { name: "brand", label: "Brand", required: true, placeholder: "Rolex, Omega, Tudor" },
  { name: "model", label: "Model", placeholder: "Submariner, Speedmaster" },
  { name: "reference", label: "Reference", placeholder: "126610LN" },
  { name: "claimedYear", label: "Claimed year", placeholder: "2021" },
  {
    name: "askingPrice",
    label: "Asking price",
    type: "number",
    inputMode: "decimal",
    placeholder: "12500",
    hint: "USD",
  },
  { name: "sellerPlatform", label: "Seller platform", placeholder: "Chrono24, eBay, forum sale" },
  {
    name: "listingUrl",
    label: "Listing URL",
    type: "url",
    inputMode: "url",
    full: true,
    placeholder: "https://",
  },
  {
    name: "listingText",
    label: "Listing text",
    textarea: true,
    full: true,
    placeholder: "Paste the listing description exactly as written.",
  },
  {
    name: "sellerClaims",
    label: "Seller claims",
    textarea: true,
    full: true,
    placeholder: "What the seller states about condition, service history, box, and papers.",
  },
] as const;

const FIELD_LABELS: Record<FieldName, string> = FIELDS.reduce(
  (acc, field) => ({ ...acc, [field.name]: field.label }),
  {} as Record<FieldName, string>,
);

type FieldErrors = Partial<Record<FieldName, string>>;

function formatValue(name: FieldName, value: string | number): string {
  if (name === "askingPrice" && typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return String(value);
}

const inputClasses =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25";

export function CaseForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CaseCreateInput | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Drop empty optional fields so they stay undefined (and never coerce to
    // 0). Required fields are always forwarded so their own validation message
    // is used when left blank.
    const raw: Record<string, string> = {};
    for (const field of FIELDS) {
      const value = String(formData.get(field.name) ?? "").trim();
      if (value || field.required) {
        raw[field.name] = value;
      }
    }

    const parsed = caseCreateFormSchema.safeParse(raw);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldName | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    // Placeholder submit handler. Listing details are kept in sessionStorage
    // for the draft case page; nothing is written to the database.
    saveDraftCase(parsed.data as CaseCreateInput);
    setResult(parsed.data as CaseCreateInput);
    setSubmitting(false);
  }

  function handleReset() {
    setResult(null);
    setErrors({});
  }

  if (result) {
    return <CaseIntakeConfirmation values={result} onReset={handleReset} />;
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const error = errors[field.name];
          const describedBy = error ? `${field.name}-error` : undefined;

          return (
            <div
              key={field.name}
              className={cn("flex flex-col", field.full && "sm:col-span-2")}
            >
              <label
                htmlFor={field.name}
                className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-foreground"
              >
                <span>
                  {field.label}
                  {field.required ? (
                    <span className="text-accent" aria-hidden="true">
                      {" "}
                      *
                    </span>
                  ) : null}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {field.required ? "Required" : field.hint ?? "Optional"}
                </span>
              </label>

              {field.textarea ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  placeholder={field.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  className={cn(inputClasses, "resize-y")}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type ?? "text"}
                  inputMode={field.inputMode}
                  placeholder={field.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  className={inputClasses}
                />
              )}

              {error ? (
                <p
                  id={describedBy}
                  className="mt-1.5 text-xs font-medium text-red-700"
                >
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Nothing is submitted for analysis yet. This step only records the
          listing details for review.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
        >
          {submitting ? "Saving case" : "Save case"}
        </button>
      </div>
    </form>
  );
}

type CaseIntakeConfirmationProps = Readonly<{
  values: CaseCreateInput;
  onReset: () => void;
}>;

function CaseIntakeConfirmation({ values, onReset }: CaseIntakeConfirmationProps) {
  const entries = FIELDS.map((field) => ({
    name: field.name,
    label: FIELD_LABELS[field.name],
    value: values[field.name],
  })).filter((entry) => entry.value !== undefined && entry.value !== "");

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/10 p-4">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent text-sm font-semibold text-background"
        >
          &#10003;
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Case details recorded
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            The listing details below are captured in this browser for review.
            Photo upload, payment, and report generation are separate later steps.
          </p>
        </div>
      </div>

      <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {entries.map((entry) => (
          <div
            key={entry.name}
            className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
          >
            <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
              {entry.label}
            </dt>
            <dd className="whitespace-pre-wrap break-words text-sm text-foreground">
              {formatValue(entry.name, entry.value as string | number)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/cases/draft"
          className="inline-flex items-center justify-center rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-sm transition hover:opacity-90"
        >
          Review case
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          Start another case
        </button>
      </div>
    </div>
  );
}
