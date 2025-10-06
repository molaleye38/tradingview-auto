// main.js
import { sendTelegramMessage } from "./telegram.js";

// ✅ This function simulates scraping TradingView (replace later with Puppeteer)
async function scrapeTradingViewData() {
  // Example test data — once the Telegram works, we’ll replace with real scraped data
  const stocks = [
    { ticker: "AAPL", change: "+12.5%", volume: "15.2M", rvol: "2.3", float: "9.7M" },
    { ticker: "TSLA", change: "+9.1%", volume: "18.5M", rvol: "2.1", float: "8.4M" },
  ];

  const cryptos = [
    { ticker: "BTCUSDT", change: "+3.5%", volume: "42.3B", rvol: "1.8", price: "68200" },
    { ticker: "ETHUSDT", change: "+2.2%", volume: "22.7B", rvol: "1.6", price: "3550" },
  ];

  // Format Telegram message
  let message = "📊 <b>DAILY MARKET UPDATE</b>\n\n";
  message += "📈 <b>STOCKS</b>\n";
  for (const s of stocks) {
    message += `${s.ticker} — ${s.change} | Vol: ${s.volume} | RVOL: ${s.rvol} | Float: ${s.float}\n`;
  }

  message += "\n💎 <b>CRYPTO</b>\n";
  for (const c of cryptos) {
    message += `${c.ticker} — ${c.change} | Vol: ${c.volume} | RVOL: ${c.rvol} | Price: ${c.price}\n`;
  }

  return message;
}

async function main() {
  console.log("🚀 Starting daily TradingView automation...");

  // 1️⃣ Scrape or mock the data
  const message = await scrapeTradingViewData();

  // 2️⃣ Send to Telegram
  await sendTelegramMessage(message);

  console.log("✅ Workflow complete");
}

// Run the script
main().catch((err) => {
  console.error("❌ Error in main:", err);
  process.exit(1);
});
