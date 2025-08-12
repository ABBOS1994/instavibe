import dbConnect from '../../../../config/db'
import Result from '../../../../models/Result'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  const method = req.method

  if (method === 'GET') {
    try {
      await dbConnect()
      const results = await Result.find()
      return res.status(200).json({ success: true, data: results })
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'Natijalarni olishda xatolik.',
      })
    }
  }

  if (method === 'POST') {
    return authGuard([ROLES.ADMIN])(req, res, async () => {
      try {
        const {
          videoId,
          title,
          description,
          telegram,
          instagram,
          youtube,
          img,
        } = req.body

        if (!videoId || !title || !description) {
          return res.status(400).json({
            success: false,
            message: "Majburiy maydonlar to'ldirilmagan!",
          })
        }

        const newResult = await Result.create({
          videoId,
          title,
          description,
          telegram,
          instagram,
          youtube,
          img,
        })

        return res.status(201).json({ success: true, data: newResult })
      } catch (e) {
        console.error('[RESULT CREATE ERROR]', e)
        return res.status(500).json({
          success: false,
          message: 'Yangi natija qo‘shishda xatolik.',
          error: e,
        })
      }
    })
  }

  return res.status(405).json({
    success: false,
    message: `Method ${method} qo‘llab-quvvatlanmaydi.`,
  })
}

export default withLogging(handler)
