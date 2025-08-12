// src/pages/api/v4/dashboard/summary.js

import User from '../../../../models/User'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

const { ADMIN, CURATOR, STANDARD, VIP, PREMIUM } = ROLES

async function handler(req, res) {
  return authGuard([ADMIN, CURATOR])(req, res, async () => {
    try {
      const user = req.user
      const isAdmin = user.role === ADMIN
      const isCurator = user.role === CURATOR

      const baseMatch = {
        role: { $in: [STANDARD, VIP, PREMIUM] },
      }

      const match = isCurator ? { ...baseMatch, curator: user._id } : baseMatch

      const totalStudents = await User.countDocuments(match)
      const activeStudents = await User.countDocuments({
        ...match,
        isActive: true,
      })
      console.log(totalStudents, activeStudents)
      const passiveStudents = totalStudents - activeStudents

      const response = {
        totalStudents,
        activeStudents,
        passiveStudents,
      }

      if (isAdmin) {
        const curators = await User.find({ role: 'curator' })
          .select('_id firstName lastName login')
          .lean()

        const curatorStats = await Promise.all(
          curators.map(async (cur) => {
            const curatorMatch = { ...baseMatch, curator: cur._id }

            const total = await User.countDocuments(curatorMatch)
            const active = await User.countDocuments({
              ...curatorMatch,
              isActive: true,
            })
            const passive = total - active

            return {
              curatorId: cur._id,
              name: `${cur.firstName || ''} ${cur.lastName || ''}`.trim(),
              login: cur?.login,
              total,
              active,
              passive,
            }
          })
        )

        response.curators = curatorStats
      }

      return res.status(200).json({ success: true, data: response })
    } catch (e) {
      console.error('[DASHBOARD SUMMARY ERROR]', e)
      return res.status(500).json({
        success: false,
        message: 'Server xatosi: statistikani olishda muammo yuz berdi.',
      })
    }
  })
}

export default handler
