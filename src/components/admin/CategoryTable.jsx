import React from 'react'
import { Table, Button } from 'react-bootstrap'
import CategoryRow from './CategoryRow'

export default function CategoryTable({
  categories,
  handleShowContent,
  expandedCategory,
  handleShowChildren,
  handleShow,
  handleDelete,
  categoryChildren,
  handleShowChildModal,
  handleChildDelete,
}) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th style={{ width: 80 }}>Sort</th>
          <th style={{ minWidth: 220 }}>Title</th>
          <th>Description</th>
          <th style={{ minWidth: 220 }}>Groups</th>
          <th style={{ width: 90 }}>Active</th>
          <th style={{ width: 160 }}>
            <Button variant="primary" onClick={() => handleShow()}>
              Add New
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <CategoryRow
            key={category._id}
            category={category}
            expandedCategory={expandedCategory}
            handleShowChildren={handleShowChildren}
            handleShow={handleShow}
            handleDelete={handleDelete}
            categoryChildren={categoryChildren}
            handleShowChildModal={handleShowChildModal}
            handleChildDelete={handleChildDelete}
            handleShowContent={handleShowContent}
          />
        ))}
      </tbody>
    </Table>
  )
}
