'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store/useGameStore';
import { formatTime } from '@/lib/utils/grid';
import LanguageSwitcher from './LanguageSwitcher';

export default function HUD() {
  const t = useTranslations();
  const { currentPuzzle, moves, startTime, elapsedTime, isWin, setElapsedTime } = useGameStore();

  // 计时器
  useEffect(() => {
    // 如果游戏还没开始或已经胜利，不启动计时器
    if (!startTime || isWin) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isWin, setElapsedTime]);

  if (!currentPuzzle) return null;

  const getDifficultyLabel = () => {
    return t(`difficulty.${currentPuzzle.difficulty}`);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-2 border-yellow-500 shadow-lg">
      <div className="max-w-4xl mx-auto px-3 py-1.5">
        {/* 语言切换器 */}
        <div className="flex justify-end mb-1">
          <LanguageSwitcher />
        </div>

        {/* 顶部：拼图名称 */}
        <div className="text-center mb-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-base text-gray-300">{currentPuzzle.name}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
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
        <div className="flex justify-center gap-3">
          {/* 移动步数 */}
          <div className="flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-700">
            <span className="text-lg" aria-hidden="true">
              👣
            </span>
            <div>
              <div className="text-xs text-gray-400">{t('hud.moves')}</div>
              <div className="text-base font-bold text-white">{moves}</div>
            </div>
          </div>

          {/* 用时 */}
          <div className="flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-700">
            <span className="text-lg" aria-hidden="true">
              ⏱️
            </span>
            <div>
              <div className="text-xs text-gray-400">{t('hud.time')}</div>
              <div className="text-base font-bold text-white font-mono">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
