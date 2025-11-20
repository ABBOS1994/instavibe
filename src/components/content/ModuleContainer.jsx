// src/components/content/ModuleContainer.jsx
import React from 'react'
import ModuleComponent from './ModuleComponent'
import { Row } from 'react-bootstrap'

function ModuleContainer({ data, userGroups = [], isPrivileged = false }) {
  return (
    <Row className="demoModuleContainer">
      {data?.map((d, i) => (
        <ModuleComponent
          data={d}
          key={d?._id || i}
          idx={i}
          userGroups={userGroups}
          isPrivileged={isPrivileged}
        />
      ))}
    </Row>
  )
}

export default ModuleContainer
