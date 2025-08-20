// src/components/admin/ChildModal.jsx
import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

export default function ChildModal({
  showChildModal,
  handleChildClose,
  currentChild,
  handleChildChange,
  handleChildSave,
  isEditingChild,
}) {
  const visibilityValue = Array.isArray(currentChild?.visibility)
    ? currentChild.visibility.join(', ')
    : currentChild?.visibility || ''

  const onVisibilityChange = (e) => {
    handleChildChange({
      target: { name: 'visibility', value: e.target.value, type: 'text' },
    })
  }

  return (
    <Modal show={showChildModal} onHide={handleChildClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditingChild ? 'Edit Child' : 'Add New Child'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="sort" className="mb-3">
            <Form.Label column="lg">Sort</Form.Label>
            <Form.Control
              type="number"
              name="sort"
              value={currentChild?.sort ?? 0}
              onChange={handleChildChange}
            />
          </Form.Group>

          <Form.Group controlId="title" className="mb-3">
            <Form.Label column="lg">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={currentChild?.title || ''}
              onChange={handleChildChange}
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label column="lg">Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={currentChild?.description || ''}
              onChange={handleChildChange}
            />
          </Form.Group>

          <Form.Group controlId="visibility" className="mb-3">
            <Form.Label column="lg">Guruhlar (vergul bilan)</Form.Label>
            <Form.Control
              type="text"
              placeholder="masalan: 0,1,2"
              value={visibilityValue}
              onChange={onVisibilityChange}
            />
            <Form.Text className="text-muted">
              Bo‘sh — hech kim ko‘rmaydi. Raqamlar ro‘yxati — faqat o‘sha
              guruhlar ko‘radi.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleChildClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleChildSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
