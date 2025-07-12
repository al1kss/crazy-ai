/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'al1kss-safetyai.hf.space',
      },
    ],
  },
}

module.exports = nextConfig