import React from 'react'
import Link from 'next/link'
import { Card, Col } from 'react-bootstrap'

const ModuleComponent = ({
  data: { title, description, isActive, _id },
  idx,
}) => {
  const renderCard = (linkUrl, isDisabled = false) => (
    <Col md={6} lg={4} sm={12} title={description} className="mb-4">
      <Link href={linkUrl} passHref legacyBehavior>
        <Card className={isDisabled ? 'disabled' : ''}>
          <Card.Img variant="top" src={`/img/${idx}.png`} />
          <Card.ImgOverlay>{idx + 1}</Card.ImgOverlay>
          <Card.Body>
            <Card.Text className="title">{title}</Card.Text>
            <Card.Text className="text">{description}</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  )

  return renderCard(isActive ? `/cabinet/${_id}` : '#', !isActive)
}

export default ModuleComponent
