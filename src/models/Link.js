import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  img: { type: String, required: false },
  isActive: { type: Boolean, default: true },
})

const Link = mongoose.models.Link || mongoose.model('Link', schema)
export default Link
