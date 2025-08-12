import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import axiosInstance from '../../config/axiosConfig'
import { Success, Error } from '../../components/admin/Service'
import AdminLayout from '../../Layout/AdminLayout'

export default function Results() {
  const [results, setResults] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newResult, setNewResult] = useState({
    title: '',
    description: '',
    videoId: '',
    telegram: '',
    instagram: '',
    youtube: '',
    img: '',
  })
  const [editingResult, setEditingResult] = useState(null)

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get('result')
      setResults(data.data)
    } catch (e) {
      Error(e)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...newResult,
        img: newResult.img?.trim() || '',
      }
      await axiosInstance.post('result', payload)
      Success('Result qo‘shildi!')
      setShowModal(false)
      setNewResult({
        title: '',
        description: '',
        videoId: '',
        telegram: '',
        instagram: '',
        youtube: '',
        img: '',
      })
      getData()
    } catch (e) {
      Error(e)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...editingResult,
        img: editingResult.img?.trim() || '',
      }
      await axiosInstance.put(`result/${editingResult._id}`, payload)
      Success('Result yangilandi!')
      setEditingResult(null)
      getData()
    } catch (e) {
      Error(e)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`result/${id}`)
      Success('Result o‘chirildi!')
      getData()
    } catch (e) {
      Error(e)
    }
  }

  const getImagePreview = (videoId, img) => {
    if (img?.startsWith('http') && !img.includes('img.youtube.com')) return img
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  return (
    <AdminLayout>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>YouTube Preview</th>
            <th>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Add Result
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r._id}>
              <td>{r.title}</td>
              <td>{r.description}</td>
              <td>
                <img
                  src={getImagePreview(r.videoId, r.img)}
                  alt="preview"
                  style={{ width: 100 }}
                />
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => setEditingResult({ ...r })}
                >
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(r._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Add Result</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {[
              'title',
              'description',
              'videoId',
              'telegram',
              'instagram',
              'youtube',
              'img',
            ].map((field) => (
              <Form.Group key={field} className="mb-2">
                <Form.Label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={newResult[field]}
                  onChange={(e) =>
                    setNewResult({ ...newResult, [field]: e.target.value })
                  }
                />
              </Form.Group>
            ))}
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
      {editingResult && (
        <Modal show={true} onHide={() => setEditingResult(null)}>
          <Form onSubmit={handleUpdate}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {[
                'title',
                'description',
                'videoId',
                'telegram',
                'instagram',
                'youtube',
                'img',
              ].map((field) => (
                <Form.Group key={field} className="mb-2">
                  <Form.Label>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={editingResult[field] || ''}
                    onChange={(e) =>
                      setEditingResult({
                        ...editingResult,
                        [field]: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setEditingResult(null)}
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
