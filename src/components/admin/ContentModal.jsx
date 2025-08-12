// components/home/ContentModal.jsx
import React from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'

export default function ContentModal({
  showContentModal,
  handleContentClose,
  currentContent,
  handleContentChange,
  handleContentSave,
  isEditingContent,
}) {
  return (
    <Modal show={showContentModal} onHide={handleContentClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditingContent ? 'Kontentni Tahrirlash' : "Yangi Kontent Qo'shish"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={12}>
              <Form.Group controlId="title" className="mb-3">
                <Form.Label column="lg">Sarlavha *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Kontent sarlavhasini kiriting"
                  value={currentContent?.title || ''}
                  onChange={handleContentChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label column="lg">Tavsif *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              placeholder="Kontent tavsifini kiriting"
              value={currentContent?.description || ''}
              onChange={handleContentChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group controlId="video" className="mb-3">
                <Form.Label column="lg">Video URL</Form.Label>
                <Form.Control
                  type="text"
                  name="video"
                  placeholder="Video havolasini kiriting"
                  value={currentContent?.video || ''}
                  onChange={handleContentChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="file" className="mb-3">
                <Form.Label column="lg">Fayl URL</Form.Label>
                <Form.Control
                  type="text"
                  name="file"
                  placeholder="Fayl havolasini kiriting"
                  value={currentContent?.file || ''}
                  onChange={handleContentChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleContentClose}>
          Bekor qilish
        </Button>
        <Button variant="primary" onClick={handleContentSave}>
          {isEditingContent ? 'Saqlash' : "Qo'shish"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
