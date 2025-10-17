'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store/useGameStore';
import { getAllPuzzles } from '@/lib/puzzles';
import HUD from '@/components/ui/HUD';
import Board from '@/components/game/Board';
import Controls from '@/components/ui/Controls';
import WinDialog from '@/components/ui/WinDialog';
import Confetti from '@/components/ui/Confetti';

export default function HomePage() {
  const t = useTranslations('controls');
  const {
    loadPuzzle,
    currentPuzzle,
    isWin,
    moves,
    elapsedTime,
    reset,
    undo,
    redo,
  } = useGameStore();

  const [showWinDialog, setShowWinDialog] = useState(false);

  // 加载第一个拼图
  useEffect(() => {
    const allPuzzles = getAllPuzzles();
    if (allPuzzles.length > 0 && !currentPuzzle) {
      loadPuzzle(allPuzzles[0].slug);
    }
  }, [loadPuzzle, currentPuzzle]);

  // 监听胜利状态
  useEffect(() => {
    if (isWin && !showWinDialog) {
      setShowWinDialog(true);
    }
  }, [isWin, showWinDialog]);

  // 全局快捷键
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // 阻止在输入框等元素中触发
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'u':
          e.preventDefault();
          undo();
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (confirm(t('resetConfirm'))) {
              reset();
            }
          } else {
            e.preventDefault();
            redo();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [undo, redo, reset, t]);

  // 处理下一关
  const handleNextLevel = () => {
    const allPuzzles = getAllPuzzles();
    const currentIndex = allPuzzles.findIndex((p) => p.slug === currentPuzzle?.slug);
    const nextPuzzle = currentIndex < allPuzzles.length - 1 ? allPuzzles[currentIndex + 1] : null;
    
    if (nextPuzzle) {
      setShowWinDialog(false);
      loadPuzzle(nextPuzzle.slug);
    }
  };

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col overflow-hidden">
      {/* 顶部状态栏 */}
      <HUD />

      {/* 游戏棋盘 */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Board />
      </div>

      {/* 控制按钮 */}
      <Controls />

      {/* 胜利对话框 */}
      <WinDialog
        isOpen={showWinDialog}
        onClose={() => setShowWinDialog(false)}
        moves={moves}
        time={elapsedTime}
        currentSlug={currentPuzzle.slug}
        onRestart={() => {
          setShowWinDialog(false);
          reset();
        }}
        onNextLevel={handleNextLevel}
      />

      {/* 胜利特效 */}
      <Confetti show={isWin} />
    </div>
  );
}
