// src/pages/api/v4/category/[id].js

import Category from '../../../../models/Category'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

const handler = async (req, res) => {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ message: 'ID talab qilinadi' })
  }

  if (!['PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({
      message: `Xato!`,
    })
  }

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      if (req.method === 'PUT') {
        const updated = await Category.findByIdAndUpdate(
          id,
          { ...req.body, updatedBy: req.user._id },
          { new: true }
        )

        if (!updated) {
          return res.status(404).json({ message: 'Kategoriya topilmadi!' })
        }

        return res.status(200).json(updated)
      }

      if (req.method === 'DELETE') {
        const deleted = await Category.findByIdAndDelete(id)

        if (!deleted) {
          return res.status(404).json({ message: 'Kategoriya topilmadi!' })
        }

        return res.status(200).json({ message: "Kategoriya o'chirildi!" })
      }
    } catch (e) {
      console.error('[CATEGORY BY ID ERROR]', e)
      return res.status(500).json({
        message: e.message || 'Nomaʼlum xato yuz berdi',
      })
    }
  })
}

export default withLogging(handler)
