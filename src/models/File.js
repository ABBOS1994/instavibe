import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  path: String,
  type: String,
  name: String,
  size: Number,
})

const File = mongoose.models.File || mongoose.model('File', schema)

export default File
