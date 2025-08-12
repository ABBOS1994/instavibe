// middleware.js
import { NextResponse } from 'next/server'
import { UAParser } from 'ua-parser-js'
import dbConnect from './src/config/db'

export async function middleware(req) {
  const url = req.nextUrl.pathname
  const method = req.method

  const isApiRoute = url.startsWith('/api')

  if (isApiRoute && method === 'GET') {
    return NextResponse.next()
  }

  await dbConnect()
  const { default: Log } = await import('./src/models/UserLog.js')

  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown'
  const userAgent = req.headers.get('user-agent') || ''
  const parser = new UAParser(userAgent)

  const now = Date.now()
  const oneMinuteAgo = new Date(now - 60 * 1000)
  const recentLogsFromIp = await Log.countDocuments({
    ip,
    createdAt: { $gte: oneMinuteAgo },
  })

  const isAttack = recentLogsFromIp >= 10

  const log = {
    method,
    url,
    ip,
    isAttack,
    device: parser.getDevice().type || 'desktop',
    browser: parser.getBrowser().name || 'unknown',
    os: parser.getOS().name || 'unknown',
    userAgent,
    createdAt: new Date(),
  }

  await Log.create(log)

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
