import axios from 'axios'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function sendTelegram(chatId, message) {
  if (!BOT_TOKEN || !chatId) {
    console.error('[TELEGRAM ERROR] Token yoki chatId yo‘q', {
      BOT_TOKEN,
      chatId,
    })
    throw new Error('Token yoki chatId yo‘q')
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  try {
    return await axios.post(url, {
      chat_id: chatId,
      text: message,
    })
  } catch (err) {
    console.error('[TELEGRAM ERROR]', err.response?.data || err.message)
    throw err
  }
}
