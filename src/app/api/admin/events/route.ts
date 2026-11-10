import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { adminEvents } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false }, { status: 401 });
  const events = await db.select().from(adminEvents).orderBy(asc(adminEvents.startsAt)).limit(500);
  return NextResponse.json({ ok: true, events }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const body = await request.json();
    const title = typeof body?.title === "string" ? body.title.trim().slice(0, 140) : "";
    const startsAt = new Date(body?.startsAt);
    const notes = typeof body?.notes === "string" ? body.notes.trim().slice(0, 2000) : "";
    if (!title || Number.isNaN(startsAt.getTime())) return NextResponse.json({ ok: false, message: "Enter a title and valid date/time." }, { status: 400 });
    const [event] = await db.insert(adminEvents).values({ title, startsAt, notes: notes || null }).returning();
    return NextResponse.json({ ok: true, event });
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to save calendar event." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const body = await request.json();
    const id = Number(body?.id);
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ ok: false }, { status: 400 });
    await db.delete(adminEvents).where(eq(adminEvents.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to delete event." }, { status: 400 });
  }
}
