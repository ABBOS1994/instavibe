import React from 'react'
import ModuleComponent from './ModuleComponent'
import { Row } from 'react-bootstrap'

function ModuleContainer({ data }) {
  return (
    <Row className="demoModuleContainer">
      {data?.map((d, i) => (
        <ModuleComponent data={d} key={i} idx={i} />
      ))}
    </Row>
  )
}

export default ModuleContainer
