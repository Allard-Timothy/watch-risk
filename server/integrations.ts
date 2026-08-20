export type IntegrationName = "database" | "storage" | "payments" | "analysis";

export type IntegrationStatus = Readonly<{
  name: IntegrationName;
  configured: boolean;
  message: string;
}>;

import { getAnalysisProvider } from "@/lib/analysis";
import { getPaymentProvider } from "@/lib/payments";
import { getStorageProvider } from "@/lib/storage";

export function getIntegrationStatus(name: IntegrationName): IntegrationStatus {
  switch (name) {
    case "database": {
      const url = process.env.DATABASE_URL?.trim();
      return {
        name,
        configured: Boolean(url),
        message: url
          ? "Postgres datasource is configured."
          : "DATABASE_URL is not set.",
      };
    }
    case "storage": {
      const storage = getStorageProvider();
      return {
        name,
        configured: storage.configured,
        message:
          storage.name === "local"
            ? "Local disk storage is active (.data/uploads)."
            : "GCS bucket is set but the client is not wired yet.",
      };
    }
    case "payments": {
      const payments = getPaymentProvider();
      return {
        name,
        configured: payments.configured,
        message:
          payments.name === "mock"
            ? "Mock checkout is active (PAYMENTS_MODE=mock)."
            : payments.configured
              ? "Stripe is configured."
              : "Stripe secret is missing; mock checkout is unavailable.",
      };
    }
    case "analysis": {
      const analysis = getAnalysisProvider();
      return {
        name,
        configured: analysis.configured,
        message:
          analysis.name === "deterministic"
            ? "Deterministic rules engine is active."
            : analysis.configured
              ? "OpenAI analysis is configured."
              : "OpenAI key is set but the vision adapter is not wired yet.",
      };
    }
  }
}

/** @deprecated Use getIntegrationStatus */
export function getPlaceholderIntegrationStatus(
  name: IntegrationName,
): IntegrationStatus {
  return getIntegrationStatus(name);
}
