// pages/api/v4/user/bulk-group.js
import dbConnect from '../../../../config/db'
import User from '../../../../models/User'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'
import mongoose from 'mongoose'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Faqqat POST', success: false })
  }

  await dbConnect()

  return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
    try {
      const { group, userIds, onlyWithoutGroup = false } = req.body

      // Tekshiruvlar
      if (
        group === undefined ||
        group === null ||
        Number.isNaN(Number(group))
      ) {
        return res.status(400).json({
          message: 'group raqam bo‘lishi kerak (0 yoki 1...)',
          success: false,
        })
      }
      const groupNum = Number(group)

      // Faqat oddiy foydalanuvchilar uchun
      const query = {
        role: { $in: [ROLES.STANDARD, ROLES.VIP, ROLES.PREMIUM] },
      }

      // CURATOR faqat o‘z userlariga o‘zgartirish qilsin
      if (req.user.role === ROLES.CURATOR) {
        query.curator = req.user._id
      }

      // Agar tanlangan userlar bo‘lsa – faqat o‘shalar
      if (Array.isArray(userIds) && userIds.length) {
        const validIds = userIds
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id))
        if (validIds.length === 0) {
          return res
            .status(400)
            .json({ message: 'userIds bo‘sh yoki noto‘g‘ri', success: false })
        }
        query._id = { $in: validIds }
      }

      if (onlyWithoutGroup) {
        query.$or = [{ group: { $exists: false } }, { group: null }]
      }

      const result = await User.updateMany(query, { $set: { group: groupNum } })
      return res.status(200).json({
        success: true,
        matched: result.matchedCount ?? result.n,
        modified: result.modifiedCount ?? result.nModified,
        message: `Guruh ${groupNum} belgilandi`,
      })
    } catch (e) {
      console.error('bulk-group error:', e)
      return res
        .status(500)
        .json({ success: false, message: e.message || 'Server xatoligi' })
    }
  })
}

export default withLogging(handler)
