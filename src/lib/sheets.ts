// Server-only: forwards validated inquiries to the Google Apps Script web app.
// The shared secret is read from the environment and sent only server-to-server.

import "server-only";
import { neutralizeFormula, type InquiryInput } from "@/lib/validation";

export type SheetsResult = "forwarded" | "not_configured" | "failed";

const TIMEOUT_MS = 12_000;

export async function forwardToSheets(
  input: InquiryInput & { services: string[] },
  meta: { recordId: number | null; receivedAt: string },
): Promise<SheetsResult> {
  const url = process.env.SHEETS_WEBHOOK_URL?.trim();
  const secret = process.env.SHEETS_SHARED_SECRET?.trim();

  if (!url || !secret) {
    return "not_configured";
  }

  const row = {
    receivedAt: meta.receivedAt,
    recordId: meta.recordId ?? "",
    submissionId: input.submissionId,
    kind: input.kind,
    name: neutralizeFormula(input.name),
    email: neutralizeFormula(input.email),
    phone: neutralizeFormula(input.phone),
    services: neutralizeFormula(input.services.join(", ")),
    budget: neutralizeFormula(input.budget),
    packageChoice: neutralizeFormula(input.packageChoice),
    message: neutralizeFormula(input.message),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, row }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const text = await response.text();
    let payload: { ok?: boolean; error?: string } | null = null;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }

    if (response.ok && payload?.ok === true) {
      return "forwarded";
    }

    console.error("[sheets] webhook rejected request", {
      status: response.status,
      error: payload?.error ?? "non-JSON response",
    });
    return "failed";
  } catch (error) {
    console.error("[sheets] webhook request failed", error instanceof Error ? error.message : error);
    return "failed";
  }
}
