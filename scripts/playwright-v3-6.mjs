import { chromium } from "playwright";
import { mkdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const URL = process.env.URL || "http://localhost:3100";
const OUT = "/tmp/paradeyes-v3-6";
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
  { label: "T0_6s-fog-only", ms: 600 },
  { label: "T1_5s-fog-plus-eye", ms: 1500 },
  { label: "T3s-eye-visible", ms: 3000 },
  { label: "T7s-rotating", ms: 7000 },
  { label: "T15s-rotating-cycle", ms: 15000 },
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

    const centerOk =
      eyeBounds !== null && Math.abs(eyeBounds.offsetFromCenter) < 2;
    const noScroll = !scrollInfo.canScrollY;
    const ok = centerOk && noScroll && consoleErrors.length === 0;
    if (!ok) failures += 1;

    results.push({
      breakpoint: bp.name,
      viewport: `${bp.width}x${bp.height}`,
      noScroll,
      centerOk,
      eyeBounds,
      consoleErrors,
      ok,
    });

    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log("\n=== Paradeyes v3.6 Playwright Results ===");
for (const r of results) {
  console.log(`\n[${r.ok ? "PASS" : "FAIL"}] ${r.breakpoint} (${r.viewport})`);
  console.log(`  noScroll: ${r.noScroll}`);
  console.log(`  centerOk: ${r.centerOk}`);
  if (r.eyeBounds) {
    console.log(
      `  eye w=${r.eyeBounds.width.toFixed(1)} h=${r.eyeBounds.height.toFixed(1)} offsetFromCenter=${r.eyeBounds.offsetFromCenter.toFixed(2)}px`,
    );
  }
  if (r.consoleErrors.length) {
    console.log(`  consoleErrors: ${r.consoleErrors.length}`);
    r.consoleErrors.slice(0, 3).forEach((e) => console.log(`    - ${e}`));
  }
}
console.log(
  `\nTotal: ${results.length} breakpoints | ${failures === 0 ? "ALL PASS" : `${failures} FAILED`}`,
);
console.log(`Screenshots: ${OUT}`);
process.exit(failures === 0 ? 0 : 1);
