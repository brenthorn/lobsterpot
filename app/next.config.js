/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from Supabase and OAuth providers
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vyrgglxcesvvzeyhftdm.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig
