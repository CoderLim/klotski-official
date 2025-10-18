import type { Metadata } from 'next';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
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
  return (
    <html lang="zh">
      <head>
        {/* CrazyGames SDK */}
        <script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>
      </head>
      <body className="antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
