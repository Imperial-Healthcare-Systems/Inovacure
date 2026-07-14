// Prototype visual baseline: key views @1440 and @390, full-page.
// Runs with the ylem project's playwright install via NODE_PATH.
import { chromium } from "playwright";

const BASE = "http://localhost:3001";
const OUT = process.env.OUT_DIR;
const views = [
  { name: "home", setup: null },
  { name: "catalog", setup: "go('catalog')" },
  { name: "about", setup: "go('about')" },
  { name: "contact", setup: "go('contact')" },
];

const browser = await chromium.launch();
for (const vw of [{ w: 1440, tag: "1440" }, { w: 390, tag: "390" }]) {
  const page = await browser.newPage({ viewport: { width: vw.w, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForFunction(() => typeof window.go === "function");
  for (const v of views) {
    if (v.setup) { await page.evaluate(v.setup); await page.waitForTimeout(400); }
    // force reveals to their end-state so full-page capture is honest
    await page.evaluate(() => {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${v.name}-${vw.tag}.png`, fullPage: true });
    console.log(`shot ${v.name}@${vw.tag}`);
  }
  await page.close();
}
await browser.close();
