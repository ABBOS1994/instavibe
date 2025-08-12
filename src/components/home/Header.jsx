import React from 'react'
import { Container } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'
import Link from 'next/link'

function Header() {
  return (
    <section className="headerSection">
      <Container>
        <h1>
          <span> 2 OY ICHIDA TIZIMLI VA DAROMADLI </span>
          SHAXSIY BRENDINGIZNI NOLDAN QURISHNI O'RGANING
        </h1>
        <button className="learn-more">
          <span className="circle">
            <Image src="/icon/rightHandPointing.svg" alt="right hand icon" />
          </span>
          <Link href={'http://t.me/instavibesupport'} className="button-text">
            Bog'lanish
          </Link>
        </button>
      </Container>
    </section>
  )
}

export default Header
