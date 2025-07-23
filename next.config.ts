/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

<<<<<<< HEAD
const nextConfig: NextConi = {
=======
  // Позволяем сборке завершаться даже при ESLint / TS ошибках –
  // так захотел заказчик.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Изображения без оптимизации, + паттерн для внешних URL.
>>>>>>> 35d4a088dc87e9ac243ec266ab78a58ef48dc05b
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
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

<<<<<<< HEAD
module.exports = nextConfig

export default nextConfig
=======
export default config
>>>>>>> 35d4a088dc87e9ac243ec266ab78a58ef48dc05b
