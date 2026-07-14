// Per-beat screenshot: node scripts/shoot-beat.mjs <urlPath> <name> <outDir>
// e.g. node scripts/shoot-beat.mjs /preview/home/section/hero beat-01-hero ../project/working/P/home/screens
// Captures @1440 and @390 full-page; calls window.__forceReveal (runtime hook)
// so scroll/load animations sit at end-state — honest full-page shots.
import { chromium } from "playwright";

const [urlPath, name, outDir] = process.argv.slice(2);
if (!urlPath || !name || !outDir) {
  console.error("usage: shoot-beat.mjs <urlPath> <name> <outDir>");
  process.exit(1);
}
const BASE = "http://localhost:3001";

const browser = await chromium.launch();
for (const vw of [{ w: 1440, tag: "1440" }, { w: 390, tag: "390" }]) {
  const page = await browser.newPage({ viewport: { width: vw.w, height: 900 } });
  await page.goto(BASE + urlPath, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    window.__forceReveal?.();
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/${name}-${vw.tag}.png`, fullPage: true });
  console.log(`shot ${name}@${vw.tag}`);
  await page.close();
}
await browser.close();
