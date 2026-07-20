/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'https://studypilot-ai-server.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;