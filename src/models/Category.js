import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sort: { type: Number, required: false, default: 0, increment: true },
  },
  { timestamps: true }
)

const Category =
  mongoose?.models?.Category || mongoose?.model('Category', schema)

export default Category
