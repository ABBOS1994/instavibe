// pages/api/v4/user/[id].js
import mongoose from 'mongoose'
import User from '../../../../models/User'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import dbConnect from '../../../../config/db'
import { ROLES } from '../../../../constants/roles'
import {
  normalizeTelegramUsername,
  validateLogin,
} from '../../../../helpers/normalize'

const parseGroup = (val) => {
  if (val === null || val === undefined || val === '') return null
  const n = Number(val)
  return Number.isInteger(n) && n >= 0 ? n : null
}

async function handler(req, res) {
  await dbConnect()

  return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
    try {
      const { id } = req.query
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: 'ID noto‘g‘ri formatda kiritilgan',
          success: false,
        })
      }

      const method = req.method
      const requesterRole = (req.user?.role || '').toLowerCase()

      const targetUser = await User.findById(id)
      if (!targetUser) {
        return res
          .status(404)
          .json({ message: 'Foydalanuvchi topilmadi!', success: false })
      }

      if (requesterRole === ROLES.CURATOR) {
        const isOwner = String(targetUser.curator) === String(req.user._id)
        if (!isOwner) {
          return res
            .status(403)
            .json({ message: 'Ruxsat yo‘q', success: false })
        }
      }

      if (method === 'PUT') {
        const updateFields = { ...req.body }

        if (
          requesterRole === ROLES.CURATOR &&
          updateFields.role &&
          [ROLES.ADMIN, ROLES.CURATOR].includes(
            String(updateFields.role).toLowerCase()
          )
        ) {
          return res.status(403).json({
            message: 'Kurator bu rolga o‘zgartira olmaydi',
            success: false,
          })
        }

        if (updateFields.login) {
          const { isValid, normalized, error } = validateLogin(
            updateFields.login
          )
          if (!isValid) {
            return res.status(400).json({ message: error })
          }
          updateFields.login = normalized
        }

        if (!updateFields.password?.trim()) {
          delete updateFields.password
        }

        if (updateFields.telegramChatId === '') {
          updateFields.telegramChatId = undefined
        }

        if (updateFields.telegramUsername) {
          const normalized = normalizeTelegramUsername(
            updateFields.telegramUsername
          )
          updateFields.telegramUsername = normalized || undefined
        }

        if (updateFields.accessUntil) {
          updateFields.accessUntil = new Date(updateFields.accessUntil)
        }

        const nextRole = (
          updateFields.role ||
          targetUser.role ||
          ''
        ).toLowerCase()

        // Kurator maydoni qoidası:
        if ([ROLES.STANDARD, ROLES.PREMIUM, ROLES.VIP].includes(nextRole)) {
          if (requesterRole === ROLES.CURATOR) {
            updateFields.curator = req.user._id
          } else if (requesterRole === ROLES.ADMIN) {
            if (updateFields.curator) {
              if (!mongoose.Types.ObjectId.isValid(updateFields.curator)) {
                return res.status(400).json({
                  message: 'Kurator ID noto‘g‘ri formatda',
                  success: false,
                })
              }
              updateFields.curator = new mongoose.Types.ObjectId(
                updateFields.curator
              )
            }
          }
        } else {
          updateFields.curator = undefined
        }

        if (nextRole === ROLES.ADMIN || nextRole === ROLES.CURATOR) {
          updateFields.group = null
        } else {
          if (updateFields.group !== undefined) {
            const g = parseGroup(updateFields.group)
            if (g === null) {
              return res.status(400).json({
                message: 'Group 0 yoki undan katta butun son bo‘lishi kerak',
                success: false,
              })
            }
            updateFields.group = g
          } else {
            const hasExistingGroup =
              targetUser.group === 0 ||
              (typeof targetUser.group === 'number' && targetUser.group > 0)
            if (!hasExistingGroup) {
              return res.status(400).json({
                message: 'Bu rol uchun group majburiy',
                success: false,
              })
            }
          }
        }

        updateFields.updatedBy = req.user._id

        const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
          new: true,
          runValidators: true,
          omitUndefined: true,
        })

        if (!updatedUser) {
          return res.status(404).json({
            message: 'Foydalanuvchi topilmadi!',
            success: false,
          })
        }

        return res.status(200).json({
          success: true,
          data: updatedUser,
        })
      }

      if (method === 'DELETE') {
        const deletedUser = await User.findByIdAndDelete(id)

        if (!deletedUser) {
          return res.status(404).json({
            message: 'Foydalanuvchi topilmadi!',
            success: false,
          })
        }

        return res.status(200).json({
          message: "Foydalanuvchi bazadan o'chirildi!",
          success: true,
        })
      }

      return res.status(405).json({
        message: `Siz ${method} noto‘g‘ri methoddan foydalanyapsiz!`,
        success: false,
      })
    } catch (e) {
      console.error('[USER/:id ERROR]', e)
      return res.status(500).json({
        message: e.message || "Noma'lum xato yuz berdi",
        success: false,
      })
    }
  })
}

export default withLogging(handler)
