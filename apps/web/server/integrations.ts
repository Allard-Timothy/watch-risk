export type IntegrationName = "database" | "storage" | "payments" | "analysis";

export type IntegrationStatus = Readonly<{
  name: IntegrationName;
  configured: false;
  message: string;
}>;

export function getPlaceholderIntegrationStatus(
  name: IntegrationName,
): IntegrationStatus {
  return {
    name,
    configured: false,
    message: `${name} is intentionally not configured in the initial scaffold.`,
  };
}
