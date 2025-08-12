import Link from '../../../../models/Link'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  const { id } = req.query
  const method = req.method

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      switch (method) {
        case 'PUT': {
          const updatedLink = await Link.findByIdAndUpdate(id, req.body, {
            new: true,
          })

          if (!updatedLink) {
            return res.status(404).json({ message: 'Link topilmadi!' })
          }

          return res.status(200).json(updatedLink)
        }

        case 'DELETE': {
          const deletedLink = await Link.findByIdAndDelete(id)

          if (!deletedLink) {
            return res.status(404).json({ message: 'Link topilmadi!' })
          }

          return res.status(200).json({
            message: 'Link o‘chirildi (isActive: false)',
            deletedLink,
          })
        }

        default:
          return res.status(405).json({
            message: `Siz ${method} noto'g'ri Methoddan foydalanyapsiz!`,
          })
      }
    } catch (error) {
      console.error('[LINK ID ERROR]', error)
      return res.status(500).json({
        message: error.message || 'Noma‘lum xato yuz berdi',
      })
    }
  })
}

export default withLogging(handler)
