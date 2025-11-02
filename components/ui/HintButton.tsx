'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store/useGameStore';
import { solveKlotski } from '@/lib/solver';

export function HintButton() {
  const t = useTranslations('hint');
  const { blocks, moveBlock } = useGameStore();
  const [loading, setLoading] = useState(false);

  const handleHint = async () => {
    setLoading(true);

    try {
      const result = solveKlotski(blocks);

      if (result.success && result.moves.length > 0) {
        const nextMove = result.moves[0];
        
        // 显示提示动画效果
        const block = blocks.find(b => b.id === nextMove.blockId);
        if (block) {
          // 执行移动
          moveBlock(nextMove.blockId, nextMove.to);
        }
      } else {
        alert(t('noHint'));
      }
    } catch (error) {
      console.error(t('error'), error);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleHint}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        loading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-yellow-400 text-gray-800 hover:bg-yellow-500 shadow-md hover:shadow-lg'
      }`}
      title={t('title')}
    >
      <span className="text-xl">💡</span>
      <span>{loading ? t('thinking') : t('button')}</span>
    </button>
  );
}

