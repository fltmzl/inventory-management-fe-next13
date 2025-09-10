/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
