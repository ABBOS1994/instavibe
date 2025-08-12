//components/home/Client/index.js
import React from 'react'
import { Container } from 'react-bootstrap'
import ClientContainer from './ClientContainer'

const Index = ({ data }) => {
  if (data)
    return (
      <section className="client">
        <Container>
          <h1 className="title">
            MIJOZLARIMIZ ◦ <span>TOP BRENDLAR</span>
          </h1>
        </Container>
        <ClientContainer clientCard={data} direction="left" />
        <ClientContainer clientCard={data} direction="right" />
      </section>
    )
}

export default Index
