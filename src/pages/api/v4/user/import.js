import { IncomingForm } from 'formidable'
import fs from 'fs/promises'
import { parse } from 'csv-parse/sync'
import User from '../../../../models/User'
import { ROLES, ROLE_ACCESS_DURATION } from '../../../../constants/roles'
import withLogging from '../../../../middleware/logMiddleware'
import { authGuard } from '../../../../middleware/authGuard'

export const config = { api: { bodyParser: false } }

// === Normalizatsiya / Validatsiya ===
function normalizeLogin(login = '') {
  return login.trim().replace(/\s+/g, '')
}

function validateLogin(login = '') {
  const normalized = normalizeLogin(login)
  const isValid = /^[A-Za-z0-9_]{3,30}$/.test(normalized)
  return {
    isValid,
    normalized,
    error: isValid
      ? null
      : 'Login faqat harflar (A–Z, a–z), raqamlar va pastki chiziqdan iborat (3–30 belgi)',
  }
}

function normalizeTelegramUsername(username = '') {
  return username.replace(/^@/, '').toLowerCase()
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Xato!', success: false })
  }

  return authGuard([ROLES.ADMIN, ROLES.CURATOR])(req, res, async () => {
    try {
      const form = new IncomingForm({ keepExtensions: true })
      const { files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err)
          resolve({ fields, files })
        })
      })

      const file = files?.file
      const filePath = Array.isArray(file)
        ? file[0]?.filepath || file[0]?.path
        : file?.filepath || file?.path

      if (!filePath) {
        return res
          .status(400)
          .json({ message: 'CSV fayl topilmadi', success: false })
      }

      const content = await fs.readFile(filePath, 'utf-8')
      let records = []
      try {
        records = parse(content, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      } catch (e) {
        return res.status(400).json({
          message: 'CSV formatida xatolik',
          error: e.message,
          success: false,
        })
      }

      let successCount = 0
      const errors = []

      for (let i = 0; i < records.length; i++) {
        const line = i + 2
        const row = records[i]
        const {
          login,
          password,
          phone,
          telegramUsername,
          role,
          accessUntil,
          curator,
          firstName,
          lastName,
          isActive,
        } = row

        const {
          isValid,
          normalized: finalLogin,
          error: loginError,
        } = validateLogin(login)
        if (!isValid || !password?.trim()) {
          errors.push({
            line,
            login,
            reason: loginError || 'login va password majburiy',
          })
          continue
        }

        const finalPhone = phone?.trim() || undefined
        const finalUsername = telegramUsername
          ? normalizeTelegramUsername(telegramUsername)
          : undefined

        const duplicate = await User.findOne({
          $or: [
            { login: finalLogin },
            finalUsername ? { telegramUsername: finalUsername } : null,
          ].filter(Boolean),
        })
        if (duplicate) {
          errors.push({
            line,
            login: finalLogin,
            reason: 'login yoki telegramUsername allaqachon mavjud',
          })
          continue
        }

        // Kurator topish
        let curatorUser = null
        if (curator) {
          curatorUser = await User.findOne({
            $or: [
              { firstName: new RegExp('^' + curator + '$', 'i') },
              { login: new RegExp('^' + curator + '$', 'i') },
            ],
          }).select('_id')
        }
        if (!curatorUser) {
          curatorUser = await User.findOne({
            role: { $in: [ROLES.ADMIN, ROLES.CURATOR] },
          }).select('_id')
        }

        // Access muddati
        const normalizedRole = Object.values(ROLES).includes(
          (role || '').toLowerCase()
        )
          ? role.toLowerCase()
          : ROLES.STANDARD

        let accessDate = null
        if (accessUntil) {
          const parsed = new Date(accessUntil)
          accessDate = isNaN(parsed.getTime()) ? null : parsed
        } else {
          const months = ROLE_ACCESS_DURATION[normalizedRole] || 6
          const now = new Date()
          now.setMonth(now.getMonth() + months)
          accessDate = now
        }

        const activeFlag =
          typeof isActive === 'string'
            ? ['1', 'true', 'active', 'aktiv'].includes(isActive.toLowerCase())
            : true

        try {
          await User.create({
            login: finalLogin, // Case saqlanadi
            password: password.trim(),
            phone: finalPhone,
            telegramUsername: finalUsername,
            role: normalizedRole,
            curator: curatorUser?._id || null,
            accessUntil: accessDate,
            firstName: firstName?.trim() || '',
            lastName: lastName?.trim() || '',
            isActive: activeFlag,
          })
          successCount++
        } catch (e) {
          errors.push({ line, login: finalLogin, reason: e.message })
        }
      }

      return res.status(200).json({
        message: `Import yakunlandi: ${successCount} ta muvaffaqiyatli, ${errors.length} ta xato.`,
        imported: successCount,
        errors,
        success: true,
      })
    } catch (err) {
      console.error('[IMPORT ERROR]', err)
      return res.status(500).json({
        message: 'Server xatoligi',
        error: err.message,
        success: false,
      })
    }
  })
}

export default withLogging(handler)
