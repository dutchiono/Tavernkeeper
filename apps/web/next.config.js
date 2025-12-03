/** @type {import('next').NextConfig} */
const path = require('path');
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './docs/theme.config.tsx',
});

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@innkeeper/lib', '@innkeeper/engine', '@innkeeper/agents'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'thread-stream': false,
      'pino-elasticsearch': false,
      'pino-pretty': false,
      'tap': false,
      'desm': false,
      'fastbench': false,
    };
    return config;
  },
  serverExternalPackages: ['pino', 'thread-stream'],
  turbopack: {}, // Empty config to silence Turbopack warning when using webpack config
};

module.exports = withNextra(nextConfig);

