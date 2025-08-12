import React from 'react'
import { Card } from 'react-bootstrap'
import {
  Instagram,
  Play,
  Telegram,
  Youtube,
} from '../../../../public/icon/Icons'
import YouTubeThumbnail from '../../YouTubeThumbnail '

const ResultCard = ({ content, handleChange }) => {
  const { ImgOverlay, Title, Text, Footer, Body, Link } = Card
  const { title, description, instagram, telegram, youtube, videoId } = content

  return (
    <Card className="studentCard">
      <YouTubeThumbnail
        videoId={videoId}
        onClick={() => handleChange(videoId)}
        className="card-img imgStudent"
      />

      <ImgOverlay>
        <Play />
      </ImgOverlay>

      <Body>
        <Title>{title}</Title>
        <Text>{description}</Text>
      </Body>

      <Footer>
        {instagram && (
          <Link href={instagram} target="_blank" rel="noopener noreferrer">
            <Instagram />
          </Link>
        )}
        {telegram && (
          <Link href={telegram} target="_blank" rel="noopener noreferrer">
            <Telegram />
          </Link>
        )}
        {youtube && (
          <Link href={youtube} target="_blank" rel="noopener noreferrer">
            <Youtube />
          </Link>
        )}
      </Footer>
    </Card>
  )
}

export default ResultCard
