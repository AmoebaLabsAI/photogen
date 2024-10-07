/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    // Add this section to ignore the warning
    config.ignoreWarnings = [
      { module: /node_modules\/replicate/ },
    ];
    return config;
  },
};

module.exports = nextConfig;