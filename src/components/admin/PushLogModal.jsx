// components/admin/PushLogModal.jsx

import { Modal, Table, Spinner } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axiosInstance from '../../config/axiosConfig'

export default function PushLogModal({ show, onHide, user }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?._id) {
      axiosInstance
        .get(`push/user/${user._id}`)
        .then((res) => setLogs(res.data || []))
        .catch((err) => console.error('Log xatolik:', err))
        .finally(() => setLoading(false))
    }
  }, [user])

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          🕵️ {user?.login || user?.firstName} – Push loglari
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : logs.length === 0 ? (
          <p>📭 Hali hech qanday push yuborilmagan</p>
        ) : (
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>📅 Sana</th>
                <th>📡 Kanal</th>
                <th>📨 Xabar</th>
                <th>✅ Yetkazildi</th>
                <th>👁 O‘qildi</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.sentAt).toLocaleString()}</td>
                  <td>{log.channel}</td>
                  <td>{log.message}</td>
                  <td className={log.success ? 'text-success' : 'text-danger'}>
                    {log.success ? 'Ha' : `Yo‘q (${log.error || 'xatolik'})`}
                  </td>
                  <td>
                    {log.read
                      ? `O‘qildi – ${new Date(log.readAt).toLocaleString()}`
                      : 'Yo‘q'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  )
}
