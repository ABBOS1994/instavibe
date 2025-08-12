// src/components/admins/Banner.jsx
import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import axiosInstance from '../../config/axiosConfig'
import AdminLayout from '../../Layout/AdminLayout'
import { Success, Error } from '../../components/admin/Service'

export default function Banner() {
  const [banners, setBanners] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({ text: '', isActive: true })

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get('banner')
      setBanners(data)
    } catch (e) {
      Error(e)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleShowModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({ text: banner.text, isActive: banner.isActive })
    } else {
      setEditingBanner(null)
      setFormData({ text: '', isActive: true })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingBanner(null)
    setFormData({ text: '', isActive: true })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBanner) {
        await axiosInstance.put(`banner/${editingBanner._id}`, formData)
        Success('Banner yangilandi!')
      } else {
        await axiosInstance.post('banner', formData)
        Success('Yangi banner qo‘shildi!')
      }
      getData()
      handleCloseModal()
    } catch (err) {
      Error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`banner/${id}`)
      Success("Banner bazadan o'chirildi!")
      getData()
    } catch (err) {
      Error(err)
    }
  }

  const toggleActive = async (banner) => {
    try {
      await axiosInstance.put(`banner/${banner._id}`, {
        isActive: !banner.isActive,
      })
      getData()
    } catch (err) {
      Error(err)
    }
  }

  return (
    <AdminLayout>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Matn</th>
            <th>Holat</th>
            <th>
              <Button variant="primary" onClick={() => handleShowModal()}>
                Yangi banner
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner, index) => (
            <tr key={banner._id}>
              <td>{index + 1}</td>
              <td>{banner.text}</td>
              <td>
                <Button
                  variant={banner.isActive ? 'success' : 'secondary'}
                  onClick={() => toggleActive(banner)}
                  size="sm"
                >
                  {banner.isActive ? 'Aktiv' : 'Noaktiv'}
                </Button>
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(banner)}
                  size="sm"
                >
                  Tahrirlash
                </Button>{' '}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(banner._id)}
                  size="sm"
                >
                  O‘chirish
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingBanner ? 'Bannerni tahrirlash' : 'Yangi banner'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Matn</Form.Label>
              <Form.Control
                name="text"
                type="text"
                value={formData.text}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="switch"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                label="Aktiv holatda"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Saqlash
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </AdminLayout>
  )
}
