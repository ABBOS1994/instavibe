import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Form,
  Modal,
  InputGroup,
  Spinner,
  Pagination,
  Row,
  Col,
} from 'react-bootstrap'
import { ROLES } from '../../constants/roles'
import dayjs from 'dayjs'
import AdminLayout from '../../Layout/AdminLayout'
import { Info, Error, Warning, Success } from '../../components/admin/Service'
import { saveAs } from 'file-saver'
import PushLogModal from '../../components/admin/PushLogModal'
import {
  normalizeTelegramUsername,
  validateLogin,
} from '../../helpers/normalize'
import axiosInstance from '../../config/axiosConfig'

const defaultUser = {
  firstName: '',
  lastName: '',
  login: '',
  password: '',
  phone: '',
  role: ROLES.STANDARD,
  curator: '',
  telegramUsername: '',
  telegramChatId: '',
  webPushSubscription: { endpoint: '', keys: { p256dh: '', auth: '' } },
  notificationSettings: { telegram: false, web: false },
  accessUntil: '',
  isActive: true,
}

export default function UserPage() {
  const [users, setUsers] = useState([])
  const [curators, setCurators] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState(defaultUser)
  const [editingId, setEditingId] = useState(null)

  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('login')
  const [sortOrder, setSortOrder] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [curatorFilter, setCuratorFilter] = useState('')

  const [selected, setSelected] = useState([])
  const [showPushModal, setShowPushModal] = useState(false)
  const [pushMessage, setPushMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [logModalUser, setLogModalUser] = useState(null)

  useEffect(() => {
    fetchUsers()
    fetchCurators()
  }, [
    limit,
    page,
    search,
    sortBy,
    sortOrder,
    statusFilter,
    roleFilter,
    curatorFilter,
  ])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('user', {
        params: {
          limit,
          page,
          search,
          sortBy,
          sortOrder,
          isActive: statusFilter !== '' ? statusFilter : undefined,
          role: roleFilter || undefined,
          curator: curatorFilter || undefined,
        },
      })
      setUsers(res.data.users || [])
      setTotalPages(res.data.totalPages || 1)
    } catch {
      Error('Foydalanuvchilarni olishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  const fetchCurators = async () => {
    try {
      const res = await axiosInstance.get('user?role=curator')
      setCurators(res.data.users || [])
    } catch (err) {
      console.warn('Kuratorlar yuklanmadi', err)
    }
  }

  const handleEdit = (user) => {
    setFormData({
      ...defaultUser,
      ...user,
      password: '',
      accessUntil: user.accessUntil
        ? dayjs(user.accessUntil).format('YYYY-MM-DD')
        : '',
    })
    setEditingId(user._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Haqiqatan o‘chirmoqchimisiz?')) return
    try {
      await axiosInstance.delete(`user/${id}`)
      fetchUsers()
    } catch {
      Error('O‘chirishda xatolik')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanData = { ...formData }

    // Login: endi katta-kichik harflar ruxsat — normalize faqat bo‘shliqni olib tashlaydi
    const { isValid, normalized, error } = validateLogin(formData.login)
    if (!isValid) {
      Error(error)
      return
    }
    cleanData.login = normalized

    cleanData.phone = formData.phone?.trim() || null

    // Telegram username normalize
    if (cleanData.telegramUsername?.trim()) {
      cleanData.telegramUsername = normalizeTelegramUsername(
        cleanData.telegramUsername
      )
    } else {
      delete cleanData.telegramUsername
    }

    try {
      if (editingId) {
        await axiosInstance.put(`user/${editingId}`, cleanData)
      } else {
        await axiosInstance.post('user', cleanData)
      }
      Success(
        editingId ? 'Foydalanuvchi yangilandi' : 'Foydalanuvchi qo‘shildi'
      )
      fetchUsers()
    } catch (err) {
      Error(err.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setShowModal(false)
      setFormData(defaultUser)
      setEditingId(null)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('notificationSettings.')) {
      const key = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        notificationSettings: {
          ...prev.notificationSettings,
          [key]: checked,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append('file', file)

    try {
      const res = await axiosInstance.post('user/import', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { imported, errors = [] } = res.data || {}
      const msg = `✅ Import: ${imported} qator\n❌ Xatoliklar: ${errors.length}`
      errors.length ? Warning(msg) : Info(msg)
      fetchUsers()
    } catch (err) {
      Error(err.response?.data?.message || 'Importda xatolik')
    }
  }

  const handleExport = async () => {
    try {
      const res = await axiosInstance.get('user/export', {
        responseType: 'blob',
      })
      saveAs(res.data, 'users.csv')
    } catch {
      Error('Exportda xatolik')
    }
  }

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getCuratorName = (id) => {
    const curator = curators.find((c) => c._id === id)
    return curator?.firstName || curator?.login || ''
  }

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selected.length === users.length) setSelected([])
    else setSelected(users.map((u) => u._id))
  }

  const handleSendPush = async () => {
    if (!pushMessage || selected.length === 0) {
      Warning('Xabar matni yoki foydalanuvchi tanlanmagan')
      return
    }
    setSending(true)
    try {
      await axiosInstance.post('push/send', {
        type: 'telegram',
        userIds: selected,
        message: pushMessage,
      })
      Success('Xabar yuborildi')
      setPushMessage('')
      setSelected([])
      setShowPushModal(false)
    } catch {
      Error('Push yuborishda xatolik')
    } finally {
      setSending(false)
    }
  }

  return (
    <AdminLayout className="p-3">
      <div className="d-flex justify-content-end mb-3 gap-2">
        <Col>
          <InputGroup>
            <Form.Control
              placeholder="🔍 Qidiruv"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </InputGroup>
        </Col>
        <Button
          variant="success"
          onClick={() => {
            const initialForm = { ...defaultUser }
            if (
              initialForm.role !== ROLES.ADMIN &&
              initialForm.role !== ROLES.CURATOR &&
              !initialForm.curator &&
              curators.length > 0
            ) {
              initialForm.curator = curators[0]._id
            }
            setFormData(initialForm)
            setEditingId(null)
            setShowModal(true)
          }}
        >
          ➕ Qo‘shish
        </Button>

        <Button variant="warning" onClick={handleExport}>
          📤 Export
        </Button>
        <Form.Label className="btn btn-info mb-0">
          📥 Import
          <Form.Control type="file" hidden onChange={handleImport} />
        </Form.Label>
        <Button variant="primary" onClick={() => setShowPushModal(true)}>
          📨 Xabar yuborish
        </Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    checked={
                      selected.length === users.length && users.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th
                  onClick={() => toggleSort('login')}
                  style={{ cursor: 'pointer' }}
                >
                  Login{' '}
                  {sortBy === 'login' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ cursor: 'pointer' }}>Parol</th>
                <th
                  onClick={() => toggleSort('firstName')}
                  style={{ cursor: 'pointer' }}
                >
                  Ism{' '}
                  {sortBy === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => toggleSort('lastName')}
                  style={{ cursor: 'pointer' }}
                >
                  Familiya{' '}
                  {sortBy === 'lastName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => toggleSort('phone')}
                  style={{ cursor: 'pointer' }}
                >
                  Telefon{' '}
                  {sortBy === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => toggleSort('telegramUsername')}
                  style={{ cursor: 'pointer' }}
                >
                  Telegram{' '}
                  {sortBy === 'telegramUsername' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => toggleSort('accessUntil')}
                  style={{ cursor: 'pointer' }}
                >
                  Muddat{' '}
                  {sortBy === 'accessUntil' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>
                  <Form.Select
                    size="sm"
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value)
                      setPage(1)
                    }}
                  >
                    <option value="">🎯 Roli</option>
                    {Object.values(ROLES).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </Form.Select>
                </th>
                <th>
                  <Form.Select
                    size="sm"
                    value={curatorFilter}
                    onChange={(e) => {
                      setCuratorFilter(e.target.value)
                      setPage(1)
                    }}
                  >
                    <option value="">👤 Kurator</option>
                    {curators.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.firstName || c.login}
                      </option>
                    ))}
                  </Form.Select>
                </th>
                <th>
                  <Form.Select
                    size="sm"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setPage(1)
                    }}
                  >
                    <option value="">🔘 Holat</option>
                    <option value="1">Aktiv</option>
                    <option value="0">Blok</option>
                  </Form.Select>
                </th>
                <th>⚙️ Amal</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <Form.Check
                      checked={selected.includes(u._id)}
                      onChange={() => toggleSelect(u._id)}
                    />
                  </td>
                  <td
                    onClick={() => setLogModalUser(u)}
                    style={{ cursor: 'pointer', color: '#c3ff51' }}
                  >
                    {u.login}
                  </td>
                  <td>{u.password}</td>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.phone || ''}</td>
                  <td>{u.telegramUsername ? `@${u.telegramUsername}` : ''}</td>
                  <td>
                    {u.accessUntil
                      ? dayjs(u.accessUntil).format('YYYY-MM-DD')
                      : ''}
                  </td>
                  <td>{u.role}</td>
                  <td>{getCuratorName(u.curator)}</td>
                  <td className={u.isActive ? 'text-success' : 'text-danger'}>
                    {u.isActive ? 'Aktiv' : 'Blok'}
                  </td>
                  <td className="text-nowrap">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(u)}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(u._id)}
                    >
                      🗑
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}

      <Modal
        show={showPushModal}
        onHide={() => setShowPushModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>📩 Xabar yuborish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Xabar matni</Form.Label>
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
          <Button variant="secondary" onClick={() => setShowPushModal(false)}>
            Bekor
          </Button>
          <Button variant="primary" onClick={handleSendPush} disabled={sending}>
            {sending ? 'Yuborilmoqda...' : 'Yuborish'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? '✏️ Tahrirlash' : '➕ Yangi foydalanuvchi'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Modal.Body>
            <Row className="mb-2">
              <Col>
                <Form.Label>Ism</Form.Label>
                <Form.Control
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Familiya</Form.Label>
                <Form.Control
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Label>Login</Form.Label>
                <Form.Control
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col>
                <Form.Label>
                  Parol (agar termasangiz generatsiya qilinadi)
                  {editingId && <small> (o‘zgarmasa bo‘sh qoldiring)</small>}
                </Form.Label>
                <Form.Control
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  autoComplete="off"
                  placeholder={editingId ? '********' : ''}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+998901234567"
                  autoComplete="off"
                  required
                />
              </Col>
              <Col>
                <Form.Label>Telegram @username</Form.Label>
                <Form.Control
                  name="telegramUsername"
                  value={formData.telegramUsername}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Label>Roli</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  {Object.values(ROLES).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Kurator</Form.Label>
                <Form.Select
                  name="curator"
                  value={formData.curator}
                  onChange={handleChange}
                >
                  <option value="">(Yo‘q)</option>
                  {curators.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.firstName || c.login}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Label>Muddati (accessUntil)</Form.Label>
                <Form.Control
                  name="accessUntil"
                  value={formData.accessUntil}
                  onChange={handleChange}
                  type="date"
                />
              </Col>
              <Col>
                <Form.Label>Holati</Form.Label>
                <Form.Select
                  name="isActive"
                  value={formData.isActive ? '1' : '0'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.value === '1',
                    }))
                  }
                >
                  <option value="1">Aktiv</option>
                  <option value="0">Bloklangan</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Check
                  type="checkbox"
                  name="notificationSettings.telegram"
                  label="Telegram orqali bildirishnoma"
                  checked={formData.notificationSettings.telegram}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  name="notificationSettings.web"
                  label="Platforma orqali bildirishnoma"
                  checked={formData.notificationSettings.web}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Bekor
            </Button>
            <Button variant="primary" type="submit">
              {editingId ? 'Saqlash' : 'Qo‘shish'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <PushLogModal
        show={!!logModalUser}
        onHide={() => setLogModalUser(null)}
        user={logModalUser}
      />
    </AdminLayout>
  )
}
