import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    code: { type: Number, required: true, unique: true, index: true, min: 0 },
  },
  { timestamps: true }
)

schema.index({ code: 1 }, { unique: true })

const Group = mongoose?.models?.Group || mongoose.model('Group', schema)
export default Group
