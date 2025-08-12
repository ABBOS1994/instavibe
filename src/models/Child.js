import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    title: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sort: { type: Number, required: false, default: 0, increment: true },
  },
  { timestamps: true }
)

const Child = mongoose?.models?.Child || mongoose?.model('Child', schema)

export default Child
