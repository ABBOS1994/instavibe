import React, { useState } from 'react'

const YouTubeThumbnail = ({
  videoId,
  className = '',
  onClick,
  alt = 'YouTube preview',
}) => {
  const [errorFallback, setErrorFallback] = useState(false)

  const getImageUrl = () => {
    return errorFallback
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  return (
    <img
      src={getImageUrl()}
      onClick={onClick}
      onError={() => setErrorFallback(true)}
      alt={alt}
      className={className}
    />
  )
}

export default YouTubeThumbnail
