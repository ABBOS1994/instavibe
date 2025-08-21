// src/models/User.js
import mongoose from 'mongoose'
import { ROLES } from '../constants/roles'

const isStudentRole = (role) =>
  [ROLES.STANDARD, ROLES.PREMIUM, ROLES.VIP].includes(role)

const isPrivilegedRole = (role) => [ROLES.ADMIN, ROLES.CURATOR].includes(role)

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    login: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-Za-z0-9_]{3,30}$/,
      trim: true,
    },

    password: { type: String, required: true, select: false },
    phone: { type: String, default: null, sparse: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STANDARD,
      index: true,
    },
    group: {
      type: Number,
      min: 0,
      default: null,
      index: true,

      required: function () {
        return isStudentRole(this.role)
      },

      validate: {
        validator: function (v) {
          if (isPrivilegedRole(this.role)) {
            return v === null || v === undefined
          }
          return Number.isInteger(v) && v >= 0
        },
        message:
          'Rolga mos group qiymati noto‘g‘ri: admin/curator uchun null; boshqalar uchun 0 yoki undan katta butun son bo‘lishi kerak.',
      },

      set: (val) => {
        if (val === null || val === undefined || val === '') return null
        const n = Number(val)
        if (Number.isInteger(n) && n >= 0) return n
        return val
      },
    },

    curator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return isStudentRole(this.role)
      },
      index: true,
    },

    telegramUsername: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    telegramChatId: { type: String, default: null, unique: true, sparse: true },

    notificationSettings: {
      telegram: { type: Boolean, default: false },
      web: { type: Boolean, default: false },
    },

    accessUntil: { type: Date, default: null },
    lastSeen: { type: Date, default: () => new Date() },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
)
UserSchema.pre('validate', function (next) {
  if (isPrivilegedRole(this.role)) {
    this.group = null
  }
  next()
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
