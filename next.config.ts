import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 仅在生产环境启用静态导出
  ...(isProd && { output: 'export' }),
  // 仅在生产环境使用相对路径（重要：CrazyGames 等平台需要）
  ...(isProd && { assetPrefix: './' }),
  // 图片优化配置
  images: {
    unoptimized: true, // 静态导出需要禁用图片优化
  },
  // 如果部署到子路径，取消下面的注释并设置 basePath
  // basePath: '/your-app-name',
  // 仅在生产环境禁用尾部斜杠
  ...(isProd && { trailingSlash: true }),
};

export default nextConfig;
