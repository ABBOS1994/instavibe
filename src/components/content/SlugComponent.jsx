// ✅ Optimallashtirilgan SlugComponent.jsx (demo yo'q)
import React from 'react'
import { Card, Col, Image } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SlugComponent = ({ data, index }) => {
  const { query } = useRouter()

  return (
    <Col lg={6} sm={12}>
      {data?._id ? (
        <Card className="slugCard">
          <Image
            src={'/icon/videoPlaylist.svg'}
            width={64}
            height={64}
            alt={'icon'}
          />
          <div className="vr" />
          <Link className="right" href={`/cabinet/${query.child}/${data._id}`}>
            <span className="number">
              {(index >= 9 ? '' : 0) + (index + 1)}
            </span>{' '}
            - {data.title}
          </Link>
        </Card>
      ) : (
        <Card className="slugCard disabled">
          <Image
            src={'/icon/videoPlaylist.svg'}
            width={64}
            height={64}
            alt={'icon'}
          />
          <div className="vr" />
          <span className="right">
            <span className="number">
              {(index >= 9 ? '' : 0) + (index + 1)}
            </span>{' '}
            - {data.title}
          </span>
        </Card>
      )}
    </Col>
  )
}

export default SlugComponent
