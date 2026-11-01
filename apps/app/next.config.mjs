/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Server app for app.schemacraft-ai.site. Static HTML export stays off.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
