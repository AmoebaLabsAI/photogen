/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore the replicate library's require warnings
    config.module.rules.push({
      test: /replicate\/lib\/util\.js/,
      use: 'null-loader',
    });

    return config;
  },
}

module.exports = nextConfig