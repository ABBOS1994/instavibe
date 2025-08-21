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
  groups = [], // ← Group CRUD dan kelgan kodlar ro'yxati (masalan [0,1,2])
  viewerRole,
  viewerId,
}) {
  const ROLES_ARRAY = Array.isArray(ROLES) ? ROLES : Object.values(ROLES)
  const isTargetAdminOrCurator =
    formData.role === ROLES.ADMIN || formData.role === ROLES.CURATOR
  const isViewerCurator = viewerRole === ROLES.CURATOR

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
          next.group = null
        } else {
          if (isViewerCurator) {
            next.curator = viewerId || ''
          } else if (!prev.curator && curators.length > 0) {
            next.curator = curators[0]._id
          }
          // default group
          if (next.group === null || next.group === undefined) {
            next.group = groups?.[0] ?? 0
          }
        }
        return next
      })
      return
    }

    if (name === 'group') {
      const n = Number(value)
      setFormData((prev) => ({
        ...prev,
        group: Number.isInteger(n) && n >= 0 ? n : 0,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Modal ochilganda (yoki groups o'zgarganda) default guruhni tekshiramiz
  useEffect(() => {
    if (!show) return
    if (isTargetAdminOrCurator) return
    setFormData((prev) => {
      // agar mavjud group groups ro'yxatida yo'q bo'lsa, birinchisini yoki 0 ni qo'yamiz
      const has = prev.group === 0 || groups.includes(prev.group ?? NaN)
      return {
        ...prev,
        curator: isViewerCurator ? viewerId || prev.curator : prev.curator,
        group: has ? prev.group : (groups?.[0] ?? 0),
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, groups, isTargetAdminOrCurator, isViewerCurator, viewerId])

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

            {/* Admin bo'lsa kurator selectini ko'rsatmaymiz; curator ko'rishda esa o'zi avtomatik */}
            {!isTargetAdminOrCurator && !isViewerCurator && (
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

            {!isTargetAdminOrCurator && isViewerCurator && (
              <Col>
                <Form.Label column={'lg'}>Kurator</Form.Label>
                <Form.Control value="(O'zingiz)" disabled readOnly />
                <input type="hidden" name="curator" value={viewerId || ''} />
              </Col>
            )}
          </Row>

          {/* Oddiy userlar uchun group tanlovi (0/1/2...) */}
          {!isTargetAdminOrCurator && (
            <Row className="mb-2">
              <Col>
                <Form.Label column={'lg'}>Guruh</Form.Label>
                <Form.Select
                  name="group"
                  value={
                    formData.group === 0
                      ? 0
                      : (formData.group ?? groups?.[0] ?? 0)
                  }
                  onChange={handleChange}
                  required
                  disabled={groups.length === 0}
                >
                  {Array.isArray(groups) && groups.length > 0 ? (
                    groups.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))
                  ) : (
                    <option value="">Guruhlar mavjud emas</option>
                  )}
                </Form.Select>
                {groups.length === 0 && (
                  <Form.Text className="text-warning">
                    Guruhlar yo‘q — avval <b>Admin → Group</b> bo‘limida
                    qo‘shing.
                  </Form.Text>
                )}
              </Col>
            </Row>
          )}

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
