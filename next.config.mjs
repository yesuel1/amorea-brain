import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Cloudflare Pages doesn't support Next.js Image Optimization
  },
};

// Development mode setup for Cloudflare Pages
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
