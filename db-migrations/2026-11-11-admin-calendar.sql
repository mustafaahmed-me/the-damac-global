-- Run once against the same PostgreSQL database configured as DATABASE_URL.
ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS status varchar(24) NOT NULL DEFAULT 'new';

CREATE TABLE IF NOT EXISTS admin_events (
  id serial PRIMARY KEY,
  title varchar(140) NOT NULL,
  starts_at timestamptz NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_events_starts_at_idx ON admin_events (starts_at);
