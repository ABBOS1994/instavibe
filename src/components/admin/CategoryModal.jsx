// src/components/admin/CategoryModal.jsx
import React, { useMemo } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

export default function CategoryModal({
  showModal,
  handleClose,
  currentCategory,
  handleChange,
  handleSave,
  isEditing,
}) {
  const visibilityCsv = useMemo(() => {
    const arr = Array.isArray(currentCategory?.visibility)
      ? currentCategory.visibility
      : []
    return arr.join(',')
  }, [currentCategory?.visibility])

  const onVisibilityChange = (e) => {
    const raw = e.target.value || ''
    const nums = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => Number(s))
      .filter((n) => Number.isInteger(n) && n >= 0)
    handleChange({
      target: {
        name: 'visibility',
        value: nums,
        type: 'text',
      },
    })
  }

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? 'Kategoriya tahrirlash' : 'Yangi kategoriya'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label column="lg">Nomi</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={currentCategory?.title || ''}
              onChange={handleChange}
              placeholder="Kategoriya nomi"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column="lg">Tavsif</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={currentCategory?.description || ''}
              onChange={handleChange}
              placeholder="Kategoriya tavsifi"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column="lg">
              Ko‘rinadigan guruhlar (masalan: <code>0,1,2</code>)
            </Form.Label>
            <Form.Control
              type="text"
              value={visibilityCsv}
              onChange={onVisibilityChange}
              placeholder="Masalan: 0,1,2"
            />
            <Form.Text>
              Bo‘sh qoldirilsa, hech kim ko‘rmaydi (disabled).
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column="lg">Sort raqami</Form.Label>
            <Form.Control
              type="number"
              name="sort"
              value={currentCategory?.sort ?? 0}
              onChange={handleChange}
              placeholder="Sort"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              name="isActive"
              checked={currentCategory?.isActive ?? true}
              onChange={handleChange}
              label="Aktiv holatda"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Bekor qilish
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Saqlash
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
