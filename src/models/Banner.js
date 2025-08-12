import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  text: { type: String, required: true },
  img: { type: String, required: false },
  isActive: { type: Boolean, default: true },
})

const Banner = mongoose.models.Banner || mongoose.model('Banner', schema)

export default Banner
