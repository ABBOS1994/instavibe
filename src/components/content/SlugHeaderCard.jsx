import React from 'react'
import { Card, Image } from 'react-bootstrap'

function SlugHeaderCard({ header }) {
  return (
    <Card className="demoSlugHeaderCard">
      <Image src={'/img/0.png'} alt={'icon'} />
      <div className="vr" />
      <span className="right">
        <p>{header?.title}</p>
        <h1>{header?.description}</h1>
        <span className="number">{header?.sort}</span>
      </span>
    </Card>
  )
}

export default SlugHeaderCard
