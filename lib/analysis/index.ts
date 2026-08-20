import type { ReportContext, ReportInput } from "@/lib/reports/generate-report";
import { generateReport, type GeneratedReport } from "@/lib/reports/generate-report";

export type AnalysisProvider = Readonly<{
  name: "deterministic" | "openai";
  configured: boolean;
  analyze(
    input: ReportInput,
    context?: ReportContext,
  ): Promise<GeneratedReport> | GeneratedReport;
}>;

export function createDeterministicAnalysisProvider(): AnalysisProvider {
  return {
    name: "deterministic",
    configured: true,
    analyze(input, context = {}) {
      return generateReport(input, context);
    },
  };
}

export class OpenAiNotConfiguredError extends Error {
  constructor(message = "OpenAI analysis is not configured.") {
    super(message);
    this.name = "OpenAiNotConfiguredError";
  }
}

function createOpenAiAnalysisProvider(): AnalysisProvider {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return {
      name: "openai",
      configured: false,
      analyze() {
        throw new OpenAiNotConfiguredError();
      },
    };
  }
  return {
    name: "openai",
    configured: false,
    analyze() {
      throw new OpenAiNotConfiguredError(
        "OpenAI vision is not wired yet. Using deterministic rules.",
      );
    },
  };
}

export function getAnalysisProvider(): AnalysisProvider {
  if (process.env.OPENAI_API_KEY?.trim()) {
    return createOpenAiAnalysisProvider();
  }
  return createDeterministicAnalysisProvider();
}
