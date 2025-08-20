import Category from '../../../../models/Category'
import db from '../../../../config/db'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

function normalizeVisibility(input) {
  if (input == null) return []
  let arr = Array.isArray(input) ? input : String(input).split(',')
  const cleaned = arr
    .map((v) => {
      const n = v === 0 ? 0 : parseInt(v, 10)
      return Number.isInteger(n) && n >= 0 ? n : null
    })
    .filter((n) => n !== null)

  return Array.from(new Set(cleaned)).sort((a, b) => a - b)
}

async function handler(req, res) {
  if (req.method === 'GET') {
    return authGuard()(req, res, async () => {
      try {
        await db()

        const role = req.user?.role
        const userGroup =
          typeof req.user?.group === 'number' ? req.user.group : null

        let filter = {}
        if (role === ROLES.ADMIN || role === ROLES.CURATOR) {
          filter = {}
        } else {
          if (userGroup === null) {
            return res.status(200).json([])
          }
          filter = { isActive: true, visibility: userGroup }
        }

        const categories = await Category.find(filter).sort({ sort: 1 }).lean()
        return res.status(200).json(categories)
      } catch (e) {
        console.error('[CATEGORY GET ERROR]', e)
        return res
          .status(500)
          .json({ message: e.message || 'Xatolik yuz berdi' })
      }
    })
  }

  if (req.method === 'POST') {
    return authGuard([ROLES.ADMIN])(req, res, async () => {
      try {
        await db()

        const payload = { ...req.body }
        payload.visibility = normalizeVisibility(payload.visibility)
        payload.createdBy = req.user._id

        const created = await Category.create(payload)
        return res.status(201).json(created)
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
