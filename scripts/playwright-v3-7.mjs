import { chromium } from "playwright";
import { mkdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const URL = process.env.URL || "http://localhost:3100";
const OUT = "/tmp/paradeyes-v3-7";
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const breakpoints = [
  { name: "iphone-se", width: 375, height: 667 },
  { name: "iphone-14-pro", width: 390, height: 844 },
  { name: "iphone-14-pro-max", width: 430, height: 932 },
  { name: "ipad-mini", width: 768, height: 1024 },
  { name: "ipad-pro", width: 1024, height: 1366 },
  { name: "desktop", width: 1440, height: 900 },
];

const SNAPSHOTS = [
  { label: "T1_5s-fog-plus-eye", ms: 1500 },
  { label: "T7s-rotating", ms: 7000 },
];

const results = [];
let failures = 0;

const browser = await chromium.launch();
try {
  for (const bp of breakpoints) {
    const ctx = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      deviceScaleFactor: 2,
      reducedMotion: "no-preference",
    });
    const page = await ctx.newPage();

    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(`PAGEERROR: ${err.message}`);
    });

    const navStart = Date.now();
    await page.goto(URL, { waitUntil: "networkidle" });

    for (const snap of SNAPSHOTS) {
      const elapsed = Date.now() - navStart;
      const waitMs = Math.max(0, snap.ms - elapsed);
      if (waitMs > 0) await page.waitForTimeout(waitMs);
      await page.screenshot({
        path: join(OUT, `${bp.name}_${snap.label}.png`),
        fullPage: false,
      });
    }

    const scrollInfo = await page.evaluate(() => ({
      canScrollY:
        document.documentElement.scrollHeight >
        document.documentElement.clientHeight,
    }));

    const eyeBounds = await page.evaluate(() => {
      const wrapper = document.querySelector('[data-testid="eye-wrapper"]');
      if (!wrapper) return null;
      const rect = wrapper.getBoundingClientRect();
      const vw = window.innerWidth;
      const wrapperCenterX = rect.left + rect.width / 2;
      const viewportCenterX = vw / 2;
      return {
        width: rect.width,
        height: rect.height,
        offsetFromCenter: wrapperCenterX - viewportCenterX,
      };
    });

    const seoHead = await page.evaluate(() => {
      const q = (sel) => document.querySelector(sel);
      const getCount = (sel) => document.querySelectorAll(sel).length;
      const h1 = q("h1");
      const jsonLdNodes = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      );
      const jsonLdParsed = jsonLdNodes.map((n) => {
        try {
          const obj = JSON.parse(n.textContent || "");
          return obj["@type"];
        } catch {
          return "PARSE_ERROR";
        }
      });
      return {
        title: document.title,
        description:
          q('meta[name="description"]')?.getAttribute("content") || null,
        ogTitle:
          q('meta[property="og:title"]')?.getAttribute("content") || null,
        ogImage:
          q('meta[property="og:image"]')?.getAttribute("content") || null,
        twitterCard:
          q('meta[name="twitter:card"]')?.getAttribute("content") || null,
        canonical: q('link[rel="canonical"]')?.getAttribute("href") || null,
        manifest: q('link[rel="manifest"]')?.getAttribute("href") || null,
        themeColor:
          q('meta[name="theme-color"]')?.getAttribute("content") || null,
        iconLinkCount: getCount('link[rel="icon"]'),
        appleTouch:
          q('link[rel="apple-touch-icon"]')?.getAttribute("href") || null,
        htmlLang: document.documentElement.getAttribute("lang"),
        h1Text: h1?.textContent?.trim() || null,
        jsonLdTypes: jsonLdParsed,
      };
    });

    const centerOk =
      eyeBounds !== null && Math.abs(eyeBounds.offsetFromCenter) < 2;
    const noScroll = !scrollInfo.canScrollY;

    const seoChecks = {
      titleOk: !!seoHead.title && seoHead.title.includes("Paradeyes"),
      descriptionOk:
        !!seoHead.description && seoHead.description.length >= 100,
      ogTitleOk: !!seoHead.ogTitle,
      ogImageOk:
        !!seoHead.ogImage &&
        (seoHead.ogImage.includes("og-image") ||
          seoHead.ogImage.includes("opengraph")),
      twitterOk: seoHead.twitterCard === "summary_large_image",
      canonicalOk: seoHead.canonical === "https://paradeyesagency.com",
      manifestOk: seoHead.manifest === "/manifest.json",
      themeColorOk: seoHead.themeColor === "#023236",
      iconsOk: seoHead.iconLinkCount >= 4,
      appleTouchOk: seoHead.appleTouch === "/apple-touch-icon.png",
      langOk: seoHead.htmlLang === "fr",
      h1Ok:
        !!seoHead.h1Text &&
        seoHead.h1Text.includes("On") &&
        seoHead.h1Text.includes("conçoit"),
      jsonLdOk:
        seoHead.jsonLdTypes.length === 3 &&
        seoHead.jsonLdTypes.includes("Organization") &&
        seoHead.jsonLdTypes.includes("WebSite") &&
        seoHead.jsonLdTypes.includes("ProfessionalService"),
    };

    const seoAllOk = Object.values(seoChecks).every(Boolean);

    const ok =
      centerOk && noScroll && consoleErrors.length === 0 && seoAllOk;
    if (!ok) failures += 1;

    results.push({
      breakpoint: bp.name,
      viewport: `${bp.width}x${bp.height}`,
      noScroll,
      centerOk,
      eyeBounds,
      seoChecks,
      seoHead,
      consoleErrors,
      ok,
    });

    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log("\n=== Paradeyes v3.7 Playwright Results ===");
for (const r of results) {
  console.log(`\n[${r.ok ? "PASS" : "FAIL"}] ${r.breakpoint} (${r.viewport})`);
  console.log(`  noScroll: ${r.noScroll}`);
  console.log(`  centerOk: ${r.centerOk}`);
  if (r.eyeBounds) {
    console.log(
      `  eye w=${r.eyeBounds.width.toFixed(1)} h=${r.eyeBounds.height.toFixed(1)} offset=${r.eyeBounds.offsetFromCenter.toFixed(2)}px`,
    );
  }
  const failedSeo = Object.entries(r.seoChecks)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  console.log(`  SEO: ${failedSeo.length === 0 ? "ALL PASS" : `FAIL: ${failedSeo.join(", ")}`}`);
  if (r.consoleErrors.length) {
    console.log(`  consoleErrors: ${r.consoleErrors.length}`);
    r.consoleErrors.slice(0, 3).forEach((e) => console.log(`    - ${e}`));
  }
}

const firstSeo = results[0]?.seoHead;
if (firstSeo) {
  console.log("\n=== SEO Head Snapshot (desktop bp) ===");
  console.log(`  title: ${firstSeo.title}`);
  console.log(`  htmlLang: ${firstSeo.htmlLang}`);
  console.log(`  canonical: ${firstSeo.canonical}`);
  console.log(`  iconLinks: ${firstSeo.iconLinkCount}`);
  console.log(`  appleTouch: ${firstSeo.appleTouch}`);
  console.log(`  manifest: ${firstSeo.manifest}`);
  console.log(`  themeColor: ${firstSeo.themeColor}`);
  console.log(`  jsonLdTypes: ${firstSeo.jsonLdTypes.join(", ")}`);
  console.log(`  h1: ${firstSeo.h1Text}`);
}

console.log(
  `\nTotal: ${results.length} breakpoints | ${failures === 0 ? "ALL PASS" : `${failures} FAILED`}`,
);
console.log(`Screenshots: ${OUT}`);
process.exit(failures === 0 ? 0 : 1);
