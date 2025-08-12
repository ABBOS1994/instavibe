//src/constants/roles.js
export const ROLES = {
  ADMIN: 'admin',
  CURATOR: 'curator',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  VIP: 'vip',
}

export const ROLE_ACCESS_DURATION = {
  [ROLES.STANDARD]: 3,
  [ROLES.PREMIUM]: 6,
  [ROLES.VIP]: 12,
}
