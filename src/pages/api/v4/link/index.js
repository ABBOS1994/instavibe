// src/pages/api/v4/link/index.js

import db from '../../../../config/db'
import Link from '../../../../models/Link'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  const method = req.method

  if (method === 'GET') {
    try {
      await db()
      const links = await Link.find()
      return res.status(200).json(links)
    } catch (error) {
      console.error('[LINK GET ERROR]', error)
      return res.status(500).json({
        message: error.message || 'Serverda noma’lum xatolik yuz berdi.',
      })
    }
  }

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      if (method === 'POST') {
        const newLink = new Link(req.body)
        await newLink.save()
        return res.status(201).json(newLink)
      }

      return res.status(405).json({
        message: `Siz ${method} noto'g'ri Methoddan foydalanyapsiz!`,
      })
    } catch (error) {
      console.error('[LINK ADMIN ERROR]', error)
      return res.status(500).json({
        message: error.message || 'Serverda noma’lum xatolik yuz berdi.',
      })
    }
  })
}

export default withLogging(handler)
