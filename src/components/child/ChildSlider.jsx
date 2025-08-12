// ✅ Optimallashtirilgan ChildSlider.jsx (demo path yo'q)
import React from 'react'
import Link from 'next/link'
import Slider from 'react-slick'
import { Card, Col } from 'react-bootstrap'
import settings from '../../data/carouselSettings.json'
import { useRouter } from 'next/router'

function ChildSlider({ data = [] }) {
  const { query } = useRouter()

  return (
    <Slider {...settings}>
      {data.map((d, i) => (
        <Link key={d._id || i} href={`/cabinet/${query.child}/${d._id}`}>
          <Col md={6} sm={12} lg={4} className="slugCardComponent">
            <Card>
              <span className="number">{(i >= 9 ? '' : 0) + (i + 1)}</span>
              <Card.Img src="/icon/videoIcon.svg" alt="icon" />
              <Card.Text>{d.title}</Card.Text>
            </Card>
          </Col>
        </Link>
      ))}
    </Slider>
  )
}

export default ChildSlider
