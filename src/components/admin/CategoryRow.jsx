import React from 'react'
import { Table, Button, Badge } from 'react-bootstrap'

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

  const categoryGroups =
    Array.isArray(category?.visibility) && category.visibility.length > 0
      ? category.visibility.join(', ')
      : '—'

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

        {/* NEW: Groups (visibility) */}
        <td>{categoryGroups}</td>

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
          {/* Tashqi jadvaldagi ustunlar soniga mos ravishda colSpan ni yangilang (hozir 6 ta) */}
          <td colSpan={6} className="m-0 p-0">
            <div className="table-responsive">
              <Table striped bordered hover size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Sort</th>
                    <th>Title</th>
                    <th>Description</th>
                    {/* NEW: Groups (visibility) */}
                    <th>Groups</th>
                    <th>
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
                  {children.map((child) => {
                    const childGroups =
                      Array.isArray(child?.visibility) &&
                      child.visibility.length > 0
                        ? child.visibility.join(', ')
                        : '—'

                    return (
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
                        {/* NEW: child visibility */}
                        <td>{childGroups}</td>
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
                    )
                  })}
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
