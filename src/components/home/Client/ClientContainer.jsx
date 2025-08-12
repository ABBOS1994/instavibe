//components/home/Client/ClientContainer.js
import React from 'react'
import { Container } from 'react-bootstrap'
import Marquee from 'react-fast-marquee'
import ClientCard from './ClientCard'

const ClientContainer = ({ direction, clientCard }) => {
  return (
    <Container fluid className="clientContainer">
      <Marquee autoFill direction={direction}>
        {clientCard?.map((c, idx) => (
          <ClientCard key={idx} content={c} />
        ))}
      </Marquee>
    </Container>
  )
}

export default ClientContainer
