import Model from '../../../../models/Content'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  const { id } = req.query
  const method = req.method

  if (method === 'GET') {
    return authGuard([ROLES.CURATOR, ROLES.ADMIN, ROLES.VIP, ROLES.STANDARD])(
      req,
      res,
      async () => {
        try {
          const content = await Model.findOne({ child: id })
          return res.status(200).json(content)
        } catch (e) {
          console.error('[CONTENT GET ERROR]', e)
          return res.status(500).json({
            message: "Noma'lum xato yuz berdi",
            error: e,
            success: false,
          })
        }
      }
    )
  }

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      switch (method) {
        case 'POST': {
          const created = await Model.create({
            child: id,
            ...req.body,
            createdBy: req.user.userId,
          })
          return res.status(201).json(created)
        }

        case 'PUT': {
          const updated = await Model.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user.userId },
            { new: true }
          )

          if (!updated) {
            return res.status(404).json({ message: 'Kontent topilmadi' })
          }

          return res.status(200).json(updated)
        }

        case 'DELETE': {
          const deleted = await Model.findByIdAndDelete(id)

          if (!deleted) {
            return res.status(404).json({ message: 'Kontent topilmadi' })
          }

          return res
            .status(200)
            .json({ message: 'Kontent muvaffaqiyatli o‘chirildi' })
        }

        default:
          return res.status(405).json({
            message: `Siz ${method} noto'g'ri methoddan foydalanyapsiz!`,
          })
      }
    } catch (e) {
      console.error('[CONTENT ADMIN ERROR]', e)
      return res.status(500).json({
        message: "Noma'lum xato yuz berdi",
        error: e,
        success: false,
      })
    }
  })
}

export default withLogging(handler)
