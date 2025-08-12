import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import axiosInstance from '../../config/axiosConfig'
import { Success, Error } from '../../components/admin/Service'
import AdminLayout from '../../Layout/AdminLayout'

export default function Client() {
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState({
    title: '',
    description: '',
    img: '',
  })
  const [editingClient, setEditingClient] = useState(null)

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get('client')
      console.log(data)
      setClients(data)
    } catch (e) {
      Error(e)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleAddClient = async (e) => {
    e.preventDefault()
    if (!newClient.title || !newClient.description || !newClient.img) {
      return Error('Barcha maydonlarni to‘ldiring!')
    }
    try {
      await axiosInstance.post('client', newClient)
      getData()
      setShowModal(false)
      setNewClient({ title: '', description: '', img: '' })
      Success('Mijoz muvaffaqiyatli qo‘shildi!')
    } catch (error) {
      Error(error)
    }
  }

  const handleUpdateClient = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.put(`client/${editingClient._id}`, editingClient)
      getData()
      setEditingClient(null)
      Success('Mijoz muvaffaqiyatli yangilandi!')
    } catch (error) {
      Error(error)
    }
  }

  const handleDeleteClient = async (id) => {
    try {
      await axiosInstance.delete(`client/${id}`)
      getData()
      Success('Mijoz muvaffaqiyatli o‘chirildi!')
    } catch (error) {
      Error(error)
    }
  }

  return (
    <AdminLayout>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sarlavha</th>
            <th>Tavsif</th>
            <th>Rasm</th>
            <th>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Add Client
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>
              <td>{client.title}</td>
              <td>{client.description}</td>
              <td>
                <img src={client.img} alt="client" style={{ width: '50px' }} />
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => setEditingClient({ ...client })}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClient(client._id)}
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
        <Form onSubmit={handleAddClient}>
          <Modal.Header closeButton>
            <Modal.Title>Add Client</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Sarlavha</Form.Label>
              <Form.Control
                type="text"
                value={newClient.title}
                onChange={(e) =>
                  setNewClient({ ...newClient, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tavsif</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newClient.description}
                onChange={(e) =>
                  setNewClient({ ...newClient, description: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rasm (URL)</Form.Label>
              <Form.Control
                type="text"
                value={newClient.img}
                onChange={(e) =>
                  setNewClient({ ...newClient, img: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      {editingClient && (
        <Modal show={true} onHide={() => setEditingClient(null)}>
          <Form onSubmit={handleUpdateClient}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Client</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Sarlavha</Form.Label>
                <Form.Control
                  type="text"
                  value={editingClient.title}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tavsif</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingClient.description}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Rasm (URL)</Form.Label>
                <Form.Control
                  type="text"
                  value={editingClient.img}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, img: e.target.value })
                  }
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setEditingClient(null)}
              >
                Close
              </Button>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </AdminLayout>
  )
}
