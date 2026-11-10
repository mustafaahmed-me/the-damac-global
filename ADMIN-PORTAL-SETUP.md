# Private admin portal setup

## Features
- Private `/admin` login, not linked in the public navigation.
- Signed HttpOnly admin session cookie (8-hour expiry).
- Leads list with submitted contact/package details and lead status management.
- Private monthly calendar with add/delete events.
- Contact and custom package forms save directly to PostgreSQL; no WhatsApp redirect is used.

## Required deployment configuration
Set these Netlify environment variables:
- `DATABASE_URL`: persistent PostgreSQL connection string.
- `ADMIN_PASSWORD`: a unique password of at least 16 characters.
- `ADMIN_SESSION_SECRET`: random secret of at least 32 characters.
- `SITE_URL`: deployed website URL.

Never add these values to client code, GitHub commits, or `NEXT_PUBLIC_` variables.

## Database update (must be run before using the portal)
Run `db-migrations/2026-11-11-admin-calendar.sql` once against the same PostgreSQL database configured in `DATABASE_URL`. This preserves existing enquiries and adds lead statuses plus calendar events.

You can alternatively run `npm run db:push` after setting `DATABASE_URL` in your local environment.

## Admin address
After deployment, open `https://YOUR-DOMAIN/admin` and sign in with the password stored in Netlify environment variables.

The public header and footer do not show an admin link. Admin APIs reject requests without a valid signed session cookie.

## Lead submission behavior
Every valid Contact and Custom Package form POSTs to `/api/inquiries`. The form shows success only after PostgreSQL confirms the record was saved. No WhatsApp redirect is used.

## Export leads
Use **Download Excel Sheet** in the Leads section to export all loaded enquiries. The file opens in Microsoft Excel and includes the lead's received date, weekday and time along with all submitted details. Press **Refresh leads** before downloading to fetch the latest enquiries.


## Enquiry submission update
Contact and custom package forms save directly to PostgreSQL and show success only after a confirmed save. No WhatsApp redirect is used. The private admin dashboard refreshes its data every 10 seconds while open.
