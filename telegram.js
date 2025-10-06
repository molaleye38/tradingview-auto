// telegram.js
import fetch from "node-fetch";

export async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("❌ Missing TELEGRAM_TOKEN or TELEGRAM_CHAT_ID in environment variables.");
    process.exit(1);
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.text();
      console.error("❌ Telegram API error:", data);
    } else {
      console.log("✅ Telegram message sent successfully!");
    }
  } catch (err) {
    console.error("❌ Failed to send Telegram message:", err.message);
  }
}
