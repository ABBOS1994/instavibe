import React, { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import AdminLayout from '../../Layout/AdminLayout'
import { Info, Error, Warning, Success } from '../../components/admin/Service'
import { saveAs } from 'file-saver'
import PushLogModal from '../../components/admin/PushLogModal'
import {
  normalizeTelegramUsername,
  validateLogin,
} from '../../helpers/normalize'
import { ROLES } from '../../constants/roles'
import axiosInstance from '../../config/axiosConfig'

import FiltersBar from '../../components/admin/users/FiltersBar'
import UsersTable from '../../components/admin/users/UsersTable'
import UserFormModal from '../../components/admin/users/UserFormModal'
import PushMessageModal from '../../components/admin/users/PushMessageModal'

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

const normalizeUser = (raw = {}, roles = ROLES) => {
  const roleStd = roles?.STANDARD || 'standard'
  return {
    _id: raw._id || raw.id || '',
    login: raw.login || '',
    password: raw.password || raw.plainPassword || '',
    firstName: raw.firstName || '',
    lastName: raw.lastName || '',
    phone: raw.phone || '',
    role: raw.role || roleStd,
    curator: raw.curator || '',
    telegramUsername: raw.telegramUsername || '',
    telegramChatId: raw.telegramChatId || '',
    webPushSubscription: raw.webPushSubscription || {
      endpoint: '',
      keys: { p256dh: '', auth: '' },
    },
    notificationSettings: raw.notificationSettings || {
      telegram: false,
      web: false,
    },
    accessUntil: raw.accessUntil || '',
    isActive: typeof raw.isActive === 'boolean' ? raw.isActive : true,
  }
}

const extractUserFromResponse = (res) => {
  return res?.data?.user ?? res?.data ?? res
}

export default function UserPage() {
  const [allUsers, setAllUsers] = useState([])
  const [curators, setCurators] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(defaultUser)
  const [logModalUser, setLogModalUser] = useState(null)
  const [showPushModal, setShowPushModal] = useState(false)
  const [pushMessage, setPushMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('login')
  const [sortOrder, setSortOrder] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [curatorFilter, setCuratorFilter] = useState('')
  const [selectedAll, setSelectedAll] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [excludedIds, setExcludedIds] = useState([])
  const headerChkRef = useRef(null)

  useEffect(() => {
    fetchUsers()
  }, [])
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('user')
      const list = res.data?.users || res.data || []
      const safeList = Array.isArray(list) ? list : []
      const normalized = safeList.map((u) => normalizeUser(u, ROLES))
      setAllUsers(normalized)
    } catch (e) {
      Error('Foydalanuvchilarni olishda xatolik: ' + (e?.message || ''))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const onlyCurators = allUsers.filter(
      (u) =>
        (u.role || '').toLowerCase() ===
        (ROLES.CURATOR || 'curator').toLowerCase()
    )
    setCurators(onlyCurators)
  }, [allUsers])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allUsers.filter((u) => {
      if (statusFilter === '1' && !u.isActive) return false
      if (statusFilter === '0' && u.isActive) return false
      if (
        roleFilter &&
        (u.role || '').toLowerCase() !== roleFilter.toLowerCase()
      )
        return false
      if (curatorFilter && u.curator !== curatorFilter) return false

      if (!q) return true
      const text = [
        u.login,
        u.firstName,
        u.lastName,
        u.phone,
        u.telegramUsername ? '@' + u.telegramUsername : '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return text.includes(q)
    })
  }, [allUsers, search, statusFilter, roleFilter, curatorFilter])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const A = (a?.[sortBy] ?? '').toString().toLowerCase()
      const B = (b?.[sortBy] ?? '').toString().toLowerCase()
      if (A < B) return sortOrder === 'asc' ? -1 : 1
      if (A > B) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return arr
  }, [filtered, sortBy, sortOrder])
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit))
  const safePage = Math.min(page, totalPages)
  const pageUsers = useMemo(() => {
    const start = (safePage - 1) * limit
    return sorted.slice(start, start + limit)
  }, [sorted, safePage, limit])

  useEffect(() => {
    if (safePage !== page) setPage(safePage)
  }, [safePage, page])
  const totalSelectedCount = selectedAll
    ? Math.max(0, filtered.length - excludedIds.length)
    : selectedIds.length
  const allSelected =
    filtered.length > 0 && totalSelectedCount === filtered.length

  useEffect(() => {
    if (!headerChkRef.current) return
    headerChkRef.current.indeterminate = totalSelectedCount > 0 && !allSelected
  }, [totalSelectedCount, allSelected])

  const toggleSort = (field) => {
    if (sortBy === field)
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getCuratorName = (id) => {
    const curator = curators.find((c) => c._id === id)
    return curator?.firstName || curator?.login || ''
  }

  const toggleRow = (id) => {
    if (selectedAll) {
      setExcludedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      )
    } else {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      )
    }
  }

  const toggleSelectAllHeader = () => {
    if (allSelected) {
      setSelectedAll(false)
      setSelectedIds([])
      setExcludedIds([])
    } else {
      setSelectedAll(true)
      setSelectedIds([])
      setExcludedIds([])
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
    setShowFormModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Haqiqatan o‘chirmoqchimisiz?')) return
    try {
      await axiosInstance.delete(`user/${id}`)
      setAllUsers((prev) => prev.filter((u) => u._id !== id))
      Success('O‘chirildi')
    } catch {
      Error('O‘chirishda xatolik')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanData = { ...formData }

    const { isValid, normalized, error } = validateLogin(formData.login)
    if (!isValid) return Error(error)
    cleanData.login = normalized
    cleanData.phone = formData.phone?.trim() || null

    if (cleanData.telegramUsername?.trim()) {
      cleanData.telegramUsername = normalizeTelegramUsername(
        cleanData.telegramUsername
      )
    } else {
      delete cleanData.telegramUsername
    }

    try {
      if (editingId) {
        const res = await axiosInstance.put(`user/${editingId}`, cleanData)
        const updatedRaw = extractUserFromResponse(res)
        const updatedUser = normalizeUser(
          {
            ...updatedRaw,
            password: updatedRaw?.password ?? updatedRaw?.plainPassword ?? '',
          },
          ROLES
        )
        setAllUsers((prev) =>
          prev.map((u) => (u._id === editingId ? { ...u, ...updatedUser } : u))
        )
        Success('Foydalanuvchi yangilandi')
      } else {
        const res = await axiosInstance.post('user', cleanData)
        const createdRaw = extractUserFromResponse(res)
        const createdUser = normalizeUser(createdRaw, ROLES)
        if (!createdUser.password) {
          createdUser.password =
            createdRaw?.password || createdRaw?.plainPassword || ''
        }
        setAllUsers((prev) => [createdUser, ...prev])
        Success('Foydalanuvchi qo‘shildi')
      }
    } catch (err) {
      return Error(err?.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setShowFormModal(false)
      setFormData(defaultUser)
      setEditingId(null)
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
      const {
        imported,
        errors = [],
        users: importedUsers = [],
      } = res.data || {}
      const msg = `✅ Import: ${imported} qator\n❌ Xatoliklar: ${errors.length}`
      errors.length ? Warning(msg) : Info(msg)

      if (Array.isArray(importedUsers) && importedUsers.length) {
        const normalized = importedUsers.map((u) => normalizeUser(u, ROLES))
        setAllUsers((prev) => [...normalized, ...prev])
      } else {
        fetchUsers()
      }
    } catch (err) {
      Error(err?.response?.data?.message || 'Importda xatolik')
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

  const handleSendPush = async () => {
    if (!pushMessage) return Warning('Xabar matnini kiriting')

    const filteredIds = filtered.map((u) => u._id)
    const finalIds = selectedAll
      ? filteredIds.filter((id) => !excludedIds.includes(id))
      : selectedIds
    if (finalIds.length === 0)
      return Warning('Hech qanday foydalanuvchi tanlanmagan')

    setSending(true)
    try {
      await axiosInstance.post('push/send', {
        type: 'telegram',
        userIds: finalIds,
        message: pushMessage,
      })
      Success(`Xabar yuborildi (${finalIds.length} ta user)`)
      setPushMessage('')
      setSelectedAll(false)
      setSelectedIds([])
      setExcludedIds([])
      setShowPushModal(false)
    } catch {
      Error('Push yuborishda xatolik')
    } finally {
      setSending(false)
    }
  }

  return (
    <AdminLayout className="p-3">
      <FiltersBar
        page={safePage} //  <-- qo‘shildi
        totalPages={totalPages} //  <-- qo‘shildi
        setPage={setPage}
        search={search}
        setSearch={(v) => {
          setSearch(v)
          setPage(1)
        }}
        limit={limit}
        setLimit={(n) => {
          setLimit(n)
          setPage(1)
        }}
        onAdd={() => {
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
          setShowFormModal(true)
        }}
        onExport={handleExport}
        onImport={handleImport}
        onOpenPush={() => setShowPushModal(true)}
      />

      <UsersTable
        loading={loading}
        users={pageUsers}
        totalPages={totalPages}
        page={safePage}
        setPage={setPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        toggleSort={toggleSort}
        roleFilter={roleFilter}
        setRoleFilter={(v) => {
          setRoleFilter(v)
          setPage(1)
        }}
        curatorFilter={curatorFilter}
        setCuratorFilter={(v) => {
          setCuratorFilter(v)
          setPage(1)
        }}
        statusFilter={statusFilter}
        setStatusFilter={(v) => {
          setStatusFilter(v)
          setPage(1)
        }}
        curators={curators}
        roles={Object.values(ROLES)}
        getCuratorName={getCuratorName}
        selectedAll={selectedAll}
        selectedIds={selectedIds}
        excludedIds={excludedIds}
        toggleRow={toggleRow}
        toggleSelectAllHeader={toggleSelectAllHeader}
        headerChkRef={headerChkRef}
        allSelected={allSelected}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenLog={setLogModalUser}
      />

      <PushMessageModal
        show={showPushModal}
        onHide={() => setShowPushModal(false)}
        pushMessage={pushMessage}
        setPushMessage={setPushMessage}
        sending={sending}
        onSend={handleSendPush}
      />

      <UserFormModal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        curators={curators}
        editingId={editingId}
      />

      <PushLogModal
        show={!!logModalUser}
        onHide={() => setLogModalUser(null)}
        user={logModalUser}
      />
    </AdminLayout>
  )
}
