/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@tabler/icons-react'],
    typedRoutes: true,
  },
};

module.exports = nextConfig;
