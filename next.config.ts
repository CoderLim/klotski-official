import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 图片优化配置
  images: {
    domains: [],
  },
};

export default withNextIntl(nextConfig);
