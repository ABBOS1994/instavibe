// src/components/admin/users/FiltersBar.jsx
import React from 'react'
import { Button, Col, Form, InputGroup, Pagination, Row } from 'react-bootstrap'
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
  const handleChangePage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  return (
    <>
      {/* 1-qator: qidiruv + action tugmalar */}
      <Row className="align-items-center mb-2 g-2">
        <Col xs={12} md={4}>
          <InputGroup>
            <Form.Control
              placeholder="🔍 Qidiruv (login, ism, telefon, @telegram)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col
          xs={12}
          md={8}
          className="d-flex flex-wrap justify-content-end gap-2"
        >
          <Button variant="success" onClick={onAdd}>
            ➕ Qo‘shish
          </Button>

          <Button variant="warning" onClick={onExport}>
            📤 Export
          </Button>

          <Form.Label
            column="lg"
            className="btn btn-info mb-0"
            style={{ maxWidth: 130 }}
          >
            📥 Import
            <Form.Control type="file" hidden onChange={onImport} />
          </Form.Label>

          <Button variant="primary" onClick={onOpenPush}>
            <Telegram />️ Xabar yuborish
          </Button>
        </Col>
      </Row>

      {/* 2-qator: pagination + limit tanlash */}
      <Row className="align-items-center mb-3 g-2">
        <Col xs={12} md={8} className="d-flex justify-content-start">
          <Pagination className="mb-0" aria-label="Users pagination (bottom)">
            <Pagination.Prev onClick={() => handleChangePage(page - 1)} />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={page === i + 1}
                onClick={() => handleChangePage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handleChangePage(page + 1)} />
          </Pagination>
        </Col>

        <Col
          xs={12}
          md={4}
          className="d-flex justify-content-md-end justify-content-start"
        >
          <Form.Select
            style={{ maxWidth: 140 }}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value) || 10)}
          >
            {[10, 20, 50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
    </>
  )
}
