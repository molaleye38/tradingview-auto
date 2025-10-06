import fetch from "node-fetch";

export async function sendToTelegram(message) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("❌ Missing TELEGRAM_TOKEN or TELEGRAM_CHAT_ID in environment variables.");
    process.exit(1);
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Telegram API error: ${res.status}`);
    }

    console.log("✅ Message sent to Telegram!");
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
}
