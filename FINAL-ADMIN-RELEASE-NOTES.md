The Damac Global - Private Admin Update

Implemented:
- Private /admin portal with server-side signed HttpOnly session authentication.
- Admin password and session signing secret are environment-only; no credentials are committed.
- Lead inbox reads PostgreSQL enquiries and shows all form details.
- Lead workflow statuses: New, Contacted, Qualified, Closed.
- Private monthly calendar: create and delete events with date, time and notes.
- Contact and Custom Package forms save directly to the PostgreSQL admin inbox. No WhatsApp redirect is used.
- Homepage globe uses a warmer metallic gold treatment.
- Homepage Agency Process numbers use compact gold step markers instead of the wide rectangular bar.
- Admin is absent from public navigation and excluded in robots.txt.

Before production:
1. Set DATABASE_URL, ADMIN_PASSWORD (16+ characters), ADMIN_SESSION_SECRET (32+ random characters), and SITE_URL in Netlify environment variables.
2. Run db-migrations/2026-11-11-admin-calendar.sql against the production PostgreSQL database.
3. Deploy to Netlify and test /admin login, a test contact form submission, lead visibility, calendar add/delete, and logout.

Verification:
- TypeScript parser check reported no syntax diagnostics after correcting robots.ts. Full typecheck/build could not be completed because dependency installation did not finish in this environment.
- ZIP integrity will be checked separately after packaging.
- Do not treat this as production-certified until the required database migration, environment configuration and Netlify deployment checks are complete.

- Admin leads page includes a Download Excel Sheet button. It exports all currently loaded leads into an Excel-compatible UTF-8 CSV with full lead details plus received date, weekday and time. Refresh leads before exporting to include the newest submissions.


## Enquiry submission update
Contact and custom package forms save directly to PostgreSQL and show success only after a confirmed save. No WhatsApp redirect is used. The private admin dashboard refreshes its data every 10 seconds while open.
