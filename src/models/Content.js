// api/models/Content.js
import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.ObjectId, ref: 'Child', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, required: false },
    file: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)
const Content = mongoose?.models?.Content || mongoose?.model('Content', schema)
export default Content
