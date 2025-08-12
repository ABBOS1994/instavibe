import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Col, Container, Nav, Row } from 'react-bootstrap'
import Layout from '../Layout'

function AdminLayout({ children }) {
  const router = useRouter()

  return (
    <Layout>
      <section className="admin" data-bs-theme="dark">
        <Container>
          <Row>
            <Col sm={12}>
              <Nav
                variant="pills"
                className="flex-row justify-content-center mt-3"
              >
                <Nav.Item>
                  <Link href="/admin" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === '/admin'}
                      className="navTabBtn"
                    >
                      Dashboard
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link href="/admin/user" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === '/admin/user'}
                      className="navTabBtn"
                    >
                      Users
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link href="/admin/content" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === '/admin/content'}
                      className="navTabBtn"
                    >
                      Content
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link href="/admin/banner" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === '/admin/banner'}
                      className="navTabBtn"
                    >
                      Banner
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link href="/admin/link" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === '/admin/link'}
                      className="navTabBtn"
                    >
                      Link
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link href="/admin/tariff" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === '/admin/tariff'}
                      className="navTabBtn"
                    >
                      Tariff
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link href="/admin/client" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === '/admin/client'}
                      className="navTabBtn"
                    >
                      Client
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link href="/admin/result" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === '/admin/result'}
                      className="navTabBtn"
                    >
                      Result
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col sm={12} className="mt-4">
              {children}
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}

export default AdminLayout
