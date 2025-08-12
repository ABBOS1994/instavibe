//src/components/component/LinkComponent
import React from 'react'
import Link from 'next/link'
import { Card, Col, Image, Row } from 'react-bootstrap'

const LinkComponent = ({
  data: { title, description, link, img, active = true },
}) => {
  return (
    <Col
      lg={6}
      md={12}
      sm={12}
      className={active ? ' demoLinkCard ' : ' demoLinkCard disabled '}
    >
      <Link href={link ? link : '#'} target={'_blank'}>
        <Card>
          <Row>
            <Col md={2} className="left">
              <Image src={img} alt={'icon'} />
            </Col>
            <Col md={10} className="right">
              <h6>{title}</h6>
              <p>{description}</p>
            </Col>
          </Row>
        </Card>
      </Link>
    </Col>
  )
}

export default LinkComponent
