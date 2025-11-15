'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore, getCurrentPuzzleSlug, getPreviousPuzzleSlug, loadGameState, saveCurrentGameState } from '@/lib/store/useGameStore';
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
  const tCommon = useTranslations('common');
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

  // 加载拼图（优先加载保存的当前关卡）
  useEffect(() => {
    const allPuzzles = getAllPuzzles();
    if (allPuzzles.length > 0 && !currentPuzzle) {
      // 尝试加载保存的当前关卡
      const savedSlug = getCurrentPuzzleSlug();
      let puzzleToLoad = savedSlug && allPuzzles.find(p => p.slug === savedSlug)
        ? savedSlug
        : allPuzzles[0].slug;
      
      // 如果当前关卡没有进度（可能是从历史记录 replay 但未完成），尝试恢复之前正在玩的关卡
      if (savedSlug) {
        const savedState = loadGameState(savedSlug);
        // 如果没有保存的状态，说明可能是 replay 后未完成就离开了
        if (!savedState || !savedState.blocks) {
          const previousSlug = getPreviousPuzzleSlug();
          if (previousSlug && allPuzzles.find(p => p.slug === previousSlug)) {
            puzzleToLoad = previousSlug;
          }
        }
      }
      
      loadPuzzle(puzzleToLoad);
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

  // 页面关闭前自动保存游戏状态
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentGameState();
    };

    const handleVisibilityChange = () => {
      // 当页面变为隐藏时（切换标签页、最小化等），保存状态
      if (document.hidden) {
        saveCurrentGameState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
        <div className="text-white text-2xl">{tCommon('loading')}</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex overflow-hidden">
      {/* 左侧：游戏区域（棋盘 + 控制按钮）- 占 3/4 */}
      <div className="flex-1 md:flex-[3] flex flex-col overflow-hidden">
        {/* 游戏棋盘 */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <Board />
        </div>

        {/* 控制按钮 - 移动端隐藏 */}
        <div className="hidden md:block">
          <Controls />
        </div>
      </div>

      {/* 右侧：状态栏 - 占 1/4，移动端隐藏 */}
      <div className="hidden md:block md:flex-[1]">
        <HUD />
      </div>

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

