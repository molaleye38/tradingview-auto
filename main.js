// main.js
import puppeteer from "puppeteer";
import { sendToTelegram } from "./telegram.js";

const isStockRun = !!process.env.STOCK_URL;
const isCryptoRun = !!process.env.CRYPTO_URL;
const label = isStockRun ? "📈 Stock Screener" : "💎 Crypto Screener";
const targetURL = isStockRun ? process.env.STOCK_URL : process.env.CRYPTO_URL;
const username = process.env.TRADINGVIEW_USER;
const password = process.env.TRADINGVIEW_PASS;

async function scrapeTradingView() {
  if (!username || !password) {
    await sendToTelegram(`❌ ${label}: Missing TradingView login credentials.`);
    return;
  }

  if (!targetURL) {
    await sendToTelegram(`❌ ${label}: Missing screener URL.`);
    return;
  }

  console.log(`🔐 Logging in to TradingView as ${username}...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.tradingview.com/#signin", { waitUntil: "networkidle2" });

    // Wait for login form and input credentials
    await page.waitForSelector('input[name="username"], input[name="email"]', { visible: true });
    await page.type('input[name="username"], input[name="email"]', username, { delay: 100 });
    await page.type('input[name="password"]', password, { delay: 100 });
    await page.keyboard.press("Enter");

    console.log("✅ Logged in successfully, loading screener...");

    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.goto(targetURL, { waitUntil: "networkidle2" });

    // Wait for table rows to appear
    await page.waitForSelector("tr[data-rowkey]", { timeout: 20000 });

    const data = await page.evaluate((isStockRun) => {
      const rows = Array.from(document.querySelectorAll("tr[data-rowkey]"));
      return rows.slice(0, 20).map((row) => {
        const cols = row.querySelectorAll("td");
        const symbol = cols[0]?.innerText || "N/A";
        const price = cols[1]?.innerText || "N/A";
        const change = cols[2]?.innerText || "N/A";
        const volume = cols[5]?.innerText || "N/A";
        const rvol = isStockRun ? (cols[6]?.innerText || "N/A") : "";
        return { symbol, price, change, volume, rvol };
      });
    }, isStockRun);

    if (!data || data.length === 0) {
      await sendToTelegram(`⚠️ ${label}: No data found or page structure changed.`);
      return;
    }

    const message = [
      `${label} Results (${new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}):`,
      "",
      ...data.map((d, i) =>
        `${i + 1}. ${d.symbol} | 💵 ${d.price} | 📊 ${d.change} | 🔁 Vol: ${d.volume}${isStockRun ? ` | 📈 RVOL: ${d.rvol}` : ""}`
      )
    ].join("\n");

    await sendToTelegram(message);
    console.log("✅ Data sent to Telegram successfully!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    await sendToTelegram(`❌ ${label} failed: ${err.message}`);
  } finally {
    await browser.close();
  }
}

scrapeTradingView();
