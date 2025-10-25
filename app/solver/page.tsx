'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/lib/store/useGameStore';
import Board from '@/components/game/Board';
import { SolverControl } from '@/components/ui/SolverControl';
import Link from 'next/link';
import { getAllPuzzles } from '@/lib/puzzles';

export default function SolverPage() {
  const searchParams = useSearchParams();
  const puzzleSlug = searchParams.get('puzzle') || 'hengdao';
  const { loadPuzzle, currentPuzzle, reset } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const puzzles = getAllPuzzles();

  useEffect(() => {
    setMounted(true);
    loadPuzzle(puzzleSlug);
  }, [puzzleSlug, loadPuzzle]);

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
                      loadPuzzle(newSlug);
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-lg font-semibold text-gray-800 shadow-sm"
                >
                  {puzzles.slice(0, 8).map((puzzle) => (
                    <option key={puzzle.slug} value={puzzle.slug}>
                      {puzzle.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <Board />
              </div>


              <button
                onClick={reset}
                className="w-full mt-4 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
              >
                🔄 Reset Board
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

