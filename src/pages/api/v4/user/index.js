import db from '../../../../config/db'
import Model from '../../../../models/User'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'
import mongoose from 'mongoose'
import crypto from 'crypto'
import {
  normalizeTelegramUsername,
  validateLogin,
} from '../../../../helpers/normalize'

export default async function handler(req, res) {
  await db()

  if (req.method === 'GET') {
    return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
      try {
        const {
          search = '',
          page = 1,
          limit = 20,
          sortBy = 'createdAt',
          sortOrder = 'desc',
          role,
          curator,
          isActive,
        } = req.query

        const query = {}

        if (search) {
          query.$or = [
            { login: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
          ]
        }

        if (role) query.role = role
        if (isActive !== undefined) query.isActive = isActive === '1'
        if (curator && mongoose.Types.ObjectId.isValid(curator))
          query.curator = curator

        const skip = (Number(page) - 1) * Number(limit)
        const total = await Model.countDocuments(query)
        const users = await Model.find(query)
          .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
          .skip(skip)
          .limit(Number(limit))
          .select('+password')
          .lean()

        // Agar frontend totalPages kutsa:
        const totalPages = Math.max(1, Math.ceil(total / Number(limit)))

        return res.status(200).json({ total, totalPages, users })
      } catch (e) {
        console.error('[USER GET ERROR]', e)
        return res.status(500).json({ message: 'Server xatoligi' })
      }
    })
  }

  if (req.method === 'POST') {
    return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
      try {
        const {
          login,
          password,
          phone,
          telegramUsername,
          role = ROLES.STANDARD,
          curator,
          firstName,
          lastName,
        } = req.body

        if (!login) {
          return res.status(400).json({ message: 'Login majburiy' })
        }

        const { isValid, normalized: finalLogin, error } = validateLogin(login)
        if (!isValid) {
          return res.status(400).json({ message: error })
        }

        const finalUsername = telegramUsername?.trim()
          ? normalizeTelegramUsername(telegramUsername)
          : undefined

        const accessUntil =
          role === ROLES.VIP
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)

        const finalPassword = password?.trim()
          ? password.trim()
          : crypto.randomBytes(6).toString('base64').slice(0, 10)

        const duplicate = await Model.findOne({
          $or: [
            { login: finalLogin },
            finalUsername ? { telegramUsername: finalUsername } : null,
          ].filter(Boolean),
        })
        if (duplicate) {
          return res
            .status(400)
            .json({ message: 'Foydalanuvchi allaqachon mavjud' })
        }

        const newUser = new Model({
          login: finalLogin,
          password: finalPassword,
          firstName,
          lastName,
          role,
          accessUntil,
          curator:
            curator && mongoose.Types.ObjectId.isValid(curator)
              ? curator
              : req.user.userId,
          phone: phone?.trim() || null,
          ...(finalUsername && { telegramUsername: finalUsername }),
        })

        await newUser.save()

        return res.status(201).json({
          message: 'Foydalanuvchi muvaffaqiyatli yaratildi',
          user: newUser,
          generatedPassword: !password ? finalPassword : password,
        })
      } catch (e) {
        console.error('[USER POST ERROR]', e)
        return res
          .status(500)
          .json({ message: 'Server xatoligi', error: e.message })
      }
    })
  }

  return res.status(405).json({ message: `${req.method} qo‘llanilmaydi` })
}
