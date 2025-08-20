import React from 'react'
import Link from 'next/link'
import { Card, Col } from 'react-bootstrap'

function toNumArray(arr) {
  if (!Array.isArray(arr)) return []
  return arr.map((x) => Number(x)).filter((n) => Number.isInteger(n) && n >= 0)
}

/**
 * Disabled mantiqi:
 * - isActive === false => disabled
 * - visibility bo'sh => hech kim ko'rmaydi => disabled
 * - userGroup raqam emas => disabled
 * - visibility ichida userGroup bo'lmasa => disabled
 */
function isModuleDisabled(isActive, visibility, userGroup) {
  if (!isActive) return true
  const vis = toNumArray(visibility)
  if (vis.length === 0) return true
  const g = Number(userGroup)
  if (!Number.isInteger(g)) return true
  return !vis.includes(g)
}

const ModuleComponent = ({
  data: { title, description, isActive, _id, visibility = [] },
  idx,
  userGroup,
}) => {
  const disabled = isModuleDisabled(isActive, visibility, userGroup)
  const linkUrl = disabled ? '#' : `/cabinet/${_id}`

  return (
    <Col md={6} lg={4} sm={12} title={description} className="mb-4">
      <Link href={linkUrl} passHref legacyBehavior>
        <Card className={disabled ? 'disabled' : ''}>
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
}

export default ModuleComponent
