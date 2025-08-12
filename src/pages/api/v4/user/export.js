import { Parser } from 'json2csv'
import User from '../../../../models/User'
import withLogging from '../../../../middleware/logMiddleware'
import dbConnect from '../../../../config/db'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

function formatTelegramUsername(username = '') {
  return username ? `@${username}` : ''
}

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Xato!',
      success: false,
    })
  }

  await dbConnect()

  return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
    try {
      const users = await User.find().select('+password').lean()

      const curatorIds = [
        ...new Set(
          users
            .map((u) => u.curator)
            .filter(Boolean)
            .map((c) => c.toString())
        ),
      ]
      const curatorsMap = {}

      if (curatorIds.length > 0) {
        const curators = await User.find({ _id: { $in: curatorIds } })
          .select('firstName login')
          .lean()
        curators.forEach((c) => {
          curatorsMap[c._id.toString()] = c
        })
      }

      const fields = [
        'login',
        'password',
        'firstName',
        'lastName',
        'phone',
        'role',
        'telegramUsername',
        'telegramChatId',
        'accessUntil',
        'isActive',
        'curator',
      ]

      const formattedUsers = users.map((u) => {
        const curator = curatorsMap[u.curator?.toString()] || {}
        return {
          login: u.login || '',
          password: u.password || '',
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          phone: u.phone || '',
          role: u.role || '',
          telegramUsername: formatTelegramUsername(u.telegramUsername || ''),
          telegramChatId: u.telegramChatId || '',
          accessUntil: u.accessUntil
            ? new Date(u.accessUntil).toISOString().split('T')[0]
            : '',
          isActive: u.isActive ? '1' : '0',
          curator: curator.firstName || curator.login || 'admin/curator',
        }
      })

      const parser = new Parser({ fields })
      const csv = parser.parse(formattedUsers)

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename=users.csv')
      return res.status(200).send(csv)
    } catch (e) {
      console.error('[EXPORT ERROR]:', e)
      return res.status(500).json({
        message: 'Exportda xatolik',
        error: e.message,
        success: false,
      })
    }
  })
}

export default withLogging(handler)
