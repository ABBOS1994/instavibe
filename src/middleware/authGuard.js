// middleware/authGuard.js
import jwt from 'jsonwebtoken'
import dbConnect from '../config/db'
import User from '../models/User'

export function authGuard(allowedRoles = null) {
  return async function middleware(req, res, next) {
    try {
      if (!req || !req.headers) {
        return res.status(400).json({
          message: 'Request headers mavjud emas!',
          success: false,
        })
      }

      const authHeader = req.headers.authorization
      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader

      if (!token) {
        return res
          .status(401)
          .json({ message: 'Token topilmadi!', success: false })
      }

      const decoded = jwt.verify(token, process.env.CACHE_PREFIX)
      const userId = decoded._id || decoded.userId || decoded.id
      await dbConnect()

      const user = await User.findById(userId)
        .select('_id login role accessUntil isActive')
        .lean()

      if (!user) {
        return res
          .status(401)
          .json({ message: 'Foydalanuvchi topilmadi!', success: false })
      }

      const now = new Date()

      if (user.accessUntil && now > new Date(user.accessUntil)) {
        await User.updateOne({ _id: user._id }, { isActive: false })

        return res.status(403).json({
          message: 'Ruxsat muddati tugagan. Hisobingiz bloklandi.',
          success: false,
        })
      }

      if (!user.isActive) {
        return res.status(403).json({
          message:
            'Hisobingiz faol emas. Iltimos, administratorga murojaat qiling.',
          success: false,
        })
      }

      if (
        allowedRoles &&
        Array.isArray(allowedRoles) &&
        !allowedRoles.includes(user.role)
      ) {
        return res
          .status(403)
          .json({ message: 'Sizda bu sahifaga ruxsat yo‘q!', success: false })
      }

      req.user = {
        _id: user._id,
        login: user.login,
        role: user.role,
        accessUntil: user.accessUntil,
      }

      return next()
    } catch (err) {
      console.error('❌ authGuard error:', err)
      return res.status(401).json({
        message: err.message || 'Token noto‘g‘ri yoki muddati tugagan!',
        success: false,
      })
    }
  }
}
