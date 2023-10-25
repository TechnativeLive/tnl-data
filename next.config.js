/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
    optimizePackageImports: ['@mantine/core', '@tabler/icons-react'],
  },
};

module.exports = nextConfig;
