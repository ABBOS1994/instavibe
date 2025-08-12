import React from 'react'
import { Card, Image } from 'react-bootstrap'

function IdHeaderCard({ data, idx }) {
  const formattedIdx = idx < 10 ? `0${idx}` : `${idx}`
  return (
    <Card className="demoSlugHeaderCard">
      <Image src={'/icon/videoPlayIcon.svg'} alt={'icon'} />
      <div className="vr" />
      <span className="right">
        <p>{data?.title}</p>
        <h1>{data?.description}</h1>
        <span className="number">{formattedIdx}</span>
      </span>
    </Card>
  )
}

export default IdHeaderCard
