import React from 'react'
import { Container } from 'react-bootstrap'
import ResultContainer from './ResultContainer'

const Student = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return null

  return (
    <section className="student">
      <Container>
        <h1 className="title">
          O'QUVCHILAR ◦ <span>FIKRLAR</span>
        </h1>
      </Container>
      <ResultContainer direction="left" studentCardData={data} />
      <ResultContainer direction="right" studentCardData={data} />
    </section>
  )
}

export default Student
