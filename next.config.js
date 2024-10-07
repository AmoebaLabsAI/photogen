/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add a rule to handle the replicate library
    config.module.rules.push({
      test: /node_modules\/replicate/,
      loader: 'ignore-loader'
    });

    return config;
  },
}

module.exports = nextConfig