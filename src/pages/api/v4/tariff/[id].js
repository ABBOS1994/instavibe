// src/pages/api/v4/tariff/[id].js

import Tariff from '../../../../models/Tariff'
import dbConnect from '../../../../config/db'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  await dbConnect()
  const { id } = req.query
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const tariff = await Tariff.findById(id)
        if (!tariff) {
          return res
            .status(404)
            .json({ success: false, message: 'Tarif topilmadi' })
        }
        return res.status(200).json({ success: true, data: tariff })
      } catch (err) {
        console.error('[TARIFF GET ERROR]', err)
        return res
          .status(500)
          .json({ success: false, message: 'Tarifni olishda xatolik' })
      }

    case 'PUT':
      return authGuard([ROLES.ADMIN])(req, res, async () => {
        try {
          const { name, icon, level, features } = req.body
          const updated = await Tariff.findByIdAndUpdate(
            id,
            { name, icon, level, features },
            { new: true }
          )
          if (!updated) {
            return res
              .status(404)
              .json({ success: false, message: 'Tarif yangilashda topilmadi' })
          }
          return res.status(200).json({ success: true, data: updated })
        } catch (err) {
          console.error('[TARIFF PUT ERROR]', err)
          return res
            .status(500)
            .json({ success: false, message: 'Yangilashda xatolik' })
        }
      })

    case 'DELETE':
      return authGuard([ROLES.ADMIN])(req, res, async () => {
        try {
          const deleted = await Tariff.findByIdAndDelete(id)
          if (!deleted) {
            return res
              .status(404)
              .json({ success: false, message: 'Tarif topilmadi' })
          }
          return res
            .status(200)
            .json({ success: true, message: 'Tarif o‘chirildi' })
        } catch (err) {
          console.error('[TARIFF DELETE ERROR]', err)
          return res
            .status(500)
            .json({ success: false, message: 'O‘chirishda xatolik' })
        }
      })

    default:
      return res.status(405).json({
        success: false,
        message: `Method ${method} ruxsat etilmagan!`,
      })
  }
}

export default withLogging(handler)
