import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  number: { type: Number, required: true, min: 0, unique: true, index: true },
})

const Group = mongoose.models.Group || mongoose.model('Group', schema)
export default Group
