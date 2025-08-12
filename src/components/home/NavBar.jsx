// src/components/layout/NavBar.jsx
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Container, Nav, Navbar, NavLink } from 'react-bootstrap'
import { useRouter } from 'next/router'
import LoginModal from './Login/LoginModal'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { Info, Warning } from '../admin/Service'

export default function NavBar() {
  const router = useRouter()

  const [showModal, setShowModal] = useState(false)
  const [token, setToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [accessLeft, setAccessLeft] = useState('')

  const handleModal = () => setShowModal((prev) => !prev)

  const handleLogout = () => {
    localStorage.removeItem('Token')
    localStorage.removeItem('User')
    setToken(null)
    setIsAdmin(false)
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

      try {
        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]))
        const accessUntil = decodedToken.accessUntil
        const roleId = decodedToken.role?._id || decodedToken.role

        if (accessUntil) {
          const untilDate = new Date(accessUntil)
          const now = new Date()

          if (untilDate < now) {
            handleLogout()
            Warning('Kirish muddati tugagan!')
          } else {
            const formattedDate = format(untilDate, 'dd MMMM yyyy', {
              locale: uz,
            })
            setAccessLeft(`${formattedDate} gacha`)
          }
        }

        if (
          roleId &&
          (roleId === 'admin' || decodedToken.role?.name === 'admin')
        ) {
          setIsAdmin(true)
        }
      } catch (err) {
        console.error('Token decoding error:', err)
        handleLogout()
      }
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
            {isAdmin && (
              <NavLink
                href="/admin"
                active={router.pathname.startsWith('/admin')}
              >
                ADMIN PANEL&nbsp; ◦
              </NavLink>
            )}

            <NavLink
              href={token ? '/cabinet' : ''}
              active={router.pathname === '/cabinet'}
            >
              {token && 'SHAXSIY KABINET'}
            </NavLink>

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
