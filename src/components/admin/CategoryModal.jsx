// src/components/admin/CategoryModal.jsx
import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

export default function CategoryModal({
  showModal,
  handleClose,
  currentCategory,
  handleChange,
  handleSave,
  isEditing,
}) {
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
            <Form.Label column="lg">Sort raqami</Form.Label>
            <Form.Control
              type="number"
              name="sort"
              value={currentCategory?.sort || 0}
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
