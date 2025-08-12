// src/pages/api/v4/banner/index.js

import Model from '../../../../models/Banner'
import db from '../../../../config/db'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      await db()
      const banners = await Model.find()
      return res.status(200).json(banners)
    } catch (e) {
      console.error('[BANNER GET ERROR]', e)
      return res.status(500).json({
        message: e.message || "Noma'lum xato yuz berdi",
      })
    }
  }

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      if (req.method === 'POST') {
        const { text, img, isActive } = req.body

        const newBanner = new Model({
          text,
          img,
          isActive: isActive ?? true,
          createdBy: req.user._id,
        })

        await newBanner.save()
        return res.status(201).json(newBanner)
      }

      return res.status(405).json({
        message: `Siz ${req.method} noto'g'ri methoddan foydalanyapsiz!`,
      })
    } catch (e) {
      console.error('[BANNER POST ERROR]', e)
      return res.status(500).json({
        message: e.message || "Noma'lum xato yuz berdi",
      })
    }
  })
}

export default withLogging(handler)
