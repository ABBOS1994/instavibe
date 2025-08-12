import dbConnect from '../../../../config/db'
import User from '../../../../models/User'
import PushLog from '../../../../models/PushLog'
import { sendTelegram } from '../../../../helpers/telegramHelper'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Faqat POST methodga ruxsat' })
  }

  const { userIds, message } = req.body

  if (!Array.isArray(userIds) || !message) {
    return res.status(400).json({
      message: 'userIds va message majburiy',
    })
  }

  await dbConnect()
  const results = []

  for (const userId of userIds) {
    try {
      const user = await User.findById(userId).lean()
      if (!user) {
        results.push({
          userId,
          success: false,
          error: 'Foydalanuvchi topilmadi',
        })
        continue
      }

      // PLATFORM PUSH log
      await PushLog.create({
        userId: user._id,
        message,
        channel: 'platform',
        sentAt: new Date(),
        success: true,
        read: false,
      })

      // TELEGRAM logikasi
      let telegramSuccess = false
      let telegramError = null
      let telegramMessageId = null

      if (user.telegramChatId) {
        try {
          const resp = await sendTelegram(user.telegramChatId, message)
          telegramSuccess = true
          telegramMessageId = resp?.data?.result?.message_id?.toString() || null
        } catch (err) {
          telegramError = err.message
        }
      } else {
        telegramError = 'telegramChatId yo‘q'
      }

      await PushLog.create({
        userId: user._id,
        message,
        channel: 'telegram',
        sentAt: new Date(),
        success: telegramSuccess,
        error: telegramError,
        messageId: telegramMessageId,
        read: false,
      })

      results.push({
        userId,
        telegram: telegramSuccess ? 'sent' : 'failed',
        telegramError,
      })
    } catch (err) {
      results.push({
        userId,
        success: false,
        error: err.message || 'Xatolik',
      })
    }
  }

  return res.status(200).json({
    message: 'Push yuborish yakunlandi',
    count: results.length,
    results,
  })
}
