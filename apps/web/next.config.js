/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@innkeeper/lib', '@innkeeper/engine', '@innkeeper/agents'],
};

module.exports = nextConfig;

