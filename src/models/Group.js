// src/models/Group.js
import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    code: { type: Number, required: true, unique: true, min: 0 },
  },
  { timestamps: true }
)

const Group = mongoose?.models?.Group || mongoose.model('Group', schema)
export default Group
