import dbConnect from '../../../../../config/db'
import PushLog from '../../../../../models/PushLog'
import { authGuard } from '../../../../../middleware/authGuard'

const handler = async (req, res) => {
  await dbConnect()
  const userId = req.user?._id || req.user?.userId
  if (!userId) return res.status(401).json([])

  const logs = await PushLog.find({ userId })
    .sort({ sentAt: -1 })
    .limit(20)
    .lean()

  res.status(200).json(logs)
}

export default authGuard()(handler)
