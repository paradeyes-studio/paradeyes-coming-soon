import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "test-results/v3-9-5";
mkdirSync(OUT, { recursive: true });

const BREAKPOINTS = [
  { name: "iphone-se", width: 375, height: 667 },
  { name: "iphone-14-pro", width: 390, height: 844 },
  { name: "iphone-14-pro-max", width: 430, height: 932 },
  { name: "ipad-mini", width: 768, height: 1024 },
  { name: "ipad-pro", width: 1024, height: 1366 },
  { name: "desktop", width: 1440, height: 900 },
];

const SHOTS = [3000, 7000, 15000, 25000];
const URL = "http://localhost:3000";

const browser = await chromium.launch();
const results = [];

for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({
    viewport: { width: bp.width, height: bp.height },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto(URL, { waitUntil: "networkidle" });

  const start = Date.now();
  for (const t of SHOTS) {
    const delay = t - (Date.now() - start);
    if (delay > 0) await page.waitForTimeout(delay);
    await page.screenshot({
      path: join(OUT, `${bp.name}-t${t}.png`),
      fullPage: false,
    });
  }

  const scrollH = await page.evaluate(() => document.body.scrollHeight);
  const clientH = await page.evaluate(() => document.documentElement.clientHeight);
  const hasScroll = scrollH > clientH + 2;

  results.push({
    breakpoint: bp.name,
    size: `${bp.width}x${bp.height}`,
    scrollH,
    clientH,
    hasScroll,
    errors,
  });

  await ctx.close();
}

await browser.close();

console.log("\n=== v3.9.5 Specular Polish Test Results ===\n");
for (const r of results) {
  console.log(
    `[${r.breakpoint.padEnd(18)}] ${r.size.padEnd(10)} scroll=${
      r.hasScroll ? "YES " : "no  "
    } (${r.clientH}/${r.scrollH}) errors=${r.errors.length}`
  );
  if (r.errors.length) {
    r.errors.slice(0, 3).forEach((e) => console.log(`  ! ${e.slice(0, 140)}`));
  }
}

const anyScroll = results.some((r) => r.hasScroll);
const anyErr = results.some((r) => r.errors.length > 0);
console.log(
  `\n${anyScroll || anyErr ? "FAIL" : "PASS"} — scroll=${anyScroll} errors=${anyErr}`
);
process.exit(anyScroll || anyErr ? 1 : 0);
