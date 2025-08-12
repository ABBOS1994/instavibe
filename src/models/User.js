// src/models/User.js
import mongoose from 'mongoose'
import { ROLES } from '../constants/roles'

const schema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    login: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-Za-z0-9_]{3,30}$/,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      unique: false,
      default: null,
      sparse: true,
      required: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STANDARD,
    },
    curator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return [ROLES.STANDARD, ROLES.VIP, ROLES.PREMIUM].includes(this.role)
      },
    },
    telegramUsername: {
      type: String,
      default: null,
      sparse: true,
      unique: true,
      required: false,
    },

    telegramChatId: {
      type: String,
      default: null,
      sparse: true,
      unique: true,
      required: false,
    },
    notificationSettings: {
      telegram: Boolean,
      web: Boolean,
    },
    accessUntil: { type: Date, default: null },
    lastSeen: { type: Date, default: () => new Date() },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', schema)
