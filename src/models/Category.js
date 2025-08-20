import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    visibility: { type: [Number], default: [] },
    isActive: { type: Boolean, required: true, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true }
)

schema.index({ visibility: 1 })
schema.index({ isActive: 1, sort: 1 })

const Category =
  mongoose?.models?.Category || mongoose?.model('Category', schema)

export default Category
