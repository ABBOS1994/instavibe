import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Container, Nav, Navbar, NavLink } from 'react-bootstrap'
import { useRouter } from 'next/router'
import LoginModal from './Login/LoginModal'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { Info, Warning } from '../admin/Service'
import { ROLES } from '../../constants/roles'

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

export default function NavBar() {
  const router = useRouter()

  const [showModal, setShowModal] = useState(false)
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null) // 'admin' | 'curator' | ...
  const [accessLeft, setAccessLeft] = useState('')

  const isAdmin = role === ROLES.ADMIN
  const isCurator = role === ROLES.CURATOR
  const showAdminPanel = isAdmin || isCurator

  const showCabinet = !!token

  const handleModal = () => setShowModal((prev) => !prev)

  const handleLogout = () => {
    localStorage.removeItem('Token')
    localStorage.removeItem('User')
    setToken(null)
    setRole(null)
    setAccessLeft('')
    Info('Sizni yana kutamiz!')
    setShowModal(false)
    router.push('/')
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('Token')
    const storedUser = localStorage.getItem('User')

    if (storedToken && storedUser) {
      setToken(storedToken)
      const decodedToken = safeDecodeJwt(storedToken)
      if (!decodedToken) {
        handleLogout()
        return
      }

      const accessUntil = decodedToken.accessUntil
      const roleValue =
        decodedToken.role?.name || decodedToken.role?._id || decodedToken.role

      if (accessUntil) {
        const untilDate = new Date(accessUntil)
        const now = new Date()

        if (untilDate < now) {
          handleLogout()
          Warning('Kirish muddati tugagan!')
          return
        } else {
          const formattedDate = format(untilDate, 'dd MMMM yyyy', {
            locale: uz,
          })
          setAccessLeft(`${formattedDate} gacha`)
        }
      }

      if (roleValue) setRole(String(roleValue).toLowerCase())
    }
  }, [router])

  return (
    <Navbar fixed="top" expand="sm" variant="dark" className="navBar">
      <Container>
        <Navbar.Brand
          as={Link}
          href="/"
          className="position-relative d-inline-block"
        >
          {token && accessLeft && (
            <span
              className="badge bg-danger position-absolute"
              style={{ top: '-10px', right: '-10px', fontSize: '0.7rem' }}
            >
              {accessLeft}
            </span>
          )}
          <Image src="/logo.svg" width={180} height={44} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            {showAdminPanel && (
              <NavLink
                href="/admin"
                active={router.pathname.startsWith('/admin')}
              >
                ADMIN PANEL&nbsp; ◦
              </NavLink>
            )}

            {showCabinet && (
              <NavLink href="/cabinet" active={router.pathname === '/cabinet'}>
                SHAXSIY KABINET
              </NavLink>
            )}

            <button
              className={token ? 'activeBtn' : 'brandBtn'}
              onClick={token ? handleLogout : handleModal}
            >
              {token ? 'CHIQISH' : 'KIRISH'}
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <LoginModal show={showModal} handleModal={handleModal} />
    </Navbar>
  )
}
