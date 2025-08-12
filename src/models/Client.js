//models/Client.js
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
})

const Client = mongoose.models.Client || mongoose.model('Client', schema)

export default Client
