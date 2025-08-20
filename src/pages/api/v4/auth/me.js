import db from '../../../../config/db'
import { authGuard } from '../../../../middleware/authGuard'

async function handler(req, res) {
  await db()
  return authGuard()(req, res, async () => {
    try {
      const { _id, login, role, accessUntil } = req.user || {}
      return res.status(200).json({
        _id,
        login,
        role,
        accessUntil,
        group: req.user.group ?? null,
      })
    } catch (e) {
      return res.status(500).json({ message: e.message || 'Server xatoligi' })
    }
  })
}

export default handler
