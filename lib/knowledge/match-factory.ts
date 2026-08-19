import type { FactorySeed } from "./schemas";

function normalizeFactoryKey(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Resolve a dossier/listing factory label to a curated factory seed.
 * Matches factoryId or canonicalName; "VSF" and "vsf" are the same row.
 */
export function matchFactory(
  factories: readonly FactorySeed[],
  label?: string,
): FactorySeed | undefined {
  if (!label?.trim()) {
    return factories.find((factory) => factory.factoryId === "unknown");
  }
  const needle = normalizeFactoryKey(label);
  return (
    factories.find((factory) => normalizeFactoryKey(factory.factoryId) === needle) ??
    factories.find(
      (factory) => normalizeFactoryKey(factory.canonicalName) === needle,
    ) ??
    factories.find((factory) => factory.factoryId === "unknown")
  );
}
