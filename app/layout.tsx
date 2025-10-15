import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Klotski Puzzle Game - 华容道',
  description: 'Classic Chinese sliding block puzzle game - 经典中国益智游戏华容道',
  keywords: ['华容道', 'Klotski', '益智游戏', '拼图', 'puzzle game'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
