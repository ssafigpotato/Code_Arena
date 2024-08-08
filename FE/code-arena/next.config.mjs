/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // React Strict Mode 비활성화
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: "dist",
};

export default nextConfig;
