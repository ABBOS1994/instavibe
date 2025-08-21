import React, { useMemo, useCallback } from 'react'
import { Modal, Form, Badge } from 'react-bootstrap'

export default function CategoryModal({
  showModal,
  handleClose,
  currentCategory,
  handleChange,
  handleSave,
  isEditing,
  groupCodes = [],
}) {
  const selectedVisibility = useMemo(() => {
    const arr = Array.isArray(currentCategory?.visibility)
      ? currentCategory.visibility
      : []
    return arr
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n) && n >= 0)
  }, [currentCategory?.visibility])

  const toggleCode = useCallback(
    (code) => {
      const set = new Set(selectedVisibility)
      if (set.has(code)) set.delete(code)
      else set.add(code)
      const next = [...set].sort((a, b) => a - b)
      handleChange({
        target: { name: 'visibility', value: next, type: 'text' },
      })
    },
    [selectedVisibility, handleChange]
  )

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? 'Kategoriya tahrirlash' : 'Yangi kategoriya'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label column="lg">Nomi</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={currentCategory?.title || ''}
              onChange={handleChange}
              placeholder="Kategoriya nomi"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column="lg">Tavsif</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={currentCategory?.description || ''}
              onChange={handleChange}
              placeholder="Kategoriya tavsifi"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column="lg">Ko‘rinadigan guruhlar</Form.Label>
            {groupCodes.length ? (
              <div className="d-flex flex-wrap gap-2">
                {groupCodes.map((code) => {
                  const active = selectedVisibility.includes(code)
                  return (
                    <Badge
                      key={code}
                      pill
                      bg={active ? 'primary' : 'dark'}
                      role="button"
                      onClick={() => toggleCode(code)}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {code}
                    </Badge>
                  )
                })}
              </div>
            ) : (
              <div className="text-muted">Grouplar yo‘q</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column="lg">Sort raqami</Form.Label>
            <Form.Control
              type="number"
              name="sort"
              value={currentCategory?.sort ?? 0}
              onChange={handleChange}
              placeholder="Sort"
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Check
              type="switch"
              name="isActive"
              checked={currentCategory?.isActive ?? true}
              onChange={handleChange}
              label="Aktiv holatda"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <div className="d-flex justify-content-end gap-2 p-3 pt-0">
        <button className="btn btn-secondary" onClick={handleClose}>
          Bekor qilish
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Saqlash
        </button>
      </div>
    </Modal>
  )
}
