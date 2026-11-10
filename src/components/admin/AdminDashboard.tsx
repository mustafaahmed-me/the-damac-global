"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: number; kind: string; name: string; email: string; phone: string | null;
  services: string; budget: string | null; packageChoice: string | null;
  message: string; status: string; createdAt: string;
};
type EventItem = { id: number; title: string; startsAt: string; notes: string | null };
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function dateKey(value: string | Date) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function prettyDate(value: string) {
  const date = new Date(value);
  const day = date.toLocaleDateString(undefined, { weekday: "long" });
  const formatted = date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  return `${day}, ${formatted}`;
}

function csvCell(value: unknown) {
  let text = value == null ? "" : String(value);
  // Prevent spreadsheet formula execution for values entered by website visitors.
  if (/^[=+@\\-\\t\\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(dateKey(new Date()));
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(dateKey(new Date()));
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const [leadResponse, eventResponse] = await Promise.all([
        fetch("/api/admin/leads", { cache: "no-store" }),
        fetch("/api/admin/events", { cache: "no-store" }),
      ]);
      if (leadResponse.status === 401 || eventResponse.status === 401) { router.refresh(); return; }
      if (!leadResponse.ok) throw new Error("Could not load leads. Check DATABASE_URL and that the inquiries table exists.");
      const leadData = await leadResponse.json();
      setLeads(leadData.leads ?? []);
      if (eventResponse.ok) {
        const eventData = await eventResponse.json();
        setEvents(eventData.events ?? []);
      } else {
        setError("Leads loaded. Calendar is unavailable until its database table is created.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load dashboard.");
    } finally { if (!silent) setLoading(false); }
  }, [router]);

  useEffect(() => {
    void load();
    const refreshId = window.setInterval(() => { void load(true); }, 10000);
    return () => window.clearInterval(refreshId);
  }, [load]);

 
function downloadLeadsExcel() {
  const headers = [
    "Lead ID",
    "Enquiry Type",
    "Full Name",
    "Email",
    "Phone",
    "Service(s)",
    "Budget",
    "Package",
    "Message",
    "Lead Status",
    "Date Received",
    "Day Received",
    "Time Received",
  ];

  const escapeCell = (value: unknown) => {
    const text = Array.isArray(value)
      ? value.join(", ")
      : String(value ?? "");

    return `"${text.replace(/"/g, '""')}"`;
  };

  const rows = leads.map((lead) => {
    const received = new Date(lead.createdAt);

    return [
      lead.id,
      lead.kind === "custom_package" ? "Custom Package" : "Contact Enquiry",
      lead.name,
      lead.email,
      lead.phone,
      lead.services,
      lead.budget,
      lead.packageChoice,
      lead.message,
      lead.status || "new",
      received.toLocaleDateString(),
      received.toLocaleDateString(undefined, { weekday: "long" }),
      received.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    ];
  });

  const csv =
    "\uFEFF" +
    [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `The-Damac-Global-Leads-${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function updateStatus(id: number, status: string) {
    const response = await fetch("/api/admin/leads", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) setError("Lead status could not be updated.");
    else setLeads((old) => old.map((lead) => lead.id === id ? { ...lead, status } : lead));
  }

  async function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const startsAt = new Date(`${date}T${time}:00`).toISOString();
    const response = await fetch("/api/admin/events", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, startsAt, notes }),
    });
    const data = await response.json();
    if (!response.ok) { setError(data.message || "Could not add event."); return; }
    setEvents((old) => [...old, data.event].sort((a,b) => +new Date(a.startsAt)-+new Date(b.startsAt)));
    setTitle(""); setNotes("");
  }

  async function removeEvent(id: number) {
    const response = await fetch("/api/admin/events", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) setEvents((old) => old.filter((event) => event.id !== id));
  }

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i); return d;
    });
  }, [month]);
  const selectedEvents = events.filter((event) => dateKey(event.startsAt) === selectedDay);
  const monthEvents = events.filter((event) => {
    const d = new Date(event.startsAt); return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
  });

  return (
    <main className="admin-shell">
      <div className="admin-wrap">
        <header className="admin-topbar">
          <div><p className="eyebrow">Private workspace</p><h1 className="admin-heading">The Damac Global <span>Admin</span></h1></div>
          <button className="btn btn-ghost" onClick={logout}>Log out</button>
        </header>
        {error && <p className="form-status form-status--error mb-5">{error}</p>}
        <section className="admin-stats">
          <article className="admin-stat"><span>Total leads</span><strong>{leads.length}</strong></article>
          <article className="admin-stat"><span>New leads</span><strong>{leads.filter((x) => x.status === "new").length}</strong></article>
          <article className="admin-stat"><span>Calendar events</span><strong>{events.length}</strong></article>
        </section>

        <section className="admin-section">
          <div className="admin-section-head"><div><p className="eyebrow">Appointments & follow-ups</p><h2>Private calendar</h2></div></div>
          <div className="admin-calendar-layout">
            <div className="admin-calendar panel">
              <div className="admin-month-head">
                <button className="btn btn-ghost admin-small-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()-1, 1))} aria-label="Previous month">‹</button>
                <strong>{monthNames[month.getMonth()]} {month.getFullYear()}</strong>
                <button className="btn btn-ghost admin-small-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()+1, 1))} aria-label="Next month">›</button>
              </div>
              <div className="admin-calendar-grid">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <span className="admin-weekday" key={d}>{d}</span>)}
                {days.map((d) => {
                  const key = dateKey(d); const hasEvent = events.some((e) => dateKey(e.startsAt) === key);
                  return <button key={key} onClick={() => { setSelectedDay(key); setDate(key); }} className={`admin-day${d.getMonth() !== month.getMonth() ? " is-outside" : ""}${key === selectedDay ? " is-selected" : ""}${hasEvent ? " has-event" : ""}`}>{d.getDate()}<i /></button>;
                })}
              </div>
              <p className="admin-muted mt-4">{monthEvents.length} event(s) this month</p>
            </div>
            <div className="admin-event-panel panel">
              <p className="eyebrow">Add to calendar</p>
              <form className="grid gap-3" onSubmit={addEvent}>
                <label className="field"><span className="field-label">Event title</span><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={140} placeholder="Client call / follow-up" /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="field"><span className="field-label">Date</span><input className="input" type="date" value={date} onChange={(e) => { setDate(e.target.value); setSelectedDay(e.target.value); }} required /></label>
                  <label className="field"><span className="field-label">Time</span><input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} required /></label>
                </div>
                <label className="field"><span className="field-label">Notes</span><textarea className="input" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={2000} placeholder="Optional notes" /></label>
                <button className="btn btn-gold">Save calendar event</button>
              </form>
              <div className="admin-event-list"><h3>Selected day</h3>{selectedEvents.length ? selectedEvents.map((e) => <div className="admin-event" key={e.id}><div><strong>{e.title}</strong><span>{prettyDate(e.startsAt)}</span>{e.notes && <p>{e.notes}</p>}</div><button onClick={() => removeEvent(e.id)} aria-label={`Delete ${e.title}`}>×</button></div>) : <p className="admin-muted">No events for this date.</p>}</div>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-head"><div><p className="eyebrow">Incoming enquiries</p><h2>Leads <span>({leads.length})</span></h2></div><div className="flex flex-wrap gap-2"><button className="btn btn-ghost" onClick={() => void load()}>Refresh leads</button><button className="btn btn-gold" onClick={downloadLeadsExcel} disabled={leads.length === 0}>Download Excel Sheet</button></div></div>
          {loading ? <p className="admin-muted">Loading leads…</p> : leads.length === 0 ? <div className="panel"><p className="admin-muted">No saved enquiries yet. New Contact and Custom Package submissions will appear here.</p></div> : (
            <div className="admin-leads">{leads.map((lead) => <article className="admin-lead panel" key={lead.id}>
              <div className="admin-lead-head"><div><span className="admin-kind">{lead.kind === "custom_package" ? "Custom package" : "Contact enquiry"}</span><h3>{lead.name}</h3><p>{prettyDate(lead.createdAt)}</p></div>
                <select className="input admin-status" aria-label={`Status for ${lead.name}`} value={lead.status || "new"} onChange={(e) => updateStatus(lead.id, e.target.value)}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="closed">Closed</option></select>
              </div>
              <div className="admin-lead-details">
                <p><b>Email</b><a href={`mailto:${lead.email}`}>{lead.email}</a></p>
                <p><b>Phone</b>{lead.phone || "Not provided"}</p>
                <p><b>Service(s)</b>{lead.services}</p>
                <p><b>Budget</b>{lead.budget || "Not specified"}</p>
                {lead.packageChoice && <p><b>Package</b>{lead.packageChoice}</p>}
                <p className="admin-message"><b>Message</b><span>{lead.message}</span></p>
              </div>
              {lead.phone && <a className="admin-whatsapp" href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer">Open WhatsApp conversation ↗</a>}
            </article>)}</div>
          )}
        </section>
        <footer className="admin-foot">Private admin workspace · The Damac Global</footer>
      </div>
    </main>
  );
}
