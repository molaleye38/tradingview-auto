import fetch from "node-fetch";

export async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

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
      console.error("Telegram error:", data);
    } else {
      console.log("✅ Telegram message sent");
    }
  } catch (err) {
    console.error("❌ Telegram send failed:", err.message);
  }
}
