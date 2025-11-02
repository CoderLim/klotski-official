import type { Metadata } from 'next';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Klotski Puzzle Game',
  description: 'Classic Chinese sliding block puzzle game - Move blocks to help Cao Cao escape through Huarong Pass',
  keywords: ['Klotski', 'puzzle game', 'sliding block puzzle', 'Huarong Pass', 'Cao Cao'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
