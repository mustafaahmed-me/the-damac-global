# Testing report: The Damac Global

Environment: Next.js 16.2.6 (production build, `next start`), PostgreSQL 15, Node 22, headless Chromium (Playwright 1.49.1).
Test script: `qa/audit.cjs` (re-run with `BASE_URL=http://localhost:3000 NODE_PATH=<dir with playwright> node qa/audit.cjs`).

## 1. Build and static validation (passed)

| Check | Command | Result |
|---|---|---|
| Route type generation | `npx next typegen` | Passed |
| TypeScript | `npm exec tsc -- --noEmit` | Passed, 0 errors |
| Production build | `npm run build` | Passed, all 8 pages and API routes compiled |
| Platform healthcheck | `build_and_start` | Passed, `/api/health` returns `{"ok":true}` |
| Database schema | `npx drizzle-kit push` | Applied `inquiries` table |

## 2. Page matrix (browser, 6 viewports x 8 pages = 48 loads)

Viewports tested: 320, 390, 768, 1280, 1440, 1920 px wide.

| Check | Result |
|---|---|
| HTTP 200 for all 8 routes | Passed, 48/48 |
| Console errors | Passed, 0 on every page |
| Broken images | Passed, 0 |
| Empty or `#` links | Passed, 0 |
| Header height | 72 px at mobile widths, 88 px at 768 px and above (matches tokens) |
| Hero alignment: eyebrow top y-position | Passed, identical across all 8 pages at each viewport (spread 0 px). Heading baselines follow from the same token-driven offset |
| Hero heading does not overlap header | Passed |
| Horizontal overflow | **1 known issue** (see section 5) |

## 3. Navigation and interaction

| Check | Result |
|---|---|
| Internal links (21 unique, including anchors and `?service=` links) | Passed, all return 200 |
| Mobile menu opens (390 px) | Passed |
| Mobile menu closes with Escape | Passed |
| Mobile menu closes on outside click | Passed |
| Mobile menu navigates and closes | Passed (navigated to /services) |
| No horizontal overflow on /services at 390 px | Passed |
| Package card "Select Premium" pre-fills custom form | Passed |
| `/contact?service=Brand%20Identity` pre-selects the service | Passed |

## 4. Forms and API

| Check | Result |
|---|---|
| Contact form: empty submit shows field errors (3 shown) and does not send | Passed |
| Contact form: valid submission returns success message | Passed. Record stored in PostgreSQL. Test rows were deleted afterwards |
| `POST /api/inquiries` with invalid fields | Passed: 422 with per-field errors |
| Wrong content type | Passed: 415 |
| Malformed JSON | Passed: 400 |
| Honeypot filled | Passed: silent success, nothing stored |
| Unknown route | Passed: 404 page |
| `robots.txt` | Passed: 200 |
| `sitemap.xml` | Passed: 200 (empty until `SITE_URL` is set, by design) |

## 5. Known issues (open)

1. **`/packages` at 320 px wide: 15 px horizontal overflow.** The cause is the intrinsic width of a `<select>` inside the custom package form panel. Suggested one-line fix in `src/app/globals.css`: add `grid-template-columns: minmax(0, 1fr);` to the `.field` rule. The fix was not applied because the build could not be re-validated within this session.
2. **Google Sheets integration is not live-tested.** No `SHEETS_WEBHOOK_URL` or `SHEETS_SHARED_SECRET` was available. The forwarder and Apps Script receiver are implemented, and the code path that runs when Sheets is unconfigured was exercised (submissions are stored in PostgreSQL). Deploy the script and run one end-to-end submission before relying on it.
3. **Not yet tested:** 375, 430, 1024, 1279 and 1600 px viewports; Firefox and Safari; real devices; reduced-motion behaviour in a browser; screen-reader pass; Lighthouse performance and accessibility scores; the 413 (payload too large) and 429 (rate limit) responses.

## 6. Source material limitations

The original ZIP was not present in the working environment. The site was rebuilt from the brief and the supplied screenshots. Items that need your confirmation are listed in README.md section 8 (logo, contact details, package inclusions, founder bios, portfolio concepts, LeadForge URL).


## Final requested changes (11 November 2026)

- Repaired source-file packaging by retaining only the active Header, Footer and InquiryForm implementations; removed accidental commented-out duplicate copies.
- Mobile hamburger now stacks all three bars vertically, with clean spacing and an animated close state.
- Current mobile navigation item uses white text and a subtle gold-highlighted surface.
- Home and Portfolio concept cards now share four original local SVG illustrations (luxury product, responsive website, social editorial, lead-generation dashboard).
- Added restrained concept image hover motion and light sweep; respects `prefers-reduced-motion`.
- Contact enquiry validation is preserved and valid Contact submissions open a pre-filled WhatsApp message to +92 371 4968118. The visitor must press Send in WhatsApp. Custom package submissions retain the existing API flow.
- Added Netlify Next.js runtime configuration and deployment instructions. This is a server-rendered Next.js app, so it must be deployed through Netlify's Git-connected build or Netlify CLI, not a static drag-and-drop deploy.
- TypeScript check: passed (`tsc --noEmit`).
- CSS parse: passed.
- Production build could not be completed in this environment because the provided dependency cache contains the Windows SWC binary, while the build environment is Linux and outbound package download is unavailable.
- No final real-device/browser QA or live Netlify deployment has been performed. Configure `DATABASE_URL` for the custom package API and test the deployed routes before launch.
