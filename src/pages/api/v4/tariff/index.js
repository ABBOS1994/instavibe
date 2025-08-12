// src/pages/api/v4/tariff/index.js

import dbConnect from '../../../../config/db'
import Tariff from '../../../../models/Tariff'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  await dbConnect()

  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const data = await Tariff.find()
        return res.status(200).json(data)
      } catch (e) {
        console.error('[TARIFF GET ERROR]', e)
        return res.status(500).json({
          message: 'Tariflarni olishda xatolik yuz berdi',
          success: false,
        })
      }

    case 'POST':
      return authGuard([ROLES.ADMIN])(req, res, async () => {
        try {
          const created = await Tariff.create(req.body)
          return res.status(201).json({ success: true, data: created })
        } catch (e) {
          console.error('[TARIFF POST ERROR]', e)
          return res.status(500).json({
            message: e.message || 'Tarif qo‘shishda xatolik yuz berdi',
            success: false,
          })
        }
      })

    default:
      return res.status(405).json({
        message: `Method ${method} ruxsat etilmagan!`,
        success: false,
      })
  }
}

export default withLogging(handler)
