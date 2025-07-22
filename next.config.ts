/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  // Позволяем сборке завершаться даже при ESLint / TS ошибках –
  // так захотел заказчик.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Изображения без оптимизации, + паттерн для внешних URL.
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
}

export default config
