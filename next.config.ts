import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    // не останавливать сборку, если есть ошибки ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // не останавливать сборку, если есть ошибки TypeScript
    ignoreBuildErrors: true,
  },
  images: {
    // отключаем оптимизацию изображений, чтобы избежать ошибок на build-time
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
    ],
  },
}

export default nextConfig
