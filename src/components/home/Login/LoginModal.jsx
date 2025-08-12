import React from 'react'
import { Modal } from 'react-bootstrap'
import LoginForm from './LoginForm'

const LoginModal = ({ show, handleModal }) => {
  return (
    <Modal
      centered
      show={show}
      onHide={handleModal}
      className="loginModal"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title id="contained-modal-title-vcenter">
          Shaxsiy kabinet
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-3">Mavjud hisobingizni quyida kiring</p>
        <LoginForm onSuccess={handleModal} />
      </Modal.Body>
    </Modal>
  )
}

export default LoginModal
