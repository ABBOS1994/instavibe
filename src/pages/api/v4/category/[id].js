import Category from '../../../../models/Category'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'
import withLogging from '../../../../middleware/logMiddleware'

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

const handler = async (req, res) => {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ message: 'ID talab qilinadi' })
  }

  if (!['PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ message: 'Xato!' })
  }

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      if (req.method === 'PUT') {
        const payload = { ...req.body, updatedBy: req.user._id }

        if ('visibility' in payload) {
          payload.visibility = normalizeVisibility(payload.visibility)
        }

        const updated = await Category.findByIdAndUpdate(id, payload, {
          new: true,
          runValidators: true,
        })

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
      return res
        .status(500)
        .json({ message: e.message || 'Nomaʼlum xato yuz berdi' })
    }
  })
}

export default withLogging(handler)
