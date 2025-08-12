// src/pages/api/v4/logs.js
import UserLog from '../../../../models/UserLog'
import User from '../../../../models/User'
import jwt from 'jsonwebtoken'
import db from '../../../../config/db'

export default async function handler(req, res) {
  try {
    const {
      limit = 30,
      page = 1,
      sort = 'createdAt',
      order = 'desc',
      search = '',
      isAttack = '',
    } = req.query

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const sortOrder = order === 'asc' ? 1 : -1

    const filters = {}

    if (search) {
      filters.$or = [
        { ip: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { user: { $regex: search, $options: 'i' } },
      ]
    }

    if (isAttack === 'true') filters.isAttack = true
    if (isAttack === 'false') filters.isAttack = false

    let userInfo = null
    const authHeader = req.headers?.authorization || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.CACHE_PREFIX)
        await db()
        const user = await User.findById(decoded.userId)
          .select('login firstName lastName')
          .lean()

        if (user) {
          userInfo =
            `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
            user.login
        }
      } catch (e) {
        console.warn('[Token error]', e.message)
      }
    }

    const [topActions, topIps, totalLogs, recentLogs] = await Promise.all([
      UserLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { action: '$_id', count: 1, _id: 0 } },
      ]),
      UserLog.aggregate([
        { $group: { _id: '$ip', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { ip: '$_id', count: 1, _id: 0 } },
      ]),
      UserLog.countDocuments(filters),
      UserLog.find(filters)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
    ])

    return res.status(200).json({
      topActions,
      topIps,
      totalLogs,
      recentLogs,
      currentUser: userInfo,
    })
  } catch (e) {
    console.error('[LOGS SUMMARY ERROR]', e)
    return res.status(500).json({ message: 'Xatolik yuz berdi' })
  }
}
