'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 自动重定向到第一关（横刀立马）
    router.push('/p/hengdao');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
}
