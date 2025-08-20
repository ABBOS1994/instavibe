import React from 'react'
import ModuleComponent from './ModuleComponent'
import { Row } from 'react-bootstrap'

function ModuleContainer({ data, userGroup }) {
  return (
    <Row className="demoModuleContainer">
      {data?.map((d, i) => (
        <ModuleComponent
          data={d}
          key={d?._id || i}
          idx={i}
          userGroup={userGroup}
        />
      ))}
    </Row>
  )
}

export default ModuleContainer
