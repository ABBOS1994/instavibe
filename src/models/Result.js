import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  telegram: { type: String, required: false },
  instagram: { type: String, required: false },
  youtube: { type: String, required: false },
  img: { type: String, required: false },
})

const Result = mongoose.models.Result || mongoose.model('Result', schema)

export default Result
