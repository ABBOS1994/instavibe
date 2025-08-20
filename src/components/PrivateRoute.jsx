// components/PrivateRoute.jsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loader from './ui/Loader'
import { ROLES } from '../constants/roles'

function safeDecodeJwt(token) {
  try {
    const base = token.split('.')[1]
    const b64 = base.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

const PrivateRoute = ({ children }) => {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('Token')
    if (!token) {
      router.replace('/')
      return
    }

    const decoded = safeDecodeJwt(token)
    if (!decoded) {
      localStorage.removeItem('Token')
      localStorage.removeItem('User')
      router.replace('/')
      return
    }

    const role = decoded?.role || null
    const roleStr = role ? String(role).toLowerCase() : ''

    if (roleStr === ROLES.CURATOR) {
      router.replace('/admin')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return <Loader />
  return children
}

export default PrivateRoute
