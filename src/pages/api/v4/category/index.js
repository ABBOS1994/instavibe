// src/pages/api/v4/category/index.js

import Category from '../../../../models/Category'
import db from '../../../../config/db'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await db()
      const categories = await Category.find().sort({ sort: 1 }).lean()
      return res.status(200).json(categories)
    } catch (e) {
      console.error('[CATEGORY GET ERROR]', e)
      return res.status(500).json({ message: e.message || 'Xatolik yuz berdi' })
    }
  }

  if (req.method === 'POST') {
    return authGuard([ROLES.ADMIN])(req, res, async () => {
      try {
        await db()
        const newCategory = new Category({
          ...req.body,
          createdBy: req.user._id,
        })

        const savedCategory = await newCategory.save()
        return res.status(201).json(savedCategory)
      } catch (e) {
        console.error('[CATEGORY POST ERROR]', e)
        return res
          .status(500)
          .json({ message: e.message || 'Xatolik yuz berdi' })
      }
    })
  }

  return res.status(405).json({
    message: `Siz ${req.method} noto'g'ri methoddan foydalanyapsiz!`,
  })
}

export default withLogging(handler)
