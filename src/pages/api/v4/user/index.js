// pages/api/v4/user/index.js
import Model from '../../../../models/User'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'
import mongoose from 'mongoose'
import crypto from 'crypto'
import {
  normalizeTelegramUsername,
  validateLogin,
} from '../../../../helpers/normalize'

const parseGroups = (val) => {
  if (val === null || val === undefined || val === '') return []
  let raw = val
  if (typeof raw === 'string') {
    raw = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  if (!Array.isArray(raw)) raw = [raw]
  const nums = raw
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n >= 0)
  return Array.from(new Set(nums)).sort((a, b) => a - b)
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
      try {
        const roleLower = (req.user?.role || '').toLowerCase()
        const filter = {}
        if (roleLower === ROLES.CURATOR) {
          filter.curator = req.user._id
        } else {
          const { curator } = req.query || {}
          if (curator !== undefined && curator !== '') {
            if (!mongoose.Types.ObjectId.isValid(curator)) {
              return res
                .status(400)
                .json({ message: 'curator noto‘g‘ri ObjectId' })
            }
            filter.curator = curator
          }
        }

        const users = await Model.find(filter)
          .sort({ createdAt: -1 })
          .select('+password')
          .lean()
        return res.status(200).json(users)
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
          group,
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

        const needsGroup = [ROLES.STANDARD, ROLES.VIP, ROLES.PREMIUM].includes(
          role
        )
        let finalGroups = []
        if (needsGroup) {
          const parsed = parseGroups(group)
          if (!parsed.length) {
            return res.status(400).json({
              message: 'Bu rol uchun kamida bitta group majburiy (0,1,2,...).',
            })
          }
          finalGroups = parsed
        }

        const roleLower = (req.user?.role || '').toLowerCase()
        const finalCurator =
          roleLower === ROLES.CURATOR
            ? req.user._id
            : curator && mongoose.Types.ObjectId.isValid(curator)
              ? curator
              : req.user._id

        const newUser = new Model({
          login: finalLogin,
          password: finalPassword,
          firstName,
          lastName,
          role,
          accessUntil,
          curator: finalCurator,
          phone: phone?.trim() || null,
          ...(finalUsername && { telegramUsername: finalUsername }),
          group: finalGroups,
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
