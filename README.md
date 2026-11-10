# The Damac Global

**Your Vision. Our Strategy. Global Success.**
Premium digital marketing and creative agency website: Building Brands Beyond Borders.

This is a complete Next.js (App Router) website with PostgreSQL via Drizzle ORM. It includes eight pages, a shared design system, a working contact form, a custom package request form, and Google Sheets storage through Apps Script.

---

## 1. Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | "Make your brand impossible to ignore." Positioning, services, process, why us, concept teaser, CTA |
| `/about` | About | "We think beyond ordinary." Introduction, vision, philosophy, values, approach, methodology, trust |
| `/services` | Services | Six services with anchors (`#digital-marketing`, `#social-media`, `#seo-growth`, `#website-development`, `#brand-identity`, `#lead-generation`) |
| `/packages` | Packages | Basic, Standard, Premium (highlighted), Custom, plus the custom package request form |
| `/portfolio` | Portfolio | Four concept projects, clearly labelled as concept work (no fabricated clients) |
| `/founder` | Founders | Hunain Faraz Memon and Mustafa Ahmed Memon |
| `/contact` | Contact | Contact enquiry form, email, WhatsApp and Instagram channels. Accepts `?service=` to pre-select a service |
| `/leadforge` | LeadForge | "Coming soon" product page. Shows an external "Visit" button only when `LEADFORGE_URL` is set |
| `/api/inquiries` | API | `POST` JSON endpoint for both forms |
| `/api/health` | Health | Returns `{ "ok": true }` when the database responds |

Other generated routes: `/sitemap.xml` (when `SITE_URL` is set), `/robots.txt`, and a branded 404 page.

---

## 2. Project structure

```
src/
  app/
    layout.tsx            Global header, footer, metadata, fonts (via globals.css)
    template.tsx          Soft page-enter transition on every navigation
    globals.css           Design system: tokens, hero system, cards, forms, motion
    page.tsx              Home
    about/ services/ packages/ portfolio/ founder/ contact/ leadforge/
    not-found.tsx         Branded 404
    api/inquiries/route.ts  Validated, rate-limited, de-duplicated inquiry endpoint
    api/health/route.ts   Database health check
    sitemap.ts, robots.ts, icon.svg
  components/
    site/Header.tsx       Sticky header, active page, accessible mobile menu
    site/Footer.tsx       Shared footer (contact channels from env)
    site/PageHero.tsx     Shared hero used by all eight pages
    site/Reveal.tsx       Scroll reveal (one observer per element, auto-disconnects)
    site/Brand.tsx        Vector brand mark and wordmark
    site/ui.tsx           Section heading and CTA band
    forms/InquiryForm.tsx Contact and custom package form (validation, loading, feedback)
    packages/PackagesExplorer.tsx  Package cards and custom form, linked by state
    portfolio/ConceptTile.tsx      Concept artwork cards
    icons.tsx, service-icons.tsx
  lib/
    content.ts            All copy: nav, services, packages, founders, concepts, budgets
    validation.ts         Shared validation (browser and server) + formula-injection guard
    site-config.ts        Server-only environment configuration
    sheets.ts             Server-only Google Apps Script forwarder
    seo.ts                Per-page metadata builder
  db/
    index.ts              Drizzle + pg connection pool
    schema.ts             inquiries table
google-apps-script/Code.gs  Web app receiver for Google Sheets
.env.example              Every environment variable, documented
```

---

## 3. Requirements

- Node.js 20.9 or newer (Next.js 16 requirement). Tested in this build with Node 22.
- PostgreSQL 14 or newer.

---

## 4. Local setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env. At minimum set DATABASE_URL.

# 3. Create the database tables (Drizzle, no migration files needed)
npx drizzle-kit push

# 4. Development server (hot reload)
npm run dev          # http://localhost:3000

