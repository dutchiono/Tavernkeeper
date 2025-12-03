import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/** @type {import('next').NextConfig} */
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

export default nextConfig;
