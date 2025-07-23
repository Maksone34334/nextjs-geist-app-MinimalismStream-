import type { NextConfig } from 'next'

const nextConfig: NextConi = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
},
/** @type {import('next').NextConfig} */
const NextConig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig

export default nextConfig
