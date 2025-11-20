// src/models/User.js
import mongoose from 'mongoose'
import { ROLES } from '../constants/roles'

// src/models/User.js

async function dropOldIndexes() {
  const conn = mongoose.connection
  if (!conn?.collections?.users) return

  try {
    const indexes = await conn.collections.users.indexes()

    if (indexes.some((i) => i.name === 'telegramUsername_1')) {
      await conn.collections.users.dropIndex('telegramUsername_1')
    }

    if (indexes.some((i) => i.name === 'telegramChatId_1')) {
      await conn.collections.users.dropIndex('telegramChatId_1')
    }
  } catch (e) {
    console.log('Index drop skipped:', e.message)
  }
}

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
      type: [Number],
      default: [],
      index: true,
      required: function () {
        return isStudentRole(this.role)
      },
      validate: {
        validator: function (v) {
          const arr = Array.isArray(v)
            ? v
            : v === null || v === undefined
              ? []
              : [v]

          if (isPrivilegedRole(this.role)) {
            return arr.length === 0
          }

          if (!isStudentRole(this.role)) {
            return true
          }

          if (!arr.length) {
            return false
          }

          return arr.every((n) => Number.isInteger(n) && n >= 0)
        },
        message:
          'Rolga mos group qiymati noto‘g‘ri: admin/curator uchun bo‘sh; boshqalar uchun kamida bitta 0 yoki undan katta butun son bo‘lishi kerak.',
      },
      set: (val) => {
        if (val === null || val === undefined || val === '') return []
        let raw = val

        if (typeof raw === 'string') {
          raw = raw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        }

        if (!Array.isArray(raw)) {
          raw = [raw]
        }

        const nums = raw
          .map((v) => Number(v))
          .filter((n) => Number.isInteger(n) && n >= 0)

        return Array.from(new Set(nums)).sort((a, b) => a - b)
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
    },

    telegramChatId: {
      type: String,
      default: null,
    },

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
    this.group = []
  }
  next()
})

UserSchema.index(
  { telegramUsername: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { telegramUsername: { $exists: true, $ne: null } },
  }
)

UserSchema.index(
  { telegramChatId: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { telegramChatId: { $exists: true, $ne: null } },
  }
)

if (mongoose.models.User) {
  delete mongoose.models.User
}

dropOldIndexes()

export default mongoose.model('User', UserSchema)
