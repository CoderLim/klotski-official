'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store/useGameStore';
import { getPuzzleIndex } from '@/lib/puzzles';
import { formatTime } from '@/lib/utils/grid';
import LanguageSwitcher from './LanguageSwitcher';
import HistoryDialog from './HistoryDialog';

export default function HUD() {
  const t = useTranslations('hud');
  const tHistory = useTranslations('history');
  const { currentPuzzle, moves, startTime, elapsedTime, isWin, setElapsedTime, loadPuzzle } = useGameStore();
  const [showHistory, setShowHistory] = useState(false);

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
    <div className="flex-[1] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-l-2 border-yellow-500 shadow-lg flex flex-col h-full">
      <div className="px-6 py-6 flex flex-col h-full">
        {/* 语言切换器 */}
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>

        {/* 主内容区域 - 垂直居中 */}
        <div className="flex-1 flex flex-col justify-center gap-8">
          {/* 关卡编号和拼图名称 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-400 mb-2">
              {t('levelNumber', { level: levelNumber })}
            </h1>
            <p className="text-base text-gray-400">{currentPuzzle.name}</p>
          </div>

          {/* 统计信息 */}
          <div className="flex flex-col gap-4">
            {/* 移动步数 */}
            <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-700">
              <span className="text-2xl" aria-hidden="true">
                👣
              </span>
              <div className="flex flex-col flex-1">
                <span className="text-xs text-gray-400 uppercase">{t('moves')}</span>
                <div className="text-2xl font-bold text-white">{moves}</div>
              </div>
            </div>

            {/* 用时 */}
            <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-700">
              <span className="text-2xl" aria-hidden="true">
                ⏱️
              </span>
              <div className="flex flex-col flex-1">
                <span className="text-xs text-gray-400 uppercase">{t('time')}</span>
                <div className="text-2xl font-bold text-white font-mono">
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>
          </div>

          {/* 历史记录按钮 */}
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 border border-purple-500"
            aria-label={tHistory('viewHistory')}
          >
            <span className="text-xl">📜</span>
            <span>{tHistory('viewHistory')}</span>
          </button>
        </div>
      </div>

      {/* 历史记录对话框 */}
      <HistoryDialog
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectPuzzle={(slug) => {
          loadPuzzle(slug, true); // 标记为 replay
        }}
      />
    </div>
  );
}
