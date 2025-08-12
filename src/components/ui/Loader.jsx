import React, { useEffect, useState } from 'react'

export default function Loader({ loading = false }) {
  const [visible, setVisible] = useState(loading)

  useEffect(() => {
    setVisible(loading)
    document.body.style.overflow = loading ? 'hidden' : 'auto'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [loading])

  if (!visible) return null

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: '#000',
        opacity: 1,
        zIndex: 1050,
      }}
    >
      <div className="spinner-border text-light" role="status" />
    </div>
  )
}
