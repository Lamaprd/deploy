import "server-only";
import axios from "axios";

export async function sendTelegramMessage(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram environment variables are missing");
  }

  const response = await axios.post(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    { chat_id: chatId, text: message },
    { timeout: 10000 }
  );

  if (!response.data.ok) {
    throw new Error("Failed to send Telegram message");
  }
}