import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Col, Nav, Row } from 'react-bootstrap'
import Layout from '../Layout'
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

function AdminLayout({ children }) {
  const router = useRouter()
  const [role, setRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('Token')
    const decoded = token ? safeDecodeJwt(token) : null
    const rv =
      decoded?.role?.name || decoded?.role?._id || decoded?.role || null
    setRole(rv ? String(rv).toLowerCase() : null)
  }, [])

  const isAdmin = role === ROLES.ADMIN
  const isCurator = role === ROLES.CURATOR

  // Curatorga faqat shu pathlarga ruxsat:
  const curatorAllowed = useMemo(() => ['/admin', '/admin/user'], [])
  useEffect(() => {
    if (!role) return
    if (isCurator) {
      const pathname = router.pathname
      if (!curatorAllowed.includes(pathname)) {
        router.replace('/admin')
      }
    }
  }, [isCurator, role, router, curatorAllowed])

  // Menyu elementlari
  const MENU = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/user', label: 'Users' },
    { href: '/admin/content', label: 'Content', adminOnly: true },
    { href: '/admin/banner', label: 'Banner', adminOnly: true },
    { href: '/admin/link', label: 'Link', adminOnly: true },
    { href: '/admin/tariff', label: 'Tariff', adminOnly: true },
    { href: '/admin/client', label: 'Client', adminOnly: true },
    { href: '/admin/result', label: 'Result', adminOnly: true },
  ]

  const visibleMenu = MENU.filter((item) => {
    if (item.adminOnly) return isAdmin // faqat admin
    return isAdmin || isCurator // dashboard & users
  })

  // Agar admin ham, curator ham bo'lmasa — bu layoutga umuman kira olmaydi (backend ham to'sadi),
  // lekin xavfsizlik uchun / ga qaytaramiz.
  useEffect(() => {
    if (role && !(isAdmin || isCurator)) {
      router.replace('/')
    }
  }, [role, isAdmin, isCurator, router])

  return (
    <Layout>
      <section className="admin" data-bs-theme="dark">
        <Row>
          <Col sm={12}>
            <Nav
              variant="pills"
              className="flex-row justify-content-center mt-3"
            >
              {visibleMenu.map((item) => (
                <Nav.Item key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === item.href}
                      className="navTabBtn"
                    >
                      {item.label}
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>

          <Col sm={12} className="mt-4">
            {children}
          </Col>
        </Row>
      </section>
    </Layout>
  )
}

export default AdminLayout
