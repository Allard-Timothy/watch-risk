import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import {
  communityCompareCaseSchema,
  communitySeedSchema,
  factorySeedSchema,
  modelDossierSeedSchema,
  sellerSeedSchema,
  type CommunityCompareCase,
  type CommunitySeed,
  type FactorySeed,
  type ModelDossierSeed,
  type SellerSeed,
} from "./schemas";
import { assertFactorySeed, upsertCommunity, upsertFactory, upsertSeller } from "./persist";

const KNOWLEDGE_ROOT = path.join(process.cwd(), "data", "knowledge");

async function readJsonFile(filePath: string): Promise<unknown> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as unknown;
}

export async function loadCommunities(): Promise<CommunitySeed[]> {
  const payload = await readJsonFile(
    path.join(KNOWLEDGE_ROOT, "communities.json"),
  );
  return zArray(communitySeedSchema).parse(payload);
}

export async function loadSellers(): Promise<SellerSeed[]> {
  const dir = path.join(KNOWLEDGE_ROOT, "sellers");
  const files = (await readdir(dir)).filter((name) => name.endsWith(".json"));
  const sellers: SellerSeed[] = [];
  for (const file of files.sort()) {
    const payload = await readJsonFile(path.join(dir, file));
    sellers.push(sellerSeedSchema.parse(payload));
  }
  return sellers;
}

export async function loadCompareCases(): Promise<CommunityCompareCase[]> {
  const dir = path.join(KNOWLEDGE_ROOT, "compare");
  const files = (await readdir(dir)).filter((name) => name.endsWith(".json"));
  const cases: CommunityCompareCase[] = [];
  for (const file of files.sort()) {
    const payload = await readJsonFile(path.join(dir, file));
    cases.push(communityCompareCaseSchema.parse(payload));
  }
  return cases;
}

export async function loadModelDossiers(): Promise<ModelDossierSeed[]> {
  const dir = path.join(KNOWLEDGE_ROOT, "references");
  const files = (await readdir(dir)).filter((name) => name.endsWith(".json"));
  const dossiers: ModelDossierSeed[] = [];
  for (const file of files.sort()) {
    const payload = await readJsonFile(path.join(dir, file));
    dossiers.push(modelDossierSeedSchema.parse(payload));
  }
  return dossiers;
}

export async function loadFactories(): Promise<FactorySeed[]> {
  const dir = path.join(KNOWLEDGE_ROOT, "factories");
  const files = (await readdir(dir)).filter((name) => name.endsWith(".json"));
  const factories: FactorySeed[] = [];
  for (const file of files.sort()) {
    const payload = await readJsonFile(path.join(dir, file));
    factories.push(assertFactorySeed(factorySeedSchema.parse(payload)));
  }
  return factories;
}

export async function seedKnowledge(): Promise<{
  communities: number;
  sellers: number;
  factories: number;
}> {
  const communities = await loadCommunities();
  for (const community of communities) {
    await upsertCommunity(community);
  }
  const sellers = await loadSellers();
  for (const seller of sellers) {
    await upsertSeller(seller);
  }
  const factories = await loadFactories();
  for (const factory of factories) {
    await upsertFactory(factory);
  }
  return {
    communities: communities.length,
    sellers: sellers.length,
    factories: factories.length,
  };
}

function zArray<T>(schema: { parse: (value: unknown) => T }): {
  parse: (value: unknown) => T[];
} {
  return {
    parse(value: unknown) {
      if (!Array.isArray(value)) {
        throw new Error("Expected a JSON array");
      }
      return value.map((item) => schema.parse(item));
    },
  };
}
