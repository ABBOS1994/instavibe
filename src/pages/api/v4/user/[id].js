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

async function handler(req, res) {
  await dbConnect()

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      const { id } = req.query

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: 'ID noto‘g‘ri formatda kiritilgan',
          success: false,
        })
      }

      const method = req.method

      if (method === 'PUT') {
        const updateFields = { ...req.body }

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

        if (updateFields.login) {
          const { isValid, normalized, error } = validateLogin(
            updateFields.login
          )
          if (!isValid) {
            return res.status(400).json({ message: error })
          }
          updateFields.login = normalized // Case saqlanadi (normalize faqat bo‘shliqni tozalaydi)
        }

        if (updateFields.accessUntil) {
          updateFields.accessUntil = new Date(updateFields.accessUntil)
        }

        if ([ROLES.STANDARD, ROLES.VIP].includes(updateFields.role)) {
          if (req.user.role === ROLES.ADMIN && updateFields.curator) {
            if (!mongoose.Types.ObjectId.isValid(updateFields.curator)) {
              return res.status(400).json({
                message: 'Kurator ID noto‘g‘ri formatda',
                success: false,
              })
            }
            updateFields.curator = new mongoose.Types.ObjectId(
              updateFields.curator
            )
          } else if (req.user.role === ROLES.CURATOR) {
            updateFields.curator = req.user.userId
          } else {
            updateFields.curator = null
          }
        } else {
          updateFields.curator = undefined
        }

        updateFields.updatedBy = req.user.userId

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
