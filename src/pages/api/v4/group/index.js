import db from '../../../../config/db'
import Group from '../../../../models/Group'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  await db()

  if (req.method === 'GET') {
    return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
      try {
        const groups = await Group.find().sort({ code: 1 }).lean()
        return res.status(200).json(groups)
      } catch (e) {
        console.error('[GROUP GET ERROR]', e)
        return res.status(500).json({ message: 'Server xatoligi' })
      }
    })
  }

  if (req.method === 'POST') {
    return authGuard([ROLES.ADMIN])(req, res, async () => {
      try {
        const raw = req.body?.code
        const code = Number(raw)
        if (!Number.isInteger(code) || code < 0) {
          return res
            .status(400)
            .json({ message: 'code 0 yoki musbat butun bo‘lishi kerak' })
        }

        const exists = await Group.findOne({ code })
        if (exists) {
          return res.status(409).json({ message: 'Bu code allaqachon mavjud' })
        }

        const created = await Group.create({ code })
        return res.status(201).json(created)
      } catch (e) {
        console.error('[GROUP POST ERROR]', e)
        return res.status(500).json({ message: e.message || 'Server xatoligi' })
      }
    })
  }

  return res.status(405).json({ message: `${req.method} qo‘llanilmaydi` })
}

export default withLogging(handler)
