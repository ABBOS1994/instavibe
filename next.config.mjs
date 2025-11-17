/** @type {import('next').NextConfig} */
import { withBotId } from 'botid/next/config'

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'youtube.com',
      },
    ],
  },
}

export default withBotId(nextConfig)
