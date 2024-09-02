/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.com",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "*.replicate.delivery",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    domains: ['bflapistorage.blob.core.windows.net'],
  },
  // You can remove or comment out the webpack configuration below
  // webpack: (config) => {
  //   config.module.rules.push({
  //     test: /\.(glb|gltf)$/,
  //     use: {
  //       loader: 'file-loader',
  //       options: {
  //         publicPath: '/_next/static/images',
  //         outputPath: 'static/images/',
  //       },
  //     },
  //   });
  //   return config;
  // },
};

module.exports = nextConfig;
