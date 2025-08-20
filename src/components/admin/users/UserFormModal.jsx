import React, { useEffect } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { ROLES } from '../../../constants/roles'

export default function UserFormModal({
  show,
  onHide,
  formData,
  setFormData,
  onSubmit,
  curators = [],
  editingId,
}) {
  const ROLES_ARRAY = Array.isArray(ROLES) ? ROLES : Object.values(ROLES)
  const isAdminOrCurator =
    formData.role === ROLES.ADMIN || formData.role === ROLES.CURATOR

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('notificationSettings.')) {
      const key = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        notificationSettings: {
          ...prev.notificationSettings,
          [key]: checked,
        },
      }))
      return
    }

    if (name === 'role') {
      const newRole = value
      setFormData((prev) => {
        const next = { ...prev, role: newRole }
        if (newRole === ROLES.ADMIN || newRole === ROLES.CURATOR) {
          next.curator = ''
        } else {
          if (!prev.curator && curators.length > 0) {
            next.curator = curators[0]._id
          }
        }
        return next
      })
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  useEffect(() => {
    if (!show) return
    if (!isAdminOrCurator && !formData.curator && curators.length > 0) {
      setFormData((prev) => ({ ...prev, curator: curators[0]._id }))
    }
  }, [show, isAdminOrCurator, curators, formData.curator, setFormData])

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editingId ? '✏️ Tahrirlash' : '➕ Yangi foydalanuvchi'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit} autoComplete="off">
        <Modal.Body>
          <Row className="mb-2">
            <Col>
              <Form.Label column={'lg'}>Ism</Form.Label>
              <Form.Control
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label column={'lg'}>Familiya</Form.Label>
              <Form.Control
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Label column={'lg'}>Login</Form.Label>
              <Form.Control
                name="login"
                value={formData.login}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label column={'lg'}>
                Parol (agar termasangiz generatsiya qilinadi)
                {editingId && <small> (o‘zgarmasa bo‘sh qoldiring)</small>}
              </Form.Label>
              <Form.Control
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                autoComplete="off"
                placeholder={editingId ? '********' : ''}
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Label column={'lg'}>Telefon</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+998901234567"
                autoComplete="off"
                required
              />
            </Col>
            <Col>
              <Form.Label column={'lg'}>Telegram @username</Form.Label>
              <Form.Control
                name="telegramUsername"
                value={formData.telegramUsername}
                onChange={handleChange}
                autoComplete="off"
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Label column={'lg'}>Roli</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                {ROLES_ARRAY.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {!isAdminOrCurator && (
              <Col>
                <Form.Label column={'lg'}>Kurator</Form.Label>
                <Form.Select
                  name="curator"
                  value={formData.curator || curators[0]?._id || ''}
                  onChange={handleChange}
                  required
                >
                  {curators.length === 0 ? (
                    <option value="">(Kurator yo‘q)</option>
                  ) : (
                    curators.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.firstName || c.login}
                      </option>
                    ))
                  )}
                </Form.Select>
              </Col>
            )}
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Label column={'lg'}>Muddati (accessUntil)</Form.Label>
              <Form.Control
                name="accessUntil"
                value={formData.accessUntil}
                onChange={handleChange}
                type="date"
              />
            </Col>
            <Col>
              <Form.Label column={'lg'}>Holati</Form.Label>
              <Form.Select
                name="isActive"
                value={formData.isActive ? '1' : '0'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.value === '1',
                  }))
                }
              >
                <option value="1">Aktiv</option>
                <option value="0">Bloklangan</option>
              </Form.Select>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Bekor
          </Button>
          <Button variant="primary" type="submit">
            {editingId ? 'Saqlash' : 'Qo‘shish'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