# 5. Production build and start
npm run build
npm start            # http://localhost:3000 (honours PORT from .env)
```

`npm start` runs `next start` on port `3000` by default, or on `PORT` if it is set.

Note: `drizzle.config.json` contains the local development database URL. For a production database, point `dbCredentials.url` at a `DATABASE_URL` value, or run `drizzle-kit push` with the production connection string.

---

## 5. Environment variables

| Variable | Required | Where used | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | Server | PostgreSQL connection string |
| `PORT` | No | `next start` | Port, default `3000` |
| `CONTACT_EMAIL` | Recommended | Server, rendered | Company email in footer, contact page and form fallbacks. Hidden if empty |
| `WHATSAPP_NUMBER` | Optional | Server, rendered | International digits only, for example `923001234567`. Builds the `wa.me` link |
| `INSTAGRAM_URL` | Optional | Server, rendered | Instagram profile URL |
| `LEADFORGE_URL` | Optional | Server, rendered | Live LeadForge URL. Empty means "Coming soon" |
| `SITE_URL` | Recommended for production | Server | Production domain. Enables canonical URLs, absolute Open Graph URLs and the sitemap |
| `SHEETS_WEBHOOK_URL` | For Sheets storage | Server only | Apps Script Web app URL (ends in `/exec`) |
| `SHEETS_SHARED_SECRET` | For Sheets storage | Server only | Must equal `SHARED_SECRET` in the Apps Script project |

Security notes:
- Only server code reads `SHEETS_SHARED_SECRET`. The secret is sent server-to-server in the POST body and is never placed in HTML or client bundles.
- `src/lib/site-config.ts` and `src/lib/sheets.ts` are marked `server-only`, so importing them into a client component fails the build.

---

## 6. Inquiry flow and Google Sheets setup

Each form submission goes through this path:

1. **Browser validation** gives instant feedback (`src/lib/validation.ts`).
2. **`POST /api/inquiries`** re-validates everything on the server, strips control characters and enforces length limits. It also:
   - ignores bot submissions that fill the hidden honeypot field,
   - rate-limits each client to 8 submissions per 10 minutes,
   - rejects requests larger than 20 KB,
   - uses a per-submission reference so repeat clicks or retries do not create duplicate records.
3. **PostgreSQL** stores every valid enquiry in the `inquiries` table first, so no lead is lost.
4. **Google Apps Script** (if configured) receives the row and appends it to the **Inquiries** sheet. Values beginning with `= + - @` are neutralised to prevent formula injection.
5. The user sees a success message, or a clear error with an email fallback.

If Sheets is not configured, submissions are still saved to PostgreSQL and the user still sees success. The status is recorded as `not_configured` in `inquiries.sheets_status`.

### Deploy the Apps Script receiver

1. Create a Google Sheet and copy its ID from the URL.
2. Open **Extensions > Apps Script**, paste `google-apps-script/Code.gs` as `Code.gs`, and save.
3. **Project Settings > Script Properties** add:
   - `SHARED_SECRET`: a random string of at least 32 characters.
   - `SPREADSHEET_ID`: the Sheet ID (optional if the script is bound to the sheet).
4. **Deploy > New deployment > Web app.** Set *Execute as: Me* and *Who has access: Anyone*. Copy the URL.
5. Set `SHEETS_WEBHOOK_URL` to that URL and `SHEETS_SHARED_SECRET` to the same value as `SHARED_SECRET`. Restart the server.
6. Open the Web app URL in a browser. It should return `{"ok":true,...}`.

Re-deploy the Apps Script after any change to `Code.gs` (**Deploy > Manage deployments > Edit > New version**).

---

## 7. Design system and hero alignment

All pages share one set of tokens in `src/app/globals.css`:

```css
:root {
  --header-height: 88px;          /* 72px below 768px */
  --hero-top-spacing: clamp(40px, 6vw, 96px);
  --hero-bottom-spacing: clamp(64px, 8vw, 120px);
  --container: 1200px;
  --gutter: clamp(20px, 4vw, 48px);
  --section-space: clamp(72px, 9vw, 128px);
}
```

Every hero uses `PageHero` (`src/components/site/PageHero.tsx`). The top padding is always `header-height + hero-top-spacing`, so the eyebrow, heading and CTA align the same way on all eight pages. Pages differ only in composition (split with orbit visual, or centred), and the home hero is taller.

Brand colours: deep black `#050505`, charcoal `#0d0d0d`, metallic gold gradient `#f8e9c2 → #e6bd74 → #a9773a`, cream text `#f6f2e9`, muted grey `#aaa497`. Typography: **Manrope** for headings and **DM Sans** for body. Both are self-hosted through `@fontsource-variable`, so the site makes no third-party font requests.

Motion: scroll reveals, hero entrance, card hover, page transitions, and an orbit animation. All motion is disabled under `prefers-reduced-motion`. Scroll-reveal content stays visible when JavaScript is disabled.

---

## 8. Content to review before launch

These items were not in the source material, so they are placeholders or drafts:

