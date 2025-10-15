'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store/useGameStore';
import { formatTime } from '@/lib/utils/grid';

export default function HUD() {
  const t = useTranslations();
  const { currentPuzzle, moves, startTime, elapsedTime, setElapsedTime } = useGameStore();

  // 计时器
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, setElapsedTime]);

  if (!currentPuzzle) return null;

  const getDifficultyLabel = () => {
    return t(`difficulty.${currentPuzzle.difficulty}`);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-4 border-yellow-500 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* 顶部：拼图名称 */}
        <div className="text-center mb-3">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg">
            {t('common.appName')}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-lg text-gray-300">{currentPuzzle.name}</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                currentPuzzle.difficulty === 'easy'
                  ? 'bg-green-600 text-white'
                  : currentPuzzle.difficulty === 'medium'
                  ? 'bg-blue-600 text-white'
                  : currentPuzzle.difficulty === 'hard'
                  ? 'bg-orange-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {getDifficultyLabel()}
            </span>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex justify-center gap-6">
          {/* 移动步数 */}
          <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
            <span className="text-2xl" aria-hidden="true">
              👣
            </span>
            <div>
              <div className="text-xs text-gray-400">{t('hud.moves')}</div>
              <div className="text-xl font-bold text-white">{moves}</div>
            </div>
          </div>

          {/* 用时 */}
          <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
            <span className="text-2xl" aria-hidden="true">
              ⏱️
            </span>
            <div>
              <div className="text-xs text-gray-400">{t('hud.time')}</div>
              <div className="text-xl font-bold text-white font-mono">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
