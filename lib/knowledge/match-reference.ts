import type { ModelDossierSeed } from "./schemas";

export function normalizeReference(value: string): string {
  return value.trim().toLowerCase().replace(/[\s.\-_]/g, "");
}

/**
 * Match a listing reference to a curated model dossier.
 * Dots, spaces, and hyphens are ignored so 310.30.42.50.01.001 matches.
 */
export function matchModelDossier(
  dossiers: readonly ModelDossierSeed[],
  brand?: string,
  reference?: string,
): ModelDossierSeed | undefined {
  if (!reference?.trim()) {
    return undefined;
  }
  const needle = normalizeReference(reference);
  const matches = dossiers.filter(
    (dossier) => normalizeReference(dossier.reference) === needle,
  );
  if (matches.length === 0) {
    return undefined;
  }
  if (brand?.trim()) {
    const brandNeedle = brand.trim().toLowerCase();
    const branded = matches.find(
      (dossier) => dossier.brand.toLowerCase() === brandNeedle,
    );
    if (branded) {
      return branded;
    }
  }
  return matches[0];
}
