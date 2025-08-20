import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Telegram } from '../../../../public/icon/Icons'

export default function PushMessageModal({
  show,
  onHide,
  pushMessage,
  setPushMessage,
  sending,
  onSend,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Telegram /> Xabar yuborish
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label column={'lg'}>Xabar matni</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={pushMessage}
            onChange={(e) => setPushMessage(e.target.value)}
            placeholder="Xabarni kiriting..."
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Bekor
        </Button>
        <Button variant="primary" onClick={onSend} disabled={sending}>
          {sending ? 'Yuborilmoqda...' : 'Yuborish'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
