import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local /public assets (default). Add remote domains here if needed.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
