/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["i.ibb.co", "dripbyrage.store", "i.pinimg.com", "placeholder.svg", "via.placeholder.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
}

module.exports = nextConfig
