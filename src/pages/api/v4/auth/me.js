// src/pages/api/v4/auth/me.js
import db from '../../../../config/db'
import { authGuard } from '../../../../middleware/authGuard'

async function handler(req, res) {
  await db()
  return authGuard()(req, res, async () => {
    try {
      const { _id, login, role, accessUntil, group, groups } = req.user || {}
      return res.status(200).json({
        _id,
        login,
        role,
        accessUntil,
        group: group ?? null,
        groups: Array.isArray(groups) ? groups : [],
        ...req.user,
      })
    } catch (e) {
      return res.status(500).json({ message: e.message || 'Server xatoligi' })
    }
  })
}

export default handler
