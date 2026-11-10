# Lead inbox fix handoff

## Changes in this update
- Removed the hidden `website` honeypot input from the inquiry form. Some browsers/password managers can autofill hidden fields; the API previously returned a fake success (`stored: false`) when that happened, which could explain a success message with zero admin leads.
- Removed the API's silent-success honeypot branch. Enquiries now proceed through validation, rate limiting, and the PostgreSQL insert.
- The form only displays success when the API confirms success and does not report `stored: false`.
- Updated Drizzle CLI configuration to load `.env.local` (and `.env` as fallback), matching Next.js local environment setup.
- Updated admin setup/release notes to reflect direct database submission without WhatsApp redirection.
- Kept the existing admin polling interval (10 seconds), calendar, lead status updates, and CSV/Excel-compatible export.

## Required local setup
1. Keep your own `.env.local` in the project root. It is intentionally not included in this ZIP.
2. Ensure it contains `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.
3. Run `npm install`.
4. Run `npm run db:push` if the database schema has not already been pushed.
5. Run `npm run typecheck`, `npm run lint`, and `npm run build`.
6. Run `npm run dev`, submit a new test enquiry, and verify it appears in `/admin`.

## Verification note
This package was inspected and patched, but a full dependency install/build could not be completed in this environment. Treat the local commands above as required verification before deploying.
