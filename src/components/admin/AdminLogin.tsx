"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Login failed.");
      setPassword("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-shell">
      <section className="admin-login panel">
        <p className="eyebrow">Private workspace</p>
        <h1 className="section-title">The Damac Global Admin</h1>
        <p className="admin-muted">This private area is not linked from the public website.</p>
        <form onSubmit={submit} className="grid gap-4 mt-7">
          <label className="field">
            <span className="field-label">Admin password</span>
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={16} />
          </label>
          {error && <p className="form-status form-status--error">{error}</p>}
          <button className="btn btn-gold" disabled={busy}>{busy ? "Signing in…" : "Sign in to admin"}</button>
        </form>
      </section>
    </main>
  );
}
