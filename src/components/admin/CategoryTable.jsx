//src/components/admins/CategoryTable
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
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sort</th>
          <th>Title</th>
          <th>Description</th>
          <th>Active</th>
          <th>
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
