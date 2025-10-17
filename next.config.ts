import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 图片优化配置
  images: {
    domains: [],
  },
};

export default nextConfig;
