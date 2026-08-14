import type { CaseCreateInput } from "@/lib/validation";

const STORAGE_KEY = "watchtell-draft-case";

export function saveDraftCase(input: CaseCreateInput): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(input));
}

export function loadDraftCase(): CaseCreateInput | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as CaseCreateInput;
  } catch {
    return null;
  }
}
