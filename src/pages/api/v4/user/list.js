// pages/api/v4/user/list.js
import dbConnect from '../../../../config/db'
import User from '../../../../models/User'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  try {
    return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
      if (!req.user) {
        return res.status(401).json({ message: '❌ Token mavjud emas' })
      }

      await dbConnect()

      const isCurator = String(req.user.role).toLowerCase() === ROLES.CURATOR
      const query = isCurator ? { curator: req.user._id } : {}

      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .select('+password')
        .lean()

      return res.status(200).json(users)
    })
  } catch (err) {
    console.error('❌ /user/list xatoligi:', err)
    return res.status(500).json({
      message: '❌ Foydalanuvchilarni olishda server xatoligi yuz berdi',
      error: err.message,
      success: false,
    })
  }
}

export default withLogging(handler)
