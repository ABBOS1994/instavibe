// pages/api/v4/user/list.js

import dbConnect from '../../../../config/db'
import User from '../../../../models/User'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  try {
    return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
      const currentUser = req.user
      if (!currentUser) {
        return res.status(401).json({ message: '❌ Token mavjud emas' })
      }

      const query =
        currentUser.role === ROLES.CURATOR ? { curator: currentUser._id } : {}
      await dbConnect()

      const users = await User.find(query).sort({ createdAt: -1 }).lean()

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
