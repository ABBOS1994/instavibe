export function normalizeTelegramUsername(username = '') {
  return username.replace(/^@/, '').toLowerCase()
}

// Login endi pastga aylantirilmaydi — faqat trim + ichki bo‘shliqlarni olib tashlash
export function normalizeLogin(login = '') {
  return login.trim().replace(/\s+/g, '')
}

export function validateLogin(login = '') {
  const normalized = normalizeLogin(login)
  const isValid = /^[A-Za-z0-9_]{3,30}$/.test(normalized)
  return {
    isValid,
    normalized,
    error: isValid
      ? null
      : 'Login faqat harflar (A–Z, a–z), raqamlar va pastki chiziqdan iborat bo‘lishi kerak (3–30 belgi).',
  }
}