- **Logo:** the official logo file was not in the project. The site uses a vector monogram and wordmark in `src/components/site/Brand.tsx`. Replace it with the official logo if required.
- **Contact details:** `CONTACT_EMAIL`, `WHATSAPP_NUMBER` and `INSTAGRAM_URL` are empty. Channels only appear once set.
- **Package inclusions** in `src/lib/content.ts` are draft copy. Pricing is shown as "Pricing on request" because no prices were supplied.
- **Budget ranges** in `src/lib/content.ts` are form options, not published prices.
- **Founder bios** are short introductions based only on the names and roles supplied. Replace them with approved bios and portraits.
- **Portfolio** shows concept artwork labelled as concepts. Replace it with real case studies only after clients approve publication.
- **LeadForge** remains "Coming soon" until `LEADFORGE_URL` is set.

---

## 9. Testing

See `TESTING.md` for the full validation report and the steps performed.

---

## 10. Production checklist

- [ ] Set `DATABASE_URL` to the production database and run `npx drizzle-kit push`.
- [ ] Set `SITE_URL` to the production domain.
- [ ] Set `CONTACT_EMAIL`, `WHATSAPP_NUMBER`, `INSTAGRAM_URL`.
- [ ] Deploy the Apps Script receiver and set `SHEETS_WEBHOOK_URL` and `SHEETS_SHARED_SECRET`.
- [ ] Set `LEADFORGE_URL` when LeadForge launches.
- [ ] Replace the placeholder logo, founder portraits and bios, and package inclusions.
- [ ] Run `npm run build`, then `npm start`, and check `/api/health`.
- [ ] Serve behind HTTPS (for example a reverse proxy or the hosting platform's TLS).


## Netlify deployment (Next.js runtime)

This project uses the Next.js App Router and includes server API routes. Deploy it as a Next.js site through Netlify's Git-connected build (or Netlify CLI); do not use a plain static drag-and-drop deploy of the ZIP.

1. Push the extracted project folder to a GitHub/GitLab repository.
2. In Netlify, choose **Add new site → Import an existing project** and connect that repository.
3. Netlify reads `netlify.toml` and installs `@netlify/plugin-nextjs`.
4. Set the environment variables from `.env.example` in **Site configuration → Environment variables**.
5. `DATABASE_URL` is needed for the custom package API and database-backed health route. Configure a reachable PostgreSQL database before using those features.
6. Set `SITE_URL` to the deployed HTTPS domain. Configure `SHEETS_WEBHOOK_URL` and `SHEETS_SHARED_SECRET` only if you want Google Sheets forwarding.
7. Trigger a fresh deploy and test every route, the mobile menu, and a contact form on a real phone.

The Contact page form opens a pre-filled WhatsApp chat to +92 371 4968118. The visitor must press **Send** in WhatsApp; browser websites cannot silently send WhatsApp messages. The custom package form keeps its existing `/api/inquiries` backend flow.


---

## 7. Private admin portal (new)

The admin portal is available only at `/admin`; there is no public navigation link to it.
It uses a signed, HttpOnly, SameSite=Strict session cookie. The password and signing secret
are read only on the server and are never bundled into client JavaScript.

### Required Netlify environment variables

Set these in **Site configuration → Environment variables**:

- `DATABASE_URL`: persistent PostgreSQL connection string (required for saved leads and calendar).
- `ADMIN_PASSWORD`: private password, at least 16 characters.
- `ADMIN_SESSION_SECRET`: random secret, at least 32 characters. Generate one with `openssl rand -base64 48`.
- `SITE_URL`: your production site URL.

### One-time database update

Run the included SQL file against the same PostgreSQL database used by `DATABASE_URL`:

`db-migrations/2026-11-11-admin-calendar.sql`

It adds lead status tracking and the private calendar events table. Existing enquiries are preserved.
You can run it using your database provider's SQL editor. Alternatively, after setting
`DATABASE_URL` locally, run `npx drizzle-kit push`.

### Admin features

- View saved contact and custom package leads with all submitted fields.
- Mark a lead New, Contacted, Qualified, or Closed.
- Private month calendar with event title, date, time, notes, and delete.
- Logout; session expires after 8 hours.
- Admin endpoints require the signed session cookie.

### Important form behavior

Valid forms are now saved to the PostgreSQL-backed `/api/inquiries` endpoint first.
After the server confirms the save, WhatsApp opens with the same enquiry pre-filled for
`+92 371 4968118`. The visitor must press Send in WhatsApp. If a popup is blocked,
the page displays a manual WhatsApp link. A lead is not counted as received if the database
save fails.


## Enquiry submission update
Contact and custom package forms now save directly to PostgreSQL and show an on-page success confirmation. They do not redirect to WhatsApp. The private admin dashboard refreshes its data every 10 seconds while open.
