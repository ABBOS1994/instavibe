// src/pages/api/v4/banner/[id].js

import Model from '../../../../models/Banner'
import db from '../../../../config/db'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

const handler = async (req, res) => {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ message: 'ID talab qilinadi!' })
  }

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      if (req.method === 'PUT') {
        const { text, img, isActive } = req.body

        const updated = await Model.findByIdAndUpdate(
          id,
          {
            text,
            img,
            isActive,
            updatedBy: req.user._id,
          },
          { new: true }
        )

        if (!updated) {
          return res.status(404).json({ message: 'Banner topilmadi!' })
        }

        return res.status(200).json(updated)
      }

      if (req.method === 'DELETE') {
        const deleted = await Model.findByIdAndDelete(id)

        if (!deleted) {
          return res.status(404).json({ message: 'Banner topilmadi!' })
        }

        return res.status(200).json({ message: "Banner o'chirildi!" })
      }

      return res.status(405).json({
        message: `Siz ${req.method} noto'g'ri methoddan foydalanyapsiz!`,
      })
    } catch (e) {
      console.error('[BANNER ID ERROR]', e)
      return res.status(500).json({
        message: e.message || "Noma'lum xato yuz berdi",
      })
    }
  })
}

export default withLogging(handler)
