import React from 'react'
import { Row, Col, Card, Image } from 'react-bootstrap'
import SectionLayout from '../../Layout/SectionLayout'

function Tariff({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null

  return (
    <SectionLayout
      className="tariff"
      text="KURS TARIFLARI"
      description="IMKONIYATLAR"
    >
      <Row>
        {data.map((tariff, idx) => (
          <Col md={4} sm={12} key={idx}>
            <Card className="mb-4">
              <Card.Header>
                <Image alt="icon" src={`/icon/t${(idx % 4) + 1}.svg`} />
                <div className="vr" />
                <span>{tariff.name}</span>
              </Card.Header>
              <Card.Body>
                <ul>
                  {tariff.features?.map((item, i) => (
                    <li key={i} className={item?.highlight ? 'brandColor' : ''}>
                      {item?.text}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </SectionLayout>
  )
}

export default Tariff
