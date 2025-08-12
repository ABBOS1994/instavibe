//src/components/content/LinkContainer.jsx
import React from 'react'
import { Container, Row } from 'react-bootstrap'
import LinkComponent from './LinkComponent'

function LinkContainer({ data }) {
  return (
    <Container>
      <Row>
        {data?.map((d, i) => (
          <LinkComponent key={i} data={d} />
        ))}
      </Row>
    </Container>
  )
}

export default LinkContainer
