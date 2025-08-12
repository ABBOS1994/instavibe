// pages/api/v4/push/user/[id].js
import dbConnect from '../../../../../config/db'
import PushLog from '../../../../../models/PushLog'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Faqat GET methodga ruxsat' })
  }

  const { id } = req.query
  await dbConnect()

  const logs = await PushLog.find({ userId: id }).sort({ sentAt: -1 }).lean()

  res.status(200).json(logs)
}
