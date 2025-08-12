// pages/_app.js
import '../main.scss'
import React from 'react'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar'
import { ToastContainer } from 'react-toastify'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Loader from '../components/ui/Loader'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Instavibe - Shaxsiy brend qurishni bugundan boshla</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="O'zbekistondagi 1 - shaxsiy brend qurish boyicha online platforma"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NextNProgress
        options={{
          easing: 'ease',
          speed: 500,
        }}
        color="#C3FF51"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />

      <Loader />

      <Component {...pageProps} />

      <ToastContainer position="bottom-center" theme="dark" />

      <SpeedInsights />
    </>
  )
}
