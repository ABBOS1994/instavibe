import React from 'react'
import { Button, Col, Form, InputGroup, Pagination } from 'react-bootstrap'
import { Telegram } from '../../../../public/icon/Icons'

export default function FiltersBar({
  search,
  setSearch,
  limit,
  setLimit,
  page,
  totalPages,
  setPage,
  onAdd,
  onExport,
  onImport,
  onOpenPush,
}) {
  return (
    <>
      {/* Actions + filters */}
      <div className="d-flex align-items-center justify-content-end mb-3 gap-2">
        <Col>
          <InputGroup>
            <Form.Control
              placeholder="🔍 Qidiruv (login, ism, telefon, @telegram)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Pagination className="mb-0" aria-label="Users pagination (top)">
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

        <Form.Select
          style={{ maxWidth: 120 }}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value) || 10)}
        >
          {[10, 20, 50, 100, 200].map((n) => (
            <option key={n} value={n}>
              {n}/page
            </option>
          ))}
        </Form.Select>

        <Button variant="success" onClick={onAdd}>
          ➕ Qo‘shish
        </Button>

        <Button variant="warning" onClick={onExport}>
          📤 Export
        </Button>

        <Form.Label
          column={'lg'}
          className="btn btn-info mb-0"
          style={{ maxWidth: 120 }}
        >
          📥 Import
          <Form.Control type="file" hidden onChange={onImport} />
        </Form.Label>

        <Button variant="primary" onClick={onOpenPush}>
          <Telegram />️ Xabar yuborish
        </Button>
      </div>
    </>
  )
}
