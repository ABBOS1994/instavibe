import React from 'react'
import { Table, Button } from 'react-bootstrap'

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
  return (
    <React.Fragment key={category._id}>
      <tr>
        <td>{category.sort}</td>
        <td
          onClick={() => handleShowChildren(category._id)}
          className="btn-link"
          role="button"
        >
          {category.title}
        </td>
        <td>{category.description}</td>
        <td style={{ color: category.isActive ? 'green' : 'red' }}>
          {category.isActive ? 'Active' : 'Inactive'}
        </td>
        <td>
          <Button variant="warning" onClick={() => handleShow(category)}>
            Edit
          </Button>{' '}
          <Button variant="danger" onClick={() => handleDelete(category._id)}>
            Delete
          </Button>
        </td>
      </tr>

      {expandedCategory === category._id && (
        <tr>
          <td colSpan="6" className="m-0 p-0">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sort</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>
                    <Button
                      variant="primary"
                      onClick={() => handleShowChildModal(null)}
                    >
                      Add Child
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(categoryChildren[category._id]) &&
                  categoryChildren[category._id].map((child) => (
                    <tr key={child._id}>
                      <td>{child.sort}</td>
                      <td
                        onClick={() => handleShowContent(child._id)}
                        role="button"
                        className="btn-link"
                      >
                        {child.title}
                      </td>
                      <td>{child.description}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleShowChildModal(child)}
                        >
                          Edit
                        </Button>{' '}
                        <Button
                          variant="danger"
                          onClick={() => handleChildDelete(child._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </td>
        </tr>
      )}
    </React.Fragment>
  )
}
