const injectWhyDidYouRender = require('./lib/wdyr');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@tabler/icons-react'],
    typedRoutes: true,
  },
  webpack: (config, context) => {
    injectWhyDidYouRender(config, context);
    return config;
  },
};

module.exports = nextConfig;
