import React from 'react'
import { Container, Row } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'
import SlugHeaderCard from '../content/SlugHeaderCard'
import SlugComponent from '../content/SlugComponent'
import SectionLayout from '../../Layout/SectionLayout'
import ChildSlider from './ChildSlider'
import { useRouter } from 'next/router'

export default function ChildContainer({ data, header }) {
  const { back } = useRouter()
  return (
    <section className="demoSlug">
      <Container>
        <div className="mb-4">
          <button className="learn-more" onClick={() => back()}>
            <span className="circle">
              <Image src="/icon/arrowLeft.svg" alt="arrow left icon" />
            </span>
            <span className="button-text">Ortga qaytish</span>
          </button>
        </div>

        {data && <SlugHeaderCard data={data} header={header} />}

        <Row className="slugComponent">
          {data?.map((d, i) => (
            <SlugComponent key={d._id || i} data={d} index={i} />
          ))}
        </Row>
      </Container>

      <SectionLayout text="VIDEODARSLAR" description="MAVZULAR">
        <Row>
          <ChildSlider data={data} />
        </Row>
      </SectionLayout>
    </section>
  )
}
