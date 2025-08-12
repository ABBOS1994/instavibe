import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'react-bootstrap/Image'
import { Container, Row } from 'react-bootstrap'
import IdHeaderCard from './content/IdHeaderCard'
import React from 'react'
import DownloadComponent from './content/DownloadComponent'

export default function ContentComponent({ data, idx }) {
  const { query, back } = useRouter()
  return (
    <section className="demoSlug">
      <Container>
        <button className="learn-more" onClick={() => back()}>
          <span className="circle">
            <Image src="/icon/arrowLeft.svg" alt="arrow left icon" />
          </span>
          <Link href={`/cabinet/${query.child}`} className="button-text">
            ortga qaytish
          </Link>
        </button>

        {data && <IdHeaderCard data={data} idx={idx} />}

        {data?.video && (
          <iframe
            src={data?.video}
            loading="lazy"
            width="100%"
            height="735px"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="videoIframe"
          />
        )}

        <Row className="slugComponent">
          {data?.file && <DownloadComponent data={data.file} />}
        </Row>
      </Container>
    </section>
  )
}
