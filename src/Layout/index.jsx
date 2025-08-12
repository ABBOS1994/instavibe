import React from 'react'
import Footer from '../components/home/Footer'
import NavBar from '../components/home/NavBar'
import { Analytics } from '@vercel/analytics/react'

function Index({ children }) {
  return (
    <main data-bs-theme="dark">
      <NavBar />
      {children}
      <Analytics />
      <Footer />
    </main>
  )
}

export default Index
