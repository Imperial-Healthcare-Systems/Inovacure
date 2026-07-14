import { chromium } from "playwright";
const COMPS = "/media/gg/Crucial ssd1/ITI Projects/Inovacure/project/working/V/comps";
const browser = await chromium.launch();
for (const comp of ["home-C","catalog","product","exports"]) {
  for (const vw of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width: vw, height: 900 } });
    await page.goto(`file://${COMPS}/${comp}.html`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${COMPS}/screens/${comp}-${vw}.png`, fullPage: true });
    console.log(`${comp}@${vw}`);
    await page.close();
  }
}
await browser.close();
