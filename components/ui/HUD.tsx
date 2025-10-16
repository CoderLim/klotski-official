'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store/useGameStore';
import { getPuzzleIndex } from '@/lib/puzzles';
import { formatTime } from '@/lib/utils/grid';
import LanguageSwitcher from './LanguageSwitcher';

export default function HUD() {
  const t = useTranslations('hud');
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

  const levelNumber = getPuzzleIndex(currentPuzzle.slug);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-2 border-yellow-500 shadow-lg">
      <div className="max-w-4xl mx-auto px-3 py-1.5">
        {/* 语言切换器 */}
        <div className="flex justify-end mb-1">
          <LanguageSwitcher />
        </div>

        {/* 顶部：关卡编号和拼图名称 */}
        <div className="text-center mb-1.5">
          <h1 className="text-2xl font-bold text-green-400 mb-1">
            {t('levelNumber', { level: levelNumber })}
          </h1>
          <p className="text-sm text-gray-400">{currentPuzzle.name}</p>
        </div>

        {/* 统计信息 */}
        <div className="flex justify-center gap-3">
          {/* 移动步数 */}
          <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
            <span className="text-xl" aria-hidden="true">
              👣
            </span>
            <div className="text-xl font-bold text-white">{moves}</div>
          </div>

          {/* 用时 */}
          <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
            <span className="text-xl" aria-hidden="true">
              ⏱️
            </span>
            <div className="text-xl font-bold text-white font-mono">
              {formatTime(elapsedTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
