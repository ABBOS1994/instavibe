//src/pages/admin/group
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../Layout/AdminLayout'
import axiosInstance from '../../config/axiosConfig'
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Spinner,
} from 'react-bootstrap'
import { Success, Error } from '../../components/admin/Service'

export default function GroupPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState(null) // {_id, code} | null
  const [code, setCode] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('group')
      setGroups(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      Error(e?.response?.data?.message || 'Gruppalarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setCode('')
    setShow(true)
  }

  const openEdit = (g) => {
    setEditing(g)
    setCode(String(g.code ?? ''))
    setShow(true)
  }

  const close = () => setShow(false)

  const save = async () => {
    const num = Number(code)
    if (!Number.isInteger(num) || num < 0) {
      return Error('Code 0 yoki musbat butun bo‘lsin')
    }
    try {
      if (editing) {
        const res = await axiosInstance.put(`group/${editing._id}`, {
          code: num,
        })
        setGroups((prev) =>
          prev.map((x) => (x._id === editing._id ? res.data : x))
        )
        Success('Guruh yangilandi')
      } else {
        const res = await axiosInstance.post('group', { code: num })
        setGroups((prev) => [...prev, res.data].sort((a, b) => a.code - b.code))
        Success('Guruh qo‘shildi')
      }
      setShow(false)
    } catch (e) {
      Error(e?.response?.data?.message || 'Saqlashda xatolik')
    }
  }

  const remove = async (id) => {
    if (!confirm('Haqiqatan o‘chirmoqchimisiz?')) return
    try {
      await axiosInstance.delete(`group/${id}`)
      setGroups((prev) => prev.filter((x) => x._id !== id))
      Success('O‘chirildi')
    } catch (e) {
      Error(e?.response?.data?.message || 'O‘chirishda xatolik')
    }
  }

  return (
    <AdminLayout>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Groups</h4>
        <Button onClick={openCreate}>➕ Add group</Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g, i) => (
                <tr key={g._id}>
                  <td>{i + 1}</td>
                  <td>{g.code}</td>
                  <td className="text-nowrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEdit(g)}
                    >
                      ✏️
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => remove(g._id)}
                    >
                      🗑
                    </Button>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted">
                    Hali group yo‘q
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={show} onHide={close} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit group' : 'Add group'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <InputGroup.Text>Code</InputGroup.Text>
            <Form.Control
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="masalan: 0, 1, 2, ..."
              min={0}
            />
          </InputGroup>
          <Form.Text className="text-muted">
            Raqam (0 yoki musbat butun). Foydalanuvchilar va kontent visibility
            shu code’lar bilan ishlaydi.
          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Bekor
          </Button>
          <Button variant="primary" onClick={save}>
            Saqlash
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  )
}
