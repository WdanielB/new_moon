const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js that THIS directory is the project root (avoids
  // the multi-lockfile workspace-root mis-detection on Heroku).
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

module.exports = nextConfig;
