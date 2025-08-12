import { useEffect, useState, useCallback } from 'react'
import AdminLayout from '../Layout/AdminLayout'
import axiosInstance from '../config/axiosConfig'
import DataTable from 'react-data-table-component'
import { Modal, Button, Form } from 'react-bootstrap'
import { Success, Warning, Error } from './admin/Service'
import PushLogModal from './admin/PushLogModal'

export default function PushPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selected, setSelected] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [logModalUser, setLogModalUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const openLogModal = (user) => setLogModalUser(user)
  const closeLogModal = () => setLogModalUser(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('user/list')
        setUsers(res.data || [])
        setFilteredUsers(res.data || [])
      } catch (err) {
        console.error('❌ Foydalanuvchilarni olishda xatolik:', err)
        Error('❌ Foydalanuvchilarni olishda muammo yuz berdi')
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = users.filter(
      (u) =>
        u.login?.toLowerCase().includes(term) ||
        u.firstName?.toLowerCase().includes(term) ||
        u.lastName?.toLowerCase().includes(term) ||
        u.phone?.toLowerCase().includes(term) ||
        u.telegramUsername?.toLowerCase().includes(term)
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const toggleSelect = useCallback((row) => {
    setSelected((prevSelected) =>
      prevSelected.includes(row)
        ? prevSelected.filter((u) => u !== row)
        : [...prevSelected, row]
    )
  }, [])

  const toggleSelectAll = useCallback(() => {
    setSelected((prevSelected) =>
      prevSelected.length === filteredUsers.length ? [] : filteredUsers
    )
  }, [filteredUsers])

  const handleSend = async () => {
    if (!message || selected.length === 0) {
      Warning('⚠️ Xabar matni yoki foydalanuvchi tanlanmagan')
      return
    }

    setLoading(true)
    try {
      const res = await axiosInstance.post('push/send', {
        userIds: selected.map((u) => u._id),
        message,
        type: 'telegram', // faqat telegram yuboriladi
      })

      Success('✅ Push yuborildi')
      console.log('Push result:', res.data.results)

      setShowModal(false)
      setMessage('')
      setSelected([])
    } catch (err) {
      console.error('❌ Push yuborishda xatolik:', err)
      Error('❌ Xabar yuborishda xatolik yuz berdi')
    }
    setLoading(false)
  }

  const columns = [
    {
      name: (
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={toggleSelectAll}
            checked={
              selected.length === filteredUsers.length &&
              filteredUsers.length > 0
            }
          />
        </div>
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selected.includes(row)}
          onChange={() => toggleSelect(row)}
        />
      ),
      width: '60px',
    },
    {
      name: 'Login',
      selector: (row) => row.firstName || row.login || row.lastName,
      sortable: true,
      cell: (row) => (
        <span
          onClick={() => openLogModal(row)}
          style={{ cursor: 'pointer', color: '#c3ff51' }}
        >
          {row.login}
        </span>
      ),
    },
    {
      name: 'Ism',
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: 'Familiya',
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: 'Telefon',
      selector: (row) => row.phone,
      sortable: true,
      width: '160px',
    },
    {
      name: 'Telegram',
      selector: (row) => row.telegramUsername || '-',
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (row.isActive ? 'Active' : 'Passive'),
      sortable: true,
      cell: (row) => (
        <span className={row.isActive ? 'text-success' : 'text-danger'}>
          {row.isActive ? 'Active' : 'Passive'}
        </span>
      ),
    },
    {
      name: 'Muddat',
      selector: (row) => row.accessUntil?.split('T')[0] || '-',
      sortable: true,
    },
  ]

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Qidiruv: login, ism, tel, telegram..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Yangi xabar
        </Button>
      </div>

      <DataTable
        theme="dark"
        title="Foydalanuvchilar"
        columns={columns}
        data={filteredUsers}
        highlightOnHover
        pagination
        fixedHeader
        fixedHeaderScrollHeight="400px"
        persistTableHead
      />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📤 Yangi push xabar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Xabar matni</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Xabaringizni kiriting..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Bekor qilish
          </Button>
          <Button variant="primary" onClick={handleSend} disabled={loading}>
            {loading ? 'Yuborilmoqda...' : 'Yuborish'}
          </Button>
        </Modal.Footer>
      </Modal>

      <PushLogModal
        show={!!logModalUser}
        onHide={closeLogModal}
        user={logModalUser}
      />
    </AdminLayout>
  )
}
