async function sendTelegram(payloadMessage) {
  const token = process.env.TELEGRAM_BOT_API_KEY;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Faltan variables de entorno de Telegram");
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: payloadMessage,
      parse_mode: "Markdown",
    }),
  });
}

export { sendTelegram };
