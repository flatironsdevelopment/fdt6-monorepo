/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['api-authentication', '@fuel/ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
