// src/models/UserLog.js
import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    user: { type: String },
    action: { type: String, required: true },
    method: { type: String },
    url: { type: String },
    statusCode: { type: Number },
    responseTime: { type: Number },
    isAttack: { type: Boolean, default: false },
    ip: { type: String },
    device: { type: String },
    browser: { type: String },
    os: { type: String },
    userAgent: { type: String },
    header: { type: mongoose.Schema.Types.Mixed },
    body: { type: mongoose.Schema.Types.Mixed },
    query: { type: mongoose.Schema.Types.Mixed },
    params: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default mongoose.models.UserLog || mongoose.model('UserLog', schema)
