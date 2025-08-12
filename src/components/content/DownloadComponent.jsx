import React from 'react'
import { Card, Col, Image } from 'react-bootstrap'
import Link from 'next/link'

const DownloadComponent = ({ data }) => {
  return (
    <Col md={6}>
      <Card className="slugCard">
        <Image src={'/icon/doc.svg'} width={64} height={64} alt={'icon'} />
        <div className="vr" />
        <Link className="right" href={data} target="_blank">
          Chatplace platformasiga havola
        </Link>
      </Card>
    </Col>
  )
}

export default DownloadComponent
