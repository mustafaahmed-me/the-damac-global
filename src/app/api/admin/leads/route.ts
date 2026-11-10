import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(500);
    return NextResponse.json({ ok: true, leads: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[admin/leads] database query failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, message: "Could not read leads. Verify the database tables and DATABASE_URL." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const body = await request.json();
    const id = Number(body?.id);
    const status = String(body?.status ?? "");
    if (!Number.isInteger(id) || id < 1 || !["new", "contacted", "qualified", "closed"].includes(status)) {
      return NextResponse.json({ ok: false, message: "Invalid lead update." }, { status: 400 });
    }
    await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to update lead." }, { status: 400 });
  }
}
