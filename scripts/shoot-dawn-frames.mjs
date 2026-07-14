// Capture the dawn build-up as a 4-frame strip (viewport-only, 1440x900).
import { chromium } from "playwright";

const OUT = process.argv[2];
const URL = "http://localhost:3001/preview/home/section/hero";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: "networkidle" });
// reload so we catch the timeline from the start
await page.reload({ waitUntil: "commit" });
const t0 = Date.now();
for (const ms of [250, 900, 1800, 3400]) {
  const wait = ms - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${OUT}/beat-01-dawn-${ms}ms.png` });
  console.log(`frame @${ms}ms`);
}
await browser.close();
