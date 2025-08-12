import React from 'react'
import { Card, Image } from 'react-bootstrap'

const BannerCarouselComponent = ({ data: { text /*img*/ }, idx }) => {
  return (
    <Card className="text-white">
      <Card.Body>
        {/*<Card.Text>*/}
        {/*  <Image src={img ? img : '/icon/store.svg'} alt={'icon'} />*/}
        {/*</Card.Text>*/}
        <Card.Text className="h3">{text}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default BannerCarouselComponent
