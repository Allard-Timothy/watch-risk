import type { FactorySeed } from "./schemas";

export function factoryVariancesForDisplay(factory: FactorySeed) {
  return factory.knownVariances?.length
    ? factory.knownVariances
    : factory.defects ?? [];
}
