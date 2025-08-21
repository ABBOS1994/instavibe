import React from 'react'
import Link from 'next/link'
import { Card, Col } from 'react-bootstrap'

function toNumArray(arr) {
  if (!Array.isArray(arr)) return []
  return arr.map((x) => Number(x)).filter((n) => Number.isInteger(n) && n >= 0)
}
function isModuleDisabled(isActive, visibility, userGroup, isPrivileged) {
  if (!isActive) return true
  if (isPrivileged) return false
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
  isPrivileged = false,
}) => {
  const disabled = isModuleDisabled(
    isActive,
    visibility,
    userGroup,
    isPrivileged
  )
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
