// src/pages/admin/Tariffs.jsx

import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import axiosInstance from '../../config/axiosConfig'
import { Success, Error } from '../../components/admin/Service'
import AdminLayout from '../../Layout/AdminLayout'

export default function Tariffs() {
  const [tariffs, setTariffs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newTariff, setNewTariff] = useState({
    name: '',
    level: 1,
    features: [],
  })
  const [featureInput, setFeatureInput] = useState({
    text: '',
    highlight: false,
  })
  const [editingTariff, setEditingTariff] = useState(null)

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get('tariff')
      setTariffs(data)
    } catch (e) {
      Error(e)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleAddTariff = async (e) => {
    e.preventDefault()
    if (!newTariff.name || newTariff.features.length === 0) {
      return Error(
        'Barcha maydonlarni to‘ldiring va kamida 1 feature kiriting.'
      )
    }

    try {
      await axiosInstance.post('tariff', newTariff)
      getData()
      setShowModal(false)
      setNewTariff({ name: '', level: 1, features: [] })
      setFeatureInput({ text: '', highlight: false })
      Success('Tarif qo‘shildi!')
    } catch (error) {
      Error(error)
    }
  }

  const handleUpdateTariff = async (e) => {
    e.preventDefault()
    if (!editingTariff.name || editingTariff.features.length === 0) {
      return Error('Barcha maydonlar va kamida 1 feature bo‘lishi shart!')
    }

    try {
      await axiosInstance.put(`tariff/${editingTariff._id}`, editingTariff)
      getData()
      setEditingTariff(null)
      setFeatureInput({ text: '', highlight: false })
      Success('Tarif yangilandi!')
    } catch (error) {
      Error(error)
    }
  }

  const handleDeleteTariff = async (id) => {
    try {
      await axiosInstance.delete(`tariff/${id}`)
      getData()
      Success('Tarif o‘chirildi!')
    } catch (error) {
      Error(error)
    }
  }

  const addFeature = () => {
    if (!featureInput.text.trim()) return
    setNewTariff({
      ...newTariff,
      features: [...newTariff.features, featureInput],
    })
    setFeatureInput({ text: '', highlight: false })
  }

  const addFeatureToEdit = () => {
    if (!featureInput.text.trim()) return
    setEditingTariff({
      ...editingTariff,
      features: [...editingTariff.features, featureInput],
    })
    setFeatureInput({ text: '', highlight: false })
  }

  const removeFeatureFromNew = (index) => {
    const updated = [...newTariff.features]
    updated.splice(index, 1)
    setNewTariff({ ...newTariff, features: updated })
  }

  const removeFeatureFromEdit = (index) => {
    const updated = [...editingTariff.features]
    updated.splice(index, 1)
    setEditingTariff({ ...editingTariff, features: updated })
  }

  return (
    <AdminLayout>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nomi</th>
            <th>Level</th>
            <th>Featurelar soni</th>
            <th>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Add Tariff
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {tariffs?.map((tariff) => (
            <tr key={tariff._id}>
              <td>{tariff.name}</td>
              <td>{tariff.level}</td>
              <td>{tariff.features.length}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    setEditingTariff({ ...tariff })
                    setFeatureInput({ text: '', highlight: false })
                  }}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteTariff(tariff._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleAddTariff}>
          <Modal.Header closeButton>
            <Modal.Title>Add Tariff</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Nomi</Form.Label>
              <Form.Control
                type="text"
                value={newTariff.name}
                onChange={(e) =>
                  setNewTariff({ ...newTariff, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Level (1–4)</Form.Label>
              <Form.Control
                type="number"
                value={newTariff.level}
                onChange={(e) =>
                  setNewTariff({ ...newTariff, level: Number(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Feature qo‘shish</Form.Label>
              <Form.Control
                type="text"
                value={featureInput.text}
                onChange={(e) =>
                  setFeatureInput({ ...featureInput, text: e.target.value })
                }
              />
              <Form.Check
                type="checkbox"
                label="BrandColor (ajratish)"
                checked={featureInput.highlight}
                onChange={(e) =>
                  setFeatureInput({
                    ...featureInput,
                    highlight: e.target.checked,
                  })
                }
              />
              <Button variant="success" className="mt-2" onClick={addFeature}>
                Qo‘shish
              </Button>
            </Form.Group>
            <ul className="mt-2">
              {newTariff.features.map((f, idx) => (
                <li key={idx}>
                  {f.text} {f.highlight && '(ajratilgan)'}{' '}
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeFeatureFromNew(idx)}
                  >
                    x
                  </Button>
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Tariff
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      {editingTariff && (
        <Modal show={true} onHide={() => setEditingTariff(null)}>
          <Form onSubmit={handleUpdateTariff}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Tariff</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Nomi</Form.Label>
                <Form.Control
                  type="text"
                  value={editingTariff.name}
                  onChange={(e) =>
                    setEditingTariff({ ...editingTariff, name: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Level</Form.Label>
                <Form.Control
                  type="number"
                  value={editingTariff.level}
                  onChange={(e) =>
                    setEditingTariff({
                      ...editingTariff,
                      level: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Yangi feature qo‘shish</Form.Label>
                <Form.Control
                  type="text"
                  value={featureInput.text}
                  onChange={(e) =>
                    setFeatureInput({ ...featureInput, text: e.target.value })
                  }
                />
                <Form.Check
                  type="checkbox"
                  label="BrandColor (ajratish)"
                  checked={featureInput.highlight}
                  onChange={(e) =>
                    setFeatureInput({
                      ...featureInput,
                      highlight: e.target.checked,
                    })
                  }
                />
                <Button
                  variant="success"
                  className="mt-2"
                  onClick={addFeatureToEdit}
                >
                  Qo‘shish
                </Button>
              </Form.Group>
              <ul className="mt-2">
                {editingTariff.features.map((f, idx) => (
                  <li key={idx}>
                    {f.text} {f.highlight && '(ajratilgan)'}{' '}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => removeFeatureFromEdit(idx)}
                    >
                      x
                    </Button>
                  </li>
                ))}
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setEditingTariff(null)}
              >
                Close
              </Button>
              <Button variant="primary" type="submit">
                Update Tariff
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </AdminLayout>
  )
}
