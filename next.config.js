/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-domain.com'], // or ['localhost'] for local development
    unoptimized: true,
  },
}

module.exports = nextConfig
