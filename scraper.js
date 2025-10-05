import { chromium } from "playwright";
import 'dotenv/config';

async function loginIfNeeded(page) {
  try {
    await page.goto("https://www.tradingview.com", { waitUntil: "domcontentloaded" });
    await page.click('text=Sign in', { timeout: 5000 }).catch(() => {});
    await page.click('text=Email', { timeout: 4000 }).catch(() => {});
    await page.fill('input[name="username"]', process.env.TV_EMAIL);
    await page.fill('input[name="password"]', process.env.TV_PASSWORD);
    await page.click('button[type="submit"]').catch(() => {});
    await page.waitForTimeout(5000);
  } catch (err) {
    console.log("⚠️ Login flow issue. Continuing anyway.");
  }
}

export async function scrapeScreener(url, type = "stock") {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  console.log(`🌐 Scraper: opening ${url}`);
  await loginIfNeeded(page);

  await page.goto(url, { waitUntil: "domcontentloaded" });
  try {
    await page.waitForSelector("table tbody tr", { timeout: 10000 });
  } catch (err) {
    console.log("⚠️ Table rows not found quickly; continuing.");
  }

  const rows = await page.$$eval("table tbody tr", (trs) => {
    const out = [];
    for (let i = 0; i < trs.length && out.length < 10; i++) {
      const tds = Array.from(trs[i].querySelectorAll("td")).map(td => td.innerText.trim());
      out.push({
        symbol: tds[0] ?? "",
        volume: tds[1] ?? "",
        rvol: tds[2] ?? "",
        float: tds[3] ?? "",
        priceChangePercent: tds[4] ?? "",
        price: tds[5] ?? ""
      });
    }
    return out;
  });

  await browser.close();
  console.log(`✅ Scraped ${rows.length} rows.`);
  return rows;
}
