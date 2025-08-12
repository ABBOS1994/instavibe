// src/models/PushLog.js

import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ['telegram', 'web', 'platform'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageId: {
      type: String,
    },
    success: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

schema.index({ userId: 1, channel: 1, message: 1 }, { unique: true })

export default mongoose.models.PushLog || mongoose.model('PushLog', schema)
