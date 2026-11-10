import { NextResponse } from "next/server";
import { createAdminToken, passwordMatches, ADMIN_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, number[]>();
function blocked(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < 15 * 60 * 1000);
  if (recent.length >= 10) { attempts.set(key, recent); return true; }
  recent.push(now); attempts.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (blocked(key)) return NextResponse.json({ ok: false, message: "Too many attempts. Try again later." }, { status: 429 });
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ ok: false, message: "Unsupported request format." }, { status: 415 });
    }
    const raw = await request.text();
    if (raw.length > 2048) return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 413 });
    const body = JSON.parse(raw);
    const password = typeof body?.password === "string" ? body.password : "";
    if (!passwordMatches(password)) {
      return NextResponse.json({ ok: false, message: "Invalid admin password." }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, createAdminToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to sign in." }, { status: 400 });
  }
}
