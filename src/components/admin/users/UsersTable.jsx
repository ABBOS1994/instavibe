import React from 'react'
import { Table, Spinner, Button, Form } from 'react-bootstrap'

export default function UsersTable({
  loading,
  users,
  // sorting / filters
  sortBy,
  sortOrder,
  toggleSort,
  roleFilter,
  setRoleFilter,
  curatorFilter,
  setCuratorFilter,
  statusFilter,
  setStatusFilter,
  groupFilter, // <-- qo'shildi
  setGroupFilter, // <-- qo'shildi
  groupOptions = [], // <-- qo'shildi
  curators,
  roles = [],
  getCuratorName,
  // selection
  selectedAll,
  selectedIds,
  excludedIds,
  toggleRow,
  toggleSelectAllHeader,
  headerChkRef,
  allSelected,
  // actions
  onEdit,
  onDelete,
  onOpenLog,
}) {
  if (loading) return <Spinner animation="border" />

  return (
    <>
      <div className="table-responsive">
        <Table striped bordered hover className="mb-2">
          <thead>
            <tr>
              <th>
                <input
                  ref={headerChkRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAllHeader}
                />
              </th>
              <th
                onClick={() => toggleSort('login')}
                style={{ cursor: 'pointer' }}
              >
                Login {sortBy === 'login' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ cursor: 'default' }}>Parol</th>
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
                {sortBy === 'accessUntil' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>

              {/* GROUP FILTER (headerda), qatordagi hujayra tag'da */}
              <th>
                <Form.Select
                  size="sm"
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  title="Guruh bo‘yicha filter"
                >
                  <option value="">Guruh (barchasi)</option>
                  {groupOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </Form.Select>
              </th>

              {/* Role / Curator / Status filterlari */}
              <th>
                <Form.Select
                  size="sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">🎯 Roli</option>
                  {roles.map((r) => (
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
                  onChange={(e) => setCuratorFilter(e.target.value)}
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
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                    checked={
                      selectedAll
                        ? !excludedIds.includes(u._id)
                        : selectedIds.includes(u._id)
                    }
                    onChange={() => toggleRow(u._id)}
                  />
                </td>
                <td
                  onClick={() => onOpenLog(u)}
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
                    ? new Date(u.accessUntil).toISOString().slice(0, 10)
                    : ''}
                </td>

                {/* group qiymati (headerdagi group filterga mos ustun) */}
                <td>
                  {u.group === 0 || typeof u.group === 'number' ? u.group : '—'}
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
                    onClick={() => onEdit(u)}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(u._id)}
                  >
                    🗑
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  )
}
