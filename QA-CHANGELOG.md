# The Damac Global — Enhancement & QA Notes

## Changes applied
- Centralized the official contact channels in `src/lib/site-config.ts` so all server-rendered pages use the requested email, phone, WhatsApp and Instagram destinations consistently.
- Added a direct `tel:` phone link to the global footer, contact page channel list and homepage contact shortcuts.
- Updated `.env.example` with the official public contact values while keeping private database and Google Sheets secrets blank.
- Refined the shared hero vertical spacing and aligned the homepage hero content to the same top baseline as the other page heroes.
- Added a restrained premium polish layer for card and panel surfaces, buttons, navigation, header-on-scroll, contact pills and responsive spacing.
- Kept reduced-motion support and existing page structure, forms, package explorer, routes and backend integrations intact.
- Added a small accessible inline phone icon; no third-party animation dependency was introduced.

## Verification status
- Source archive inspected and all eight routes/components were present: Home, About, Services, Packages, Portfolio, Founder, Contact and LeadForge.
- Official contact values and URL destinations were checked in the source.
- Automated build, TypeScript, browser and end-to-end tests could not be executed in this environment because dependency installation did not complete before the execution timeout. No claim is made that runtime QA passed.
- The project includes `qa/audit.cjs` for a full browser matrix. After installing dependencies and configuring the required environment, run `npm run typecheck`, `npm run lint`, `npm run build`, then run the browser audit with Playwright as documented in `TESTING.md`.

## Operational note
Google Sheets and PostgreSQL remain environment-configured integrations. Their secrets were not added to the archive and their live connectivity was not tested.


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
