// src/pages/api/v4/result/[id].js

import dbConnect from '../../../../config/db'
import Result from '../../../../models/Result'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  await dbConnect()
  const { id } = req.query
  const method = req.method

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      if (method === 'PUT') {
        const updated = await Result.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })

        if (!updated) {
          return res.status(404).json({
            success: false,
            message: 'Result topilmadi!',
          })
        }

        return res.status(200).json({ success: true, data: updated })
      }

      if (method === 'DELETE') {
        const deleted = await Result.findByIdAndDelete(id)

        if (!deleted) {
          return res.status(404).json({
            success: false,
            message: 'Result topilmadi!',
          })
        }

        return res.status(200).json({
          success: true,
          message: 'Result muvaffaqiyatli o‘chirildi!',
        })
      }

      return res.status(405).json({
        success: false,
        message: `Method ${method} qo‘llab-quvvatlanmaydi.`,
      })
    } catch (e) {
      console.error('[RESULT ID ERROR]', e)
      return res.status(500).json({
        success: false,
        message: e.message || 'Serverda noma’lum xatolik yuz berdi.',
        error: e,
      })
    }
  })
}

export default withLogging(handler)
