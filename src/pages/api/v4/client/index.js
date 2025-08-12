import Model from '../../../../models/Client'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'
import dbConnect from '../../../../config/db'

async function handler(req, res) {
  const method = req.method

  if (method === 'GET') {
    try {
      await dbConnect()
      const data = await Model.find()
      return res.status(200).json(data)
    } catch (e) {
      console.error('[CLIENT GET ERROR]', e)
      return res.status(500).json({
        message:
          e?.response?.data ||
          e?.message ||
          e?.response?.message ||
          e ||
          "Noma'lum xato yuz berdi",
      })
    }
  }

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      if (method === 'POST') {
        const created = await Model.create(req.body)
        return res.status(201).json(created)
      }

      return res.status(405).json({
        message: `Siz ${method} noto'g'ri methoddan foydalanyapsiz!`,
      })
    } catch (e) {
      console.error('[CLIENT ADMIN ERROR]', e)
      return res.status(500).json({
        message:
          e?.response?.data ||
          e?.message ||
          e?.response?.message ||
          e ||
          "Noma'lum xato yuz berdi",
      })
    }
  })
}

export default withLogging(handler)
