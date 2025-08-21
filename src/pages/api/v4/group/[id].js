import db from '../../../../config/db'
import Group from '../../../../models/Group'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  await db()
  const { id } = req.query

  if (!['PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ message: `${req.method} qo‘llanilmaydi` })
  }

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      if (req.method === 'PUT') {
        const raw = req.body?.code
        const code = Number(raw)
        if (!Number.isInteger(code) || code < 0) {
          return res
            .status(400)
            .json({ message: 'code 0 yoki musbat butun bo‘lishi kerak' })
        }
        const dup = await Group.findOne({ code, _id: { $ne: id } })
        if (dup) {
          return res.status(409).json({ message: 'Bu code allaqachon mavjud' })
        }
        const updated = await Group.findByIdAndUpdate(
          id,
          { code },
          { new: true }
        )
        if (!updated)
          return res.status(404).json({ message: 'Group topilmadi' })
        return res.status(200).json(updated)
      }

      if (req.method === 'DELETE') {
        const deleted = await Group.findByIdAndDelete(id)
        if (!deleted)
          return res.status(404).json({ message: 'Group topilmadi' })
        return res.status(200).json({ message: "Group o'chirildi" })
      }
    } catch (e) {
      console.error('[GROUP MUTATION ERROR]', e)
      return res.status(500).json({ message: e.message || 'Server xatoligi' })
    }
  })
}

export default withLogging(handler)
