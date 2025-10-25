'use client';

import { useEffect, useMemo, useState, type DragEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Board from '@/components/game/Board';
import { SolverControl } from '@/components/ui/SolverControl';
import { useGameStore } from '@/lib/store/useGameStore';
import { getAllPuzzles } from '@/lib/puzzles';
import { Shape } from '@/lib/puzzles/types';
import { getBlockName, getColorByShape } from '@/lib/utils/colors';
import { useShallow } from 'zustand/react/shallow';

const CUSTOM_PUZZLE_SLUG = 'custom';

const PALETTE_SHAPES: Shape[] = [
  [2, 2],
  [2, 1],
  [1, 2],
  [1, 1],
];

function PaletteItem({ shape }: { shape: Shape }) {
  const label = getBlockName(shape);
  const color = getColorByShape(shape);
  const [rows, cols] = shape;

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ shape })
    );

    const dragPreview = document.createElement('div');
    dragPreview.style.width = `${cols * 40}px`;
    dragPreview.style.height = `${rows * 40}px`;
    dragPreview.style.background = color;
    dragPreview.style.opacity = '0.8';
    dragPreview.style.borderRadius = '8px';
    dragPreview.style.border = '2px solid rgba(0,0,0,0.15)';
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, (cols * 40) / 2, (rows * 40) / 2);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
    >
      <div
        className="grid place-items-center rounded-lg shadow-inner border-2 border-white"
        style={{
          backgroundColor: color,
          width: cols * 48,
          height: rows * 48,
        }}
      />
      <span className="text-xs text-gray-500">{rows}×{cols}</span>
    </div>
  );
}

export default function SolverPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const puzzleSlug = searchParams.get('puzzle') || CUSTOM_PUZZLE_SLUG;
  const {
    loadPuzzle,
    loadCustomBoard,
    reset,
    isCustomBoard,
    selectedBlockId,
    removeBlock,
  } = useGameStore(
    useShallow((state) => ({
      loadPuzzle: state.loadPuzzle,
      loadCustomBoard: state.loadCustomBoard,
      reset: state.reset,
      isCustomBoard: state.isCustomBoard,
      selectedBlockId: state.selectedBlockId,
      removeBlock: state.removeBlock,
    }))
  );
  const [mounted, setMounted] = useState(false);
  const puzzles = getAllPuzzles();

  const puzzleOptions = useMemo(
    () => [
      { slug: CUSTOM_PUZZLE_SLUG, name: '🧩 自定义空棋盘' },
      ...puzzles.map((puzzle) => ({ slug: puzzle.slug, name: puzzle.name })),
    ],
    [puzzles]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (puzzleSlug === CUSTOM_PUZZLE_SLUG) {
      loadCustomBoard();
    } else {
      loadPuzzle(puzzleSlug);
    }
  }, [mounted, puzzleSlug, loadPuzzle, loadCustomBoard]);

  const handlePuzzleChange = (newSlug: string) => {
    router.replace(`/solver?puzzle=${encodeURIComponent(newSlug)}`, { scroll: false });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="text-white text-2xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* 头部 */}
        <div className="mb-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors mb-4"
          >
            <span className="text-2xl">←</span>
            <span className="font-semibold">Back to Game</span>
          </Link>
          <h1 className="text-5xl font-bold text-white mb-2">
            🤖 Klotski Solver
          </h1>
          <p className="text-xl text-white/90">
            Let AI help you find the optimal solution path
          </p>
        </div>

        {/* 主内容区 */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* 左侧：游戏棋盘 */}
          <div className="space-y-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
              {/* 拼图选择下拉菜单 */}
              <div className="mb-4">
                <select
                  value={puzzleSlug}
                  onChange={(e) => {
                    const newSlug = e.target.value;
                    if (newSlug !== puzzleSlug) {
                      handlePuzzleChange(newSlug);
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-lg font-semibold text-gray-800 shadow-sm"
                >
                  {puzzleOptions.map((option) => (
                    <option key={option.slug} value={option.slug}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <Board />
              </div>

              {isCustomBoard && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {PALETTE_SHAPES.map((shape) => (
                      <div key={shape.join('x')} className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                        <PaletteItem shape={shape} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={reset}
                className="w-full mt-4 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
              >
                {isCustomBoard ? '🧼 Clear Board' : '🔄 Reset Board'}
              </button>
            </div>

            
          </div>

          {/* 右侧：求解器控制 */}
          <div className="space-y-4">
            <SolverControl />


          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-8 text-center text-white/80 text-sm">
          <p>Klotski Solver | Built with TypeScript + Next.js</p>
        </div>
      </div>
    </div>
  );
}
