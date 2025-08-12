// src/pages/api/v4/client/[id].js

import Model from '../../../../models/Client'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  const { id } = req.query
  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      switch (req.method) {
        case 'PUT': {
          const updated = await Model.findByIdAndUpdate(id, req.body, {
            new: true,
          })
          if (!updated)
            return res.status(404).json({ message: 'Client topilmadi' })

          return res.status(200).json(updated)
        }

        case 'DELETE': {
          const deleted = await Model.findByIdAndDelete(id)
          if (!deleted)
            return res.status(404).json({ message: 'Client topilmadi' })

          return res.status(200).json({ message: 'Client o‘chirildi' })
        }

        default:
          return res.status(405).json({
            message: `Siz ${req.method} noto'g'ri Methoddan foydalanyapsiz!`,
          })
      }
    } catch (e) {
      console.error('Client [id] API error:', e)
      return res.status(500).json({
        message:
          e?.response?.data ||
          e?.message ||
          e?.response?.message ||
          e ||
          'Xatolik yuz berdi',
      })
    }
  })
}

export default withLogging(handler)
