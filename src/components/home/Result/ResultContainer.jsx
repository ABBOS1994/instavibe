import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import ResultCard from './ResultCard'
import Marquee from 'react-fast-marquee'
import ModalVideo from 'react-modal-video'

const ResultContainer = ({ direction, studentCardData }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('')

  const handleChange = (videoId) => {
    setSelectedVideo(videoId)
    setIsOpen(true)
  }

  return (
    <Container fluid className="studentContainer">
      <Marquee autoFill pauseOnHover direction={direction}>
        {studentCardData.map((s, i) => (
          <ResultCard key={i} content={s} handleChange={handleChange} />
        ))}
      </Marquee>
      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 0 }}
        isOpen={isOpen}
        videoId={selectedVideo}
        onClose={() => setIsOpen(false)}
      />
    </Container>
  )
}

export default ResultContainer
