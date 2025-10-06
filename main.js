import 'dotenv/config';
import { scrapeScreener } from "./scraper.js";
import { sendTelegramMessage } from "./telegram.js";


export async function runAutomation({ type }) {
  const now = new Date();
  console.log(`\n🚀 Running ${type.toUpperCase()} automation at ${now.toISOString()}`);

  try {
    let bull = [], bear = [];

    if (type === "stock") {
      bull = await scrapeScreener(process.env.STOCK_BULLISH_URL, "stock");
      bear = await scrapeScreener(process.env.STOCK_BEARISH_URL, "stock");
    } else if (type === "crypto") {
      bull = await scrapeScreener(process.env.CRYPTO_BULLISH_URL, "crypto");
      bear = await scrapeScreener(process.env.CRYPTO_BEARISH_URL, "crypto");
    }

    const formatList = (title, arr) => {
      if (!arr || arr.length === 0) return `\n*${title}*\n_No results_`;
      return `\n*${title}*\n` + arr.map(i =>
        `• ${i.symbol} — Vol: ${i.volume || "N/A"} | RVOL: ${i.rvol || "N/A"} ${i.float ? `| Float: ${i.float}` : ""} | ${i.priceChangePercent || ""} | ${i.price || ""}`
      ).join("\n");
    };

    const message = `
📊 *${type.toUpperCase()} Screener — ${now.toISOString().slice(0,10)}*
${formatList("BULLISH", bull)}
${formatList("BEARISH", bear)}
`;

    await sendToTelegram(message);
    console.log(`✅ ${type.toUpperCase()} automation finished.`);
  } catch (err) {
    console.error("❌ Error in runAutomation:", err);
  }
}

if (process.argv.some(a => a.startsWith("--test"))) {
  const arg = process.argv.find(a => a.startsWith("--test"));
  const t = arg.split("=")[1] || "crypto";
  runAutomation({ type: t });
}
fix: corrected telegram function import name
