'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Modal from './Modal';
import { formatTime } from '@/lib/utils/grid';
import { getAllPuzzles } from '@/lib/puzzles';

interface WinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moves: number;
  time: number;
  currentSlug: string;
  onRestart: () => void;
}

export default function WinDialog({
  isOpen,
  onClose,
  moves,
  time,
  currentSlug,
  onRestart,
}: WinDialogProps) {
  const t = useTranslations('win');
  const router = useRouter();

  // 查找下一个拼图
  const allPuzzles = getAllPuzzles();
  const currentIndex = allPuzzles.findIndex((p) => p.slug === currentSlug);
  const nextPuzzle = currentIndex < allPuzzles.length - 1 ? allPuzzles[currentIndex + 1] : null;

  const handleNextPuzzle = () => {
    if (nextPuzzle) {
      router.push(`/p/${nextPuzzle.slug}`);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* 胜利图标 */}
        <div className="mb-6">
          <div className="text-8xl animate-bounce">🎉</div>
        </div>

        {/* 标题 */}
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">{t('title')}</h2>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">{t('moves')}</div>
            <div className="text-3xl font-bold text-white">{moves}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">{t('time')}</div>
            <div className="text-3xl font-bold text-white">{formatTime(time)}</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95"
            aria-label={t('playAgain')}
          >
            {t('playAgain')}
          </button>
          {nextPuzzle ? (
            <button
              onClick={handleNextPuzzle}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95"
              aria-label={t('nextLevel')}
            >
              {t('nextLevel')} →
            </button>
          ) : (
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95"
              aria-label={t('backHome')}
            >
              {t('backHome')}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
