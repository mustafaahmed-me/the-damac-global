import { eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { forwardToSheets } from "@/lib/sheets";
import {
  cleanMultiline,
  cleanText,
  LIMITS,
  validateInquiry,
  type InquiryInput,
  type InquiryKind,
} from "@/lib/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 8;
const SUBMISSION_ID_RE = /^[a-zA-Z0-9-]{16,64}$/;

const rateBuckets = new Map<string, number[]>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "anonymous";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (rateBuckets.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_REQUESTS) {
    rateBuckets.set(key, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(key, recent);

  if (rateBuckets.size > 5000) {
    for (const [k, times] of rateBuckets) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) rateBuckets.delete(k);
    }
  }
  return false;
}

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

const SUCCESS_MESSAGE_CONTACT =
  "Thank you. Your enquiry has been received and we will be in touch within two working days.";
const SUCCESS_MESSAGE_CUSTOM =
  "Thank you. Your custom package request has been received. We will review your goals and reply within two working days.";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, message: "Unsupported request format." }, 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, message: "Your request is too large. Please shorten your message." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, message: "We could not read your request. Please try again." }, 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  const b = body as Record<string, unknown>;

  // Do not silently return success for a client-side honeypot value:
  // browsers and password managers can autofill hidden "website" fields.
  // The form no longer sends a honeypot; rate limiting and validation remain active.

  const kind: InquiryKind | null =
    b.kind === "contact" ? "contact" : b.kind === "custom_package" ? "custom_package" : null;
  if (!kind) {
    return json({ ok: false, message: "Invalid request type." }, 400);
  }

  const submissionId = typeof b.submissionId === "string" ? b.submissionId.trim() : "";
  if (!SUBMISSION_ID_RE.test(submissionId)) {
    return json({ ok: false, message: "Invalid submission reference. Please refresh and try again." }, 400);
  }

  const rawServices = Array.isArray(b.services)
    ? b.services
    : typeof b.service === "string"
      ? [b.service]
      : [];
  const services = rawServices
    .filter((s): s is string => typeof s === "string")
    .map((s) => cleanText(s, 80))
    .filter(Boolean)
    .slice(0, 10);

  const input: InquiryInput & { services: string[] } = {
    kind,
    submissionId,
    name: cleanText(b.name, LIMITS.name.max),
    email: cleanText(b.email, LIMITS.email.max),
    phone: cleanText(b.phone, LIMITS.phone.max),
    services,
    budget: cleanText(b.budget, 64),
    packageChoice: cleanText(b.packageChoice, 32),
    message: cleanMultiline(b.message, LIMITS.customMessage.max),
  };

  if (kind === "contact") {
    input.services = services.slice(0, 1);
    input.packageChoice = "";
    input.message = input.message.slice(0, LIMITS.contactMessage.max);
  }

  const errors = validateInquiry(input);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, message: "Please check the highlighted fields.", errors }, 422);
  }

  if (isRateLimited(clientKey(request))) {
    return json(
      { ok: false, message: "Too many submissions from this connection. Please wait a few minutes and try again." },
      429,
    );
  }

  const receivedAt = new Date().toISOString();
  let recordId: number | null = null;
  let stored = true;

  try {
    const rows = await db
      .insert(inquiries)
      .values({
        submissionId: input.submissionId,
        kind: input.kind,
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        services: input.services.join(", "),
        budget: input.budget || null,
        packageChoice: input.packageChoice || null,
        message: input.message,
        sheetsStatus: "pending",
      })
      .onConflictDoNothing({ target: inquiries.submissionId })
      .returning({ id: inquiries.id });

    if (rows.length === 0) {
      // Same submission reference already processed: a repeat click or retry.
      return json({
        ok: true,
        duplicate: true,
        message: kind === "contact" ? SUCCESS_MESSAGE_CONTACT : SUCCESS_MESSAGE_CUSTOM,
      });
    }
    recordId = rows[0].id;
  } catch (error) {
    stored = false;
    console.error("[inquiries] database insert failed", error instanceof Error ? error.message : error);
  }

  const sheets = await forwardToSheets(input, { recordId, receivedAt });

  if (recordId !== null) {
    try {
      await db.update(inquiries).set({ sheetsStatus: sheets }).where(eq(inquiries.id, recordId));
    } catch (error) {
      console.error("[inquiries] could not update sheets status", error instanceof Error ? error.message : error);
    }
  }

  if (!stored) {
    return json(
      {
        ok: false,
        message:
          "We could not save your enquiry to our secure admin inbox right now. Please try again in a moment or contact us directly by email.",
      },
      503,
    );
  }

  return json({
    ok: true,
    stored,
    forwarded: sheets === "forwarded",
    message: kind === "contact" ? SUCCESS_MESSAGE_CONTACT : SUCCESS_MESSAGE_CUSTOM,
  });
}

export function GET() {
  return json({ ok: false, message: "Method not allowed." }, 405);
}
