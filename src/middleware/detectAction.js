//middleware/detectAction
export default function detectAction(req) {
  const { method, url } = req

  if (
    method === 'GET' ||
    method === 'OPTIONS' ||
    url.includes('/_next') ||
    url.includes('/favicon.ico') ||
    url.includes('/api/logs')
  ) {
    return null
  }

  const rules = [
    { base: '/login', map: { POST: 'login_attempt' } },
    { base: '/logout', map: { GET: 'logout' } },
    { base: '/register', map: { POST: 'register' } },
    {
      base: '/user',
      map: { POST: 'create_user', PUT: 'update_user', DELETE: 'delete_user' },
    },
    {
      base: '/role',
      map: { POST: 'create_role', PUT: 'update_role', DELETE: 'delete_role' },
    },
    { base: '/cabinet', map: { POST: 'access_cabinet' } },
    {
      base: '/result',
      map: {
        POST: 'create_result',
        PUT: 'update_result',
        DELETE: 'delete_result',
      },
    },
    {
      base: '/client',
      map: {
        POST: 'create_client',
        PUT: 'update_client',
        DELETE: 'delete_client',
      },
    },
    {
      base: '/link',
      map: { POST: 'create_link', PUT: 'update_link', DELETE: 'delete_link' },
    },
    {
      base: '/content',
      map: {
        POST: 'create_content',
        PUT: 'update_content',
        DELETE: 'delete_content',
      },
    },
    {
      base: '/child',
      map: {
        POST: 'create_child',
        PUT: 'update_child',
        DELETE: 'delete_child',
      },
    },
    {
      base: '/category',
      map: {
        POST: 'create_category',
        PUT: 'update_category',
        DELETE: 'delete_category',
      },
    },
    {
      base: '/banner',
      map: {
        POST: 'create_banner',
        PUT: 'update_banner',
        DELETE: 'delete_banner',
      },
    },
  ]

  for (const rule of rules) {
    if (url.startsWith(rule.base) && rule.map[method]) {
      return rule.map[method]
    }
  }

  return `${method.toLowerCase()} ${url.split('?')[0]}`
}
