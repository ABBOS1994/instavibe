import React from 'react'
import { Table, Button, Badge } from 'react-bootstrap'

function GroupBadges({ codes }) {
  const arr = Array.isArray(codes)
    ? codes
        .map((n) => Number(n))
        .filter((n) => Number.isInteger(n) && n >= 0)
        .sort((a, b) => a - b)
    : []

  if (arr.length === 0) return <span className="text-muted">—</span>

  const MAX = 6
  const shown = arr.slice(0, MAX)
  const rest = arr.length - shown.length

  return (
    <div className="d-flex flex-wrap gap-1" title={arr.join(', ')}>
      {shown.map((code) => (
        <Badge key={code} bg="dark" pill>
          {code}
        </Badge>
      ))}
      {rest > 0 && <Badge bg="secondary" pill>{`+${rest}`}</Badge>}
    </div>
  )
}

export default function CategoryRow({
  category,
  expandedCategory,
  handleShowChildren,
  handleShow,
  handleDelete,
  categoryChildren,
  handleShowChildModal,
  handleChildDelete,
  handleShowContent,
}) {
  const isExpanded = expandedCategory === category._id
  const children = Array.isArray(categoryChildren[category._id])
    ? categoryChildren[category._id]
    : []

  return (
    <>
      <tr>
        <td>{category?.sort ?? 0}</td>

        <td
          onClick={() => handleShowChildren(category._id)}
          className="btn-link"
          role="button"
        >
          {category.title}
        </td>

        <td>{category.description || '—'}</td>

        <td>
          <GroupBadges codes={category?.visibility} />
        </td>

        <td>
          {category.isActive ? (
            <Badge bg="success">Active</Badge>
          ) : (
            <Badge bg="secondary">Inactive</Badge>
          )}
        </td>

        <td className="text-nowrap">
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleShow(category)}
          >
            Edit
          </Button>{' '}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(category._id)}
          >
            Delete
          </Button>
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={6} className="m-0 p-0">
            <div className="table-responsive">
              <Table striped bordered hover size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Sort</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th style={{ width: 180 }}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleShowChildModal(null)}
                      >
                        Add Child
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {children.map((child) => (
                    <tr key={child._id}>
                      <td>{child?.sort ?? 0}</td>
                      <td
                        onClick={() => handleShowContent(child._id)}
                        role="button"
                        className="btn-link"
                      >
                        {child.title}
                      </td>
                      <td>{child.description || '—'}</td>
                      <td className="text-nowrap">
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowChildModal(child)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleChildDelete(child._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {children.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        No children
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
