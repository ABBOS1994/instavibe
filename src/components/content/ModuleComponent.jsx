// src/components/content/ModuleComponent.jsx
import React from 'react'
import Link from 'next/link'
import { Card, Col } from 'react-bootstrap'

function toNumArray(val) {
  if (!val) return []
  if (Array.isArray(val)) {
    return val.map(Number).filter((n) => Number.isInteger(n) && n >= 0)
  }
  if (typeof val === 'string') {
    return val
      .split(/[,; ]+/)
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 0)
  }
  const n = Number(val)
  return Number.isInteger(n) && n >= 0 ? [n] : []
}

function isModuleDisabled(isActive, visibility, userGroups, isPrivileged) {
  const active = isActive !== false
  if (!active) return true
  if (isPrivileged) return false

  const vis = toNumArray(visibility)
  if (!vis.length) return true

  const allowed = toNumArray(userGroups)
  if (!allowed.length) return true

  return !vis.some((g) => allowed.includes(g))
}

const ModuleComponent = ({
  data: { title, description, isActive = true, _id, visibility = [] },
  idx,
  userGroups = [],
  isPrivileged = false,
}) => {
  const disabled = isModuleDisabled(
    isActive,
    visibility,
    userGroups,
    isPrivileged
  )

  const imgIndex = idx <= 12 ? idx : 12

  const linkUrl = disabled ? '#' : `/cabinet/${_id}`

  return (
    <Col md={6} lg={4} sm={12} title={description} className="mb-4">
      <Link href={linkUrl} passHref legacyBehavior>
        <Card className={disabled ? 'disabled' : ''}>
          <Card.Img variant="top" src={`/img/${imgIndex}.png`} />
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
