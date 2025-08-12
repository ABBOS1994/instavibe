// src/middleware/logMiddleware.js

import { UAParser } from 'ua-parser-js'
import detectAction from './detectAction'
import dbConnect from '../config/db'
import jwt from 'jsonwebtoken'
import { baseURL } from '../config/axiosConfig'

const withLogging = (handler) => async (req, res) => {
  await dbConnect().catch((err) =>
    console.error('Db ga ulanishda xatolik log yozishda: ', err.message)
  )
  const start = Date.now()
  try {
    const authHeader = req.headers?.authorization || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null

    if (token) {
      const decoded = jwt.verify(token, process.env.CACHE_PREFIX)
      const { default: User } = await import('../models/User')

      const user = await User.findById(decoded._id)
        .select('_id login role')
        .lean()

      if (user) {
        req.user = {
          _id: user._id,
          login: user.login,
          role: user.role,
        }

        User.updateOne({ _id: user._id }, { lastSeen: new Date() }).catch(
          (e) => {
            console.warn('[logMiddleware] lastSeen update error:', e.message)
          }
        )
      }
    }
  } catch (e) {
    console.warn('[logMiddleware] Token decode error:', e.message)
  }

  res.on('finish', () => {
    setImmediate(async () => {
      try {
        const action = detectAction(req)
        if (!action) return
        const { default: Log } = await import('../models/UserLog').catch(
          (e) => {
            console.warn('[logMiddleware] Log model import xatosi:', e.message)
            return { default: null }
          }
        )

        if (!Log) return

        const parser = new UAParser(req.headers['user-agent'] || '')
        const ip =
          req.headers['x-forwarded-for'] ||
          req.connection?.remoteAddress ||
          'unknown'
        const isLoginRequest = req.url.includes(baseURL + 'login')
        const fallbacklogin = isLoginRequest && req.body?.login

        const logData = {
          createdById: req.user?._id || null,
          user: req.user?.login || fallbacklogin || 'unknown',
          role: req.user?.role || 'guest',
          action,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime: Date.now() - start,
          ip,
          device: parser.getDevice()?.type || 'unknown',
          browser: parser.getBrowser()?.name || 'unknown',
          os: parser.getOS()?.name || 'unknown',
          userAgent: req.headers['user-agent'],
          header: req.headers,
          body: req.body || {},
          query: req.query || {},
          params: req.params || {},
          isAttack: false,
        }

        await Log.create(logData).catch((e) => {
          console.warn('[logMiddleware] Log yozishda xatolik:', e.message)
        })
      } catch (e) {
        console.warn('[logMiddleware] Umumiy log yozish xatosi:', e.message)
      }
    })
  })

  return handler(req, res)
}

export default withLogging
