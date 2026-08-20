import type { SendMagicLinkInput } from "./types";

export type { SendMagicLinkInput };

/**
 * Send a magic-link email. In development the URL is logged to the console.
 * Production can swap in Resend/SMTP when configured.
 */
export async function sendMagicLink(input: SendMagicLinkInput): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER ?? "console";
  if (provider === "console" || process.env.NODE_ENV !== "production") {
    console.info(
      `[WatchTell magic link] To: ${input.to}\nSign in: ${input.url}\n`,
    );
    return;
  }
  throw new Error(
    "Email provider is not configured. Set EMAIL_PROVIDER or use development mode.",
  );
}
