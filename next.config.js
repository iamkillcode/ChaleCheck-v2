/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  swcMinify: true, // Re-enable for production
  typescript: {
    ignoreBuildErrors: false // Re-enable for production
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  }
}

module.exports = nextConfig