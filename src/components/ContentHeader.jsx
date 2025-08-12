import React from 'react'
import Image from 'react-bootstrap/Image'
import { Col, Row, Container } from 'react-bootstrap'
import Link from 'next/link'

export default function ContentHeader() {
  return (
    <section className="marqueeContentHeader">
      <Container>
        <Row>
          <Col md={6} className="left">
            <h1 className="title">
              INSTAVIBE PLATFORMASIGA
              <div className="child"> XUSH KELIBSIZ! </div>
            </h1>
            <button className="learn-more">
              <span className="circle">
                <Image
                  src="/icon/rightHandPointing.svg"
                  width={30}
                  height={30}
                  alt="right hand icon"
                />
              </span>
              <Link href="http://t.me/instavibesupport" className="button-text">
                Bog'lanish
              </Link>
            </button>
          </Col>
          <Col md={6} className="right">
            <Image src={'/img/contentHeaderImage.png'} alt={'img'} />
          </Col>
        </Row>
      </Container>
    </section>
  )
}
