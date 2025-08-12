import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import BannerCarouselComponent from './BannerCarouselComponent'
import Slider from 'react-slick'
import { useRouter } from 'next/router'
import axiosInstance from '../../config/axiosConfig'

function BannerContainer() {
  const { pathname } = useRouter()
  const [data, setData] = useState([])
  const s = {
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 2.5,
    slidesToScroll: 1,
    focusOnSelect: true,
    initialSlide: 0,
    centerMode: false,
    autoplay: false,
    autoplaySpeed: 4000,
  }
  useEffect(() => {
    const fetchData = async () => {
      const token = window.localStorage.getItem('Token')
      if (pathname === '/cabinet' && token) {
        try {
          const response = await axiosInstance.get('banner')
          const activeBanners = response.data.filter(
            (banner) => banner.isActive
          )
          setData(activeBanners)
        } catch (error) {
          console.error('Failed to fetch banner data:', error)
        }
      }
    }
    fetchData()
  }, [pathname])
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
            .filter((d) => d.isActive)
            .map((d, i) => (
              <BannerCarouselComponent key={i} idx={i} data={d} />
            ))}
        </Slider>
      </Container>
    </section>
  )
}

export default BannerContainer
