import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 启用静态导出
  output: 'export',
  // 使用相对路径（重要：CrazyGames 等平台需要）
  assetPrefix: './',
  // 图片优化配置
  images: {
    unoptimized: true, // 静态导出需要禁用图片优化
  },
  // 如果部署到子路径，取消下面的注释并设置 basePath
  // basePath: '/your-app-name',
  // 禁用尾部斜杠（可选）
  trailingSlash: true,
};

export default nextConfig;
