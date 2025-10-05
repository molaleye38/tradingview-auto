import { Telegraf } from "telegraf";
import 'dotenv/config';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export async function sendToTelegram(text) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.log("⚠️ Telegram token or chat id missing. Skipping send.");
    return;
  }
  try {
    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, text, { parse_mode: "Markdown" });
    console.log("✅ Message sent to Telegram.");
  } catch (err) {
    console.error("❌ Failed to send Telegram message:", err.message);
  }
}
