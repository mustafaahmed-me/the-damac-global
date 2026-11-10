/* eslint-disable */
// Browser audit for The Damac Global. Run with:
//   BASE_URL=http://localhost:3000 NODE_PATH=<dir containing playwright> node qa/audit.cjs
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const PAGES = ["/", "/about", "/services", "/packages", "/portfolio", "/founder", "/contact", "/leadforge"];
const VIEWPORTS = [
  { name: "320", width: 320, height: 700 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const failures = [];
const rows = [];
const fail = (msg) => failures.push(msg);

async function measure(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const header = document.querySelector(".site-header");
    const eyebrow = document.querySelector(".hero .eyebrow");
    const h1 = document.querySelector("h1");
    const top = (el) => (el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null);
    const brokenImages = [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length;
    const overflowing = [...document.querySelectorAll("main *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > window.innerWidth + 1 && getComputedStyle(el).position !== "fixed";
      })
      .slice(0, 3)
      .map((el) => el.className && el.className.baseVal === undefined ? el.tagName + "." + String(el.className).slice(0, 40) : el.tagName);
    return {
      overflowX: doc.scrollWidth - doc.clientWidth,
      headerH: header ? Math.round(header.getBoundingClientRect().height) : null,
      eyebrowTop: top(eyebrow),
      h1Top: top(h1),
      h1Font: h1 ? getComputedStyle(h1).fontSize : null,
      brokenImages,
      overflowing,
      emptyLinks: [...document.querySelectorAll("a")].filter((a) => !a.getAttribute("href") || a.getAttribute("href") === "#").length,
      hrefs: [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")))],
    };
  });
}

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const internalHrefs = new Set();

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
    for (const path of PAGES) {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text());
      });
      page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));

      const response = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
      const status = response ? response.status() : 0;
      const m = await measure(page);
      rows.push({ vp: vp.name, path, status, ...m, consoleErrors: consoleErrors.length });

      if (status !== 200) fail(`${path} @${vp.name}: HTTP ${status}`);
      if (m.overflowX > 0) fail(`${path} @${vp.name}: horizontal overflow ${m.overflowX}px (${m.overflowing.join(", ")})`);
      if (m.brokenImages > 0) fail(`${path} @${vp.name}: ${m.brokenImages} broken images`);
      if (m.emptyLinks > 0) fail(`${path} @${vp.name}: ${m.emptyLinks} empty links`);
      if (consoleErrors.length > 0) fail(`${path} @${vp.name}: console errors ${consoleErrors.slice(0, 2).join(" | ")}`);
      if (m.headerH !== null && m.h1Top !== null && m.h1Top < m.headerH) fail(`${path} @${vp.name}: h1 overlaps header`);
      m.hrefs.forEach((h) => h.startsWith("/") && internalHrefs.add(h));
      await page.close();
    }
    await context.close();
  }

  // Hero alignment: eyebrow must start at the same y on every page for a viewport.
  for (const vp of VIEWPORTS) {
    const eyebrows = rows.filter((r) => r.vp === vp.name).map((r) => r.eyebrowTop);
    const spread = Math.max(...eyebrows) - Math.min(...eyebrows);
    // Home hero is taller but has the same top offset; the check is on the eyebrow top.
    if (spread > 2) fail(`hero eyebrow spread ${spread}px @${vp.name}`);
  }

  // Internal link check.
  const linkStatus = {};
  const ctx = await browser.newContext();
  const req = ctx.request;
  for (const href of internalHrefs) {
    const [pathOnly] = href.split("#");
    if (!pathOnly) continue;
    const res = await req.get(BASE + pathOnly.split("?")[0]);
    linkStatus[href] = res.status();
    if (res.status() !== 200) fail(`internal link ${href} -> ${res.status()}`);
  }

  // Mobile menu behaviour at 390px.
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mctx.newPage();
  await mp.goto(BASE + "/", { waitUntil: "networkidle" });
  const menuChecks = {};
  await mp.click(".menu-toggle");
  menuChecks.openedByToggle = await mp.getAttribute(".menu-toggle", "aria-expanded");
  menuChecks.panelOpen = await mp.evaluate(() => document.querySelector(".mobile-panel").classList.contains("is-open"));
  await mp.keyboard.press("Escape");
  await mp.waitForTimeout(400);
  menuChecks.closedByEscape = (await mp.getAttribute(".menu-toggle", "aria-expanded")) === "false";
  await mp.click(".menu-toggle");
  await mp.waitForTimeout(300);
  await mp.mouse.click(10, 800);
  await mp.waitForTimeout(400);
  menuChecks.closedByOutside = (await mp.getAttribute(".menu-toggle", "aria-expanded")) === "false";
  await mp.click(".menu-toggle");
  await mp.waitForTimeout(300);
  await mp.click('.mobile-panel a[href="/services"]');
  await mp.waitForURL("**/services", { timeout: 15000 });
  menuChecks.navigatedAndClosed = (await mp.getAttribute(".menu-toggle", "aria-expanded")) === "false";
  const mobileOverflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  menuChecks.noOverflowOnServices = mobileOverflow === 0;
  for (const [k, v] of Object.entries(menuChecks)) {
    if (k === "openedByToggle") { if (v !== "true") fail("mobile menu did not open"); continue; }
    if (v !== true && k !== "panelOpen") fail(`mobile menu check failed: ${k}`);
  }
  await mctx.close();

  // Contact form: validation then a real submission.
  const cctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const cp = await cctx.newPage();
  await cp.goto(BASE + "/contact?service=Brand%20Identity", { waitUntil: "networkidle" });
  const preselected = await cp.$eval('select[name="service"]', (el) => el.value);
  await cp.click('button[type="submit"]');
  const errorCount = await cp.$$eval(".field-error", (els) => els.length);
  await cp.fill('input[name="name"]', "QA Tester");
  await cp.fill('input[name="email"]', "qa.tester@example.com");
  await cp.fill('textarea[name="message"]', "Automated QA submission to verify the contact flow end to end.");
  await cp.click('button[type="submit"]');
  await cp.waitForSelector(".form-status--success, .form-status--error", { timeout: 20000 });
  const formStatus = await cp.$eval(".form-status", (el) => ({ cls: el.className, text: el.textContent.slice(0, 120) }));
  const contactForm = { preselected, validationErrorsShown: errorCount, result: formStatus.cls.includes("success") ? "success" : "error", text: formStatus.text };
  if (preselected !== "Brand Identity") fail("contact ?service= preselect failed");
  if (errorCount < 3) fail("contact validation did not show errors");
  if (!formStatus.cls.includes("success")) fail(`contact submission failed: ${formStatus.text}`);
  await cctx.close();

  // Packages: select a card, confirm the custom form is pre-filled.
  const pctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pp = await pctx.newPage();
  await pp.goto(BASE + "/packages", { waitUntil: "networkidle" });
  await pp.click('button:has-text("Select Premium")');
  const pkgPrefill = await pp.$eval('select[name="packageChoice"]', (el) => el.value);
  if (pkgPrefill !== "Premium") fail("package selection did not pre-fill custom form");
  await pctx.close();

  await browser.close();

  console.log("=== PAGE MATRIX (viewport, path, status, overflowX, headerH, eyebrowTop, h1Top, h1Font, consoleErrors, brokenImages) ===");
  for (const r of rows) {
    console.log([r.vp, r.path, r.status, r.overflowX, r.headerH, r.eyebrowTop, r.h1Top, r.h1Font, r.consoleErrors, r.brokenImages].join(" | "));
  }
  console.log("=== INTERNAL LINKS ===");
  console.log(JSON.stringify(linkStatus));
  console.log("=== MOBILE MENU ===");
  console.log(JSON.stringify(menuChecks));
  console.log("=== FORMS ===");
  console.log(JSON.stringify(contactForm));
  console.log("=== PACKAGE SELECTION PREFILL ===", pkgPrefill);
  console.log("=== FAILURES (" + failures.length + ") ===");
  failures.forEach((f) => console.log(" - " + f));
  process.exitCode = failures.length ? 1 : 0;
})().catch((e) => {
  console.error("AUDIT CRASHED", e);
  process.exit(2);
});
