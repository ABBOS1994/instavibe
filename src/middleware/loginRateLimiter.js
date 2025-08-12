// src/middleware/loginRateLimiter.js

const MAX_ATTEMPTS = 5
const BLOCK_TIME = 60 * 5 * 1000

const attemptsStore = new Map()

export const isBlocked = (ip) => {
  const data = attemptsStore.get(ip)
  if (!data) return false

  const { count, timestamp } = data
  const now = Date.now()

  if (now - timestamp > BLOCK_TIME) {
    attemptsStore.delete(ip)
    return false
  }

  return count >= MAX_ATTEMPTS
}

export const increaseAttempt = (ip) => {
  const now = Date.now()
  const data = attemptsStore.get(ip)

  if (!data) {
    attemptsStore.set(ip, { count: 1, timestamp: now })
  } else {
    const { count, timestamp } = data
    if (now - timestamp > BLOCK_TIME) {
      attemptsStore.set(ip, { count: 1, timestamp: now })
    } else {
      attemptsStore.set(ip, { count: count + 1, timestamp })
    }
  }
}

export const resetAttempts = (ip) => {
  attemptsStore.delete(ip)
}
