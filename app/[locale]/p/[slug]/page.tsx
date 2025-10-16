'use client';

import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useGameStore } from '@/lib/store/useGameStore';
import { getPuzzleBySlug } from '@/lib/puzzles';
import HUD from '@/components/ui/HUD';
import Board from '@/components/game/Board';
import Controls from '@/components/ui/Controls';
import WinDialog from '@/components/ui/WinDialog';
import Confetti from '@/components/ui/Confetti';
import { playSound, setMuted } from '@/lib/utils/sound';

interface GamePageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const t = useTranslations('controls');
  const router = useRouter();
  const {
    loadPuzzle,
    currentPuzzle,
    isWin,
    moves,
    elapsedTime,
    reset,
    isMuted,
    undo,
    redo,
  } = useGameStore();

  const [showWinDialog, setShowWinDialog] = useState(false);
  const [hasPlayedWinSound, setHasPlayedWinSound] = useState(false);

  // 加载拼图
  useEffect(() => {
    const puzzle = getPuzzleBySlug(slug);
    if (!puzzle) {
      // 拼图不存在，跳转回首页
      router.push('/');
      return;
    }

    loadPuzzle(slug);
  }, [slug, loadPuzzle, router]);

  // 监听胜利状态
  useEffect(() => {
    if (isWin && !showWinDialog) {
      setShowWinDialog(true);
      
      // 播放胜利音效（只播放一次）
      if (!hasPlayedWinSound && !isMuted) {
        playSound('win');
        setHasPlayedWinSound(true);
      }
    }
  }, [isWin, showWinDialog, hasPlayedWinSound, isMuted]);

  // 同步静音状态
  useEffect(() => {
    setMuted(isMuted);
  }, [isMuted]);

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
        currentSlug={slug}
        onRestart={() => {
          setShowWinDialog(false);
          setHasPlayedWinSound(false);
          reset();
        }}
      />

      {/* 胜利特效 */}
      <Confetti show={isWin} />
    </div>
  );
}
