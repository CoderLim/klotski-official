'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Modal from './Modal';
import PuzzlePreview from '@/components/game/PuzzlePreview';
import { getAllCompletionRecords, CompletionRecord } from '@/lib/store/useGameStore';
import { getAllPuzzles, getPuzzleBySlug, getPuzzleIndex } from '@/lib/puzzles';
import { formatTime } from '@/lib/utils/grid';

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPuzzle: (slug: string) => void;
}

export default function HistoryDialog({ isOpen, onClose, onSelectPuzzle }: HistoryDialogProps) {
  const t = useTranslations('history');
  const tCommon = useTranslations('common');
  const tDifficulty = useTranslations('difficulty');

  // 获取所有通关记录和拼图，按完成时间倒序排列
  const records = useMemo(() => {
    if (!isOpen) return [];
    const allRecords = getAllCompletionRecords();
    
    // 将记录转换为包含拼图信息的数组
    const recordsList = Object.values(allRecords)
      .map((record) => {
        const puzzle = getPuzzleBySlug(record.slug);
        if (!puzzle) return null;
        return {
          record,
          puzzle,
        };
      })
      .filter((item): item is { record: CompletionRecord; puzzle: ReturnType<typeof getPuzzleBySlug> } => item !== null);
    
    // 按完成时间倒序排列（最新的在前）
    recordsList.sort((a, b) => b.record.completedAt - a.record.completedAt);
    
    return recordsList;
  }, [isOpen]); // 当对话框打开时重新获取

  const handleReplay = (slug: string) => {
    onSelectPuzzle(slug);
    onClose();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'hard':
        return '🟠';
      case 'expert':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="w-full max-h-[80vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📜</span>
            {t('title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
            aria-label={tCommon('close')}
          >
            ×
          </button>
        </div>

        {/* 统计信息 */}
        <div className="mb-2 text-sm text-gray-300">
          {t('completedCount', { count: records.length, total: getAllPuzzles().length })}
        </div>

        {/* 记录列表 */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {records.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-base">{t('noRecords')}</p>
            </div>
          ) : (
            records.map(({ record, puzzle }) => {
              const levelNumber = getPuzzleIndex(puzzle.slug);
              return (
                <div
                  key={record.slug}
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex gap-3 items-center">
                    {/* 关卡预览 */}
                    <div className="shrink-0">
                      <PuzzlePreview puzzle={puzzle} size={80} />
                    </div>

                    {/* 关卡信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-base font-semibold text-white">
                          {t('levelNumber', { level: levelNumber })} - {puzzle.name}
                        </h3>
                        <span className="text-xs" title={tDifficulty(puzzle.difficulty)}>
                          {getDifficultyEmoji(puzzle.difficulty)}
                        </span>
                      </div>

                      {/* 统计数据 */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-xs text-gray-400 mb-0.5">{t('moves')}</div>
                          <div className="text-base font-bold text-white">{record.moves}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-0.5">{t('duration')}</div>
                          <div className="text-base font-bold text-white font-mono">
                            {formatTime(record.time)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-0.5">{t('completedAt')}</div>
                          <div className="text-xs text-gray-300">{formatDate(record.completedAt)}</div>
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮 - 放在最右边 */}
                    <div className="shrink-0">
                      <button
                        onClick={() => handleReplay(record.slug)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 text-xs whitespace-nowrap"
                      >
                        {t('replay')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}

