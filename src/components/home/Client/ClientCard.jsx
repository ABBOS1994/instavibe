// src/components/home/Client/ClientCard.jsx
import React from 'react'
import { Card, Col, Row, Image } from 'react-bootstrap'

const ClientCard = ({ content }) => {
  if (!content) return null

  const { title, img, description } = content

  return (
    <Card className="clientCard">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={3}>
            <Image src={img} alt={title} roundedCircle width={64} height={64} />
          </Col>
          <Col xs={9}>
            <Card.Title className="clientCardTitle">{title}</Card.Title>
            <Card.Text>{description}</Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default ClientCard
