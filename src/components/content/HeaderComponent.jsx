import React from 'react'
// import Marquee from 'react-fast-marquee'
import { Col, Container, Row } from 'react-bootstrap'
// import Link from 'next/link'
// import Image from 'next/image'

const i = [
  '/img/dh1.png',
  '/img/dh2.png',
  '/img/dh3.png',
  '/img/dh4.png',
  '/img/dh5.png',
  '/img/dh6.png',
]

function Header() {
  return (
    <section className="demoSectionHeader">
      <Container>
        <Row>
          {/*<Col className="col-12 col-lg-4 col-md-4 col-sm-12 align-self-end">*/}
          {/*  <h1 className="title">*/}
          {/*    INSTAVIBE PLATFORMASIGA*/}
          {/*    <span> XUSH KELIBSIZ! </span>*/}
          {/*  </h1>*/}
          {/*  <button className="learn-more">*/}
          {/*    <span className="circle">*/}
          {/*      <Image src="/icon/rightHandPointing.svg" width={30} height={30} alt="right hand icon"/>*/}
          {/*    </span>*/}
          {/*    <Link href={'tel:+998900086686'} className="button-text">Bog'lanish</Link>*/}
          {/*  </button>*/}
          {/*</Col>*/}
          <Col className="d-md-block col-md-8 d-none">
            <Row>
              {/*<Col className="demoHeaderMarquee">*/}
              {/*  <Marquee direction="up" gradient gradientColor="black">*/}
              {/*    {i.map((r, n) => <Image key={n} width={285} height={400} src={r} alt="Demo Header Image"/>)}*/}
              {/*  </Marquee>*/}
              {/*</Col>*/}
              {/*<Col className="demoHeaderMarquee col-6">*/}
              {/*<Marquee direction="down" gradient gradientColor="black">*/}
              {/*  {i.map((r, n) => <Image key={n} width={285} height={400} src={r} alt="Demo Header Image"/>)}*/}
              {/*</Marquee>*/}
              {/*</Col>*/}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Header
