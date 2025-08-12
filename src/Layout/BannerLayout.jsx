// src/components/layout/BannerLayout.jsx
import { Container } from 'react-bootstrap'
import React from 'react'
import BannerCarouselComponent from '../components/content/BannerCarouselComponent'
import Slider from 'react-slick'

function BannerLayout({ data }) {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <section className="demoBannerSection">
      <Container>
        <h1 className="title">
          YANGILIKLAR ◦ <span> E'LONLAR </span>
        </h1>
      </Container>
      <Container className="demoBannerCarouselContainer">
        <Slider {...settings}>
          {data
            ?.filter((d) => d.isActive)
            .map((d, i) => (
              <BannerCarouselComponent key={i} idx={i} data={d} />
            ))}
        </Slider>
      </Container>
    </section>
  )
}

export default BannerLayout
