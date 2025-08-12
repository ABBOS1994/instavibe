// src/pages/admin/Link.jsx

import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import axiosInstance from '../../config/axiosConfig'
import { Success, Error } from '../../components/admin/Service'
import AdminLayout from '../../Layout/AdminLayout'

export default function Link() {
  const [links, setLinks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    img: '',
    isActive: true,
  })
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    getLinks()
  }, [])

  const getLinks = async () => {
    try {
      const { data } = await axiosInstance.get('/link')
      setLinks(data)
    } catch (err) {
      Error(err)
    }
  }

  const resetForm = () => {
    setShowModal(false)
    setEditing(null)
    setFormData({
      title: '',
      description: '',
      link: '',
      img: '',
      isActive: true,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const { data } = await axiosInstance.put(
          `/link/${editing._id}`,
          formData
        )
        setLinks(links.map((item) => (item._id === editing._id ? data : item)))
        Success('Havola yangilandi!')
      } else {
        const { data } = await axiosInstance.post('/link', formData)
        setLinks([...links, data])
        Success('Yangi havola qo‘shildi!')
      }
      resetForm()
    } catch (err) {
      Error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/link/${id}`)
      setLinks(links.filter((item) => item._id !== id))
      Success('Havola bazadan o‘chirildi!')
    } catch (err) {
      Error(err)
    }
  }

  return (
    <AdminLayout>
      <h4 className="mb-3">Havolalar ro‘yxati</h4>
      <div className="d-flex justify-content-end mb-2">
        <Button onClick={() => setShowModal(true)}>+ Yangi havola</Button>
      </div>
      <Table bordered striped hover responsive>
        <thead>
          <tr>
            <th>Nomi</th>
            <th>Tavsifi</th>
            <th>Havola</th>
            <th>Rasm</th>
            <th>Status</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {links.map((item) => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>
                <a href={item.link} target="_blank" rel="noreferrer">
                  Havolani ochish
                </a>
              </td>
              <td>
                {item.img ? (
                  <img src={item.img} width={50} alt="Rasm" />
                ) : (
                  'Yuq'
                )}
              </td>
              <td style={{ color: item.isActive ? 'green' : 'red' }}>
                {item.isActive ? 'Faol' : 'O‘chirilgan'}
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    setEditing(item)
                    setFormData(item)
                    setShowModal(true)
                  }}
                >
                  Tahrirlash
                </Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item._id)}
                >
                  O‘chirish
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal forma */}
      <Modal show={showModal} onHide={resetForm}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editing ? 'Havolani tahrirlash' : 'Yangi havola qo‘shish'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nomi</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tavsif</Form.Label>
              <Form.Control
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Havola (URL)</Form.Label>
              <Form.Control
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rasm (URL)</Form.Label>
              <Form.Control
                value={formData.img}
                onChange={(e) =>
                  setFormData({ ...formData, img: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                label="Faol"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              {editing ? 'Yangilash' : 'Qo‘shish'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </AdminLayout>
  )
}
