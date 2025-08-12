import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Col, Container, Row } from 'react-bootstrap'

function NavBar() {
  const pathname = usePathname()

  return (
    <section className="footer">
      <Container>
        <Row>
          {pathname === '/' ? (
            <Col className="section">
              <h1>Savollaringiz qoldimi?</h1>
              <p>
                Menejerimiz bilan bog‘lanib, barcha savollaringizga javob
                olishingiz mumkin!
              </p>
              <Link
                href="http://t.me/instavibesupport"
                className="btn navTabBtn active" // Simplified button class names
              >
                BOG‘LANISH
              </Link>
            </Col>
          ) : (
            <Col className="section">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  width={180}
                  height={44}
                  alt="Logo"
                  priority
                />
              </Link>
              <p className="mt-4">
                © Instavibe - barcha huquqlar himoyalangan. Platforma
                ma’lumotlari mualliflik huquqiga ega.
              </p>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  )
}

export default NavBar
