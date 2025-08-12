// src/pages/api/v4/child/[id].js

import Model from '../../../../models/Child'
import Category from '../../../../models/Category'
import db from '../../../../config/db'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'
import { ROLES } from '../../../../constants/roles'

async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    return authGuard([ROLES.ADMIN, ROLES.CURATOR, ROLES.VIP, ROLES.STANDARD])(
      req,
      res,
      async () => {
        try {
          await db()
          const category = await Category.findById(id)
          if (!category) {
            return res.status(404).json({ message: 'Category topilmadi!' })
          }

          const children = await Model.find({ category: id }).sort({ sort: 1 })

          const childrenWithCategory = children.map((child) => ({
            ...child.toObject(),
            categoryTitle: category.title,
            categoryDescription: category.description,
            categorySort: category.sort,
          }))

          return res.status(200).json(childrenWithCategory)
        } catch (e) {
          console.error('[CHILD GET ERROR]', e)
          return res.status(500).json({
            message:
              e?.response?.data || e?.message || "Noma'lum xato yuz berdi",
          })
        }
      }
    )
  }

  return authGuard([ROLES.ADMIN])(req, res, async () => {
    try {
      switch (req.method) {
        case 'POST': {
          const newChild = new Model({
            ...req.body,
            category: id,
            createdBy: req.user._id,
          })
          await newChild.save()
          return res.status(201).json(newChild)
        }

        case 'PUT': {
          const updatedChild = await Model.findByIdAndUpdate(
            id,
            {
              ...req.body,
              updatedBy: req.user._id,
              updatedAt: new Date(),
            },
            { new: true }
          )

          if (!updatedChild) {
            return res.status(404).json({ message: "Ma'lumot topilmadi!" })
          }

          return res.status(200).json(updatedChild)
        }

        case 'DELETE': {
          const deletedChild = await Model.findByIdAndDelete(id)
          if (!deletedChild) {
            return res.status(404).json({ message: "Ma'lumot topilmadi!" })
          }

          return res.status(200).json(deletedChild)
        }

        default:
          return res.status(405).json({
            message: `Siz ${req.method} noto'g'ri methoddan foydalanyapsiz!`,
          })
      }
    } catch (e) {
      console.error('[CHILD ADMIN ERROR]', e)
      return res.status(500).json({
        message: e?.response?.data || e?.message || "Noma'lum xato yuz berdi",
      })
    }
  })
}

export default withLogging(handler)
