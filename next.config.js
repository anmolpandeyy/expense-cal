/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  // Configure the base path if your repository name is not the username.github.io format
  basePath: '/expense-cal',
  // Disable image optimization since it's not supported in static exports
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig; 