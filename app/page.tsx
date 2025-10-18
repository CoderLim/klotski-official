'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store/useGameStore';
import { getAllPuzzles } from '@/lib/puzzles';
import { crazyGamesSDK } from '@/lib/utils/crazygames';
import HUD from '@/components/ui/HUD';
import Board from '@/components/game/Board';
import Controls from '@/components/ui/Controls';
import WinDialog from '@/components/ui/WinDialog';
import Confetti from '@/components/ui/Confetti';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 初始化 CrazyGames SDK
  useEffect(() => {
    crazyGamesSDK.init().then((success) => {
      if (success) {
        // SDK 初始化成功，通知游戏加载完成
        crazyGamesSDK.gameLoadingStop();
        crazyGamesSDK.gameplayStart();
      }
    });
  }, []);

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
      // 通知 CrazyGames 玩家达成快乐时刻
      crazyGamesSDK.happytime();
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
            setShowResetConfirm(true);
          } else {
            e.preventDefault();
            redo();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [undo, redo, t]);

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
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex overflow-hidden">
      {/* 左侧：游戏区域（棋盘 + 控制按钮）- 占 3/4 */}
      <div className="flex-[3] flex flex-col overflow-hidden">
        {/* 游戏棋盘 */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <Board />
        </div>

        {/* 控制按钮 */}
        <Controls />
      </div>

      {/* 右侧：状态栏 - 占 1/4 */}
      <HUD />

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

      {/* 重置确认对话框（快捷键触发）*/}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={reset}
        title={t('reset')}
        message={t('resetConfirm')}
        confirmText={t('reset')}
        cancelText={t('cancel')}
      />
    </div>
  );
}

