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
  groups = [],
  viewerRole,
  viewerId,
}) {
  const ROLES_ARRAY = Array.isArray(ROLES) ? ROLES : Object.values(ROLES)

  // Tahrirlanayotgan/yaratilayotgan USERning roli (target user)
  const isTargetAdminOrCurator =
    formData.role === ROLES.ADMIN || formData.role === ROLES.CURATOR

  // Joriy kirgan foydalanuvchi curatormi?
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
        // Target user admin/curator bo‘lsa — curator maydonini tozalaymiz
        if (newRole === ROLES.ADMIN || newRole === ROLES.CURATOR) {
          next.curator = ''
          next.group = null
        } else {
          // oddiy foydalanuvchi bo‘lsa
          // agar viewer curator bo‘lsa — majburan viewerId ni qo‘yamiz
          if (isViewerCurator) {
            next.curator = viewerId || ''
          } else if (!prev.curator && curators.length > 0) {
            next.curator = curators[0]._id
          }
          if (next.group === null || next.group === undefined) {
            next.group = 0
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
    // Modal ochilganda, agar target user oddiy bo‘lsa va viewer curator bo‘lsa — kuratorni viewerga o‘rnatamiz
    if (!isTargetAdminOrCurator) {
      setFormData((prev) => ({
        ...prev,
        curator: isViewerCurator ? viewerId || prev.curator : prev.curator,
        group: prev.group === null || prev.group === undefined ? 0 : prev.group,
      }))
    }
  }, [show, isTargetAdminOrCurator, isViewerCurator, viewerId, setFormData])

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

            {/* Kurator maydoni:
                - Target user admin/curator bo‘lsa: umuman ko‘rsatilmaydi
                - Target user oddiy bo‘lsa:
                   * Viewer CURATOR bo‘lsa — selectni ko‘rsatmaymiz, avtomatik viewerId
                   * Viewer ADMIN bo‘lsa — select ko‘rsatiladi */}
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
                {/* qiymat serverga borishi uchun hidden input */}
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
                >
                  {/* mavjudlar ro‘yxati */}
                  {Array.isArray(groups) && groups.length > 0 ? (
                    groups.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                    </>
                  )}
                </Form.Select>
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
