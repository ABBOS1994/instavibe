// models/Tariff.js
import mongoose from 'mongoose'

const featureSchema = new mongoose.Schema({
  text: { type: String, required: true },
  highlight: { type: Boolean, default: false },
})

const tariffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    level: { type: Number, required: true },
    features: [featureSchema],
  },
  { timestamps: true }
)

export default mongoose.models.Tariff || mongoose.model('Tariff', tariffSchema)
