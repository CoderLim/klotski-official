import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '华容道 - Klotski Puzzle Game',
  description: '经典中国益智游戏华容道，使用 Next.js 14 开发，支持鼠标、触摸和键盘操作',
  keywords: ['华容道', 'Klotski', '益智游戏', '拼图', 'puzzle game'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
