/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  redirects: async () => [
    {
      source: '/',
      destination: "/dashboard",
      permanent: false,
    }
  ],
  experimental: {
    appDir: false
  }
};

export default nextConfig;
