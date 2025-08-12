import React from 'react'
import { Container } from 'react-bootstrap'

function SectionLayout({ children, text, description, className = 'section' }) {
  return (
    <section className={className}>
      <Container>
        <h1 className="title">
          {text} ◦ <span>{description}</span>
        </h1>
        {children}
      </Container>
    </section>
  )
}

export default SectionLayout
