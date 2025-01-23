/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: false
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  },
  experimental: {
    optimizeCss: true
  },
  output: 'standalone'  // Change back to standalone
}

module.exports = nextConfig