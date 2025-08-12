// components/PrivateRoute.jsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loader from './ui/Loader'

const PrivateRoute = ({ children }) => {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [tokenExists, setTokenExists] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('Token')
    if (token) {
      setTokenExists(true)
    } else {
      router.replace('/')
    }
    setChecking(false)
  }, [router])

  if (checking) return <Loader />
  if (!tokenExists) return null

  return children
}

export default PrivateRoute
