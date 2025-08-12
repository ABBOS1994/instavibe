// src/pages/api/v4/login.js

import User from '../../../models/User'
import jwt from 'jsonwebtoken'
import withLogging from '../../../middleware/logMiddleware'
import {
  isBlocked,
  increaseAttempt,
  resetAttempts,
} from '../../../middleware/loginRateLimiter'

function normalize(str = '') {
  return str.replace(/\s+/g, '').toLowerCase()
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Xatolik! Faqat POST so‘rovi qabul qilinadi.',
      success: false,
    })
  }

  try {
    let { login, password } = req.body

    if (!login || !password) {
      return res.status(400).json({
        message: 'Iltimos, login va parolni kiriting!',
        success: false,
      })
    }

    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      'unknown'

    if (await isBlocked(ip)) {
      return res.status(429).json({
        message: 'Ko‘p urinish. 5 daqiqadan keyin urinib ko‘ring.',
        success: false,
      })
    }

    const normalizedLogin = normalize(login)
    const user = await User.findOne({
      login: { $regex: new RegExp(`^${normalizedLogin}$`, 'i') },
    }).select('+password')

    if (!user) {
      await increaseAttempt(ip)
      return res.status(404).json({
        message: 'Foydalanuvchi topilmadi!',
        success: false,
      })
    }

    const isPasswordCorrect = normalize(password) === normalize(user.password)

    if (!isPasswordCorrect) {
      await increaseAttempt(ip)
      return res.status(401).json({
        message: "Parol noto'g'ri kiritilgan!",
        success: false,
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        message:
          'Hisobingiz bloklangan. Iltimos, administratorga murojaat qiling.',
        success: false,
      })
    }

    if (user.accessUntil && new Date(user.accessUntil) < new Date()) {
      user.isActive = false
      await user.save()

      return res.status(403).json({
        message: 'Ruxsat muddati tugagan. Hisobingiz bloklandi.',
        success: false,
      })
    }

    await resetAttempts(ip)

    user.lastSeen = new Date()
    await user.save({ validateBeforeSave: false })

    const publicUser = {
      _id: user._id,
      login: user.login,
      role: user.role,
      accessUntil: user.accessUntil,
    }

    const token = jwt.sign(publicUser, process.env.CACHE_PREFIX, {
      expiresIn: '90d',
    })

    return res.status(200).json({
      message: 'Platformaga xush kelibsiz!',
      token,
      user: publicUser,
      success: true,
    })
  } catch (e) {
    console.error('[LOGIN ERROR]', e)
    return res.status(500).json({
      message: 'Serverda xatolik yuz berdi',
      success: false,
      error: e.message,
    })
  }
}

export default withLogging(handler)
