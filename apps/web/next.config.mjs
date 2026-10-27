/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@schemacraft/audit-core'],
  output: 'export',
  // Canonical URL form is WITH trailing slash (Hostinger + this export).
  trailingSlash: true,
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
