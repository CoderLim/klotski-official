'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAllPuzzles } from '@/lib/puzzles';
import { PuzzleConfig } from '@/lib/puzzles/types';
import PuzzlePreview from '@/components/game/PuzzlePreview';

export default function HomePage() {
  // 按困难度排序
  const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 };
  const puzzles = getAllPuzzles().sort((a, b) => {
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });

  const getDifficultyColor = (difficulty: PuzzleConfig['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'from-green-500 to-green-600';
      case 'medium':
        return 'from-blue-500 to-blue-600';
      case 'hard':
        return 'from-orange-500 to-orange-600';
      case 'expert':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyLabel = (difficulty: PuzzleConfig['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      case 'expert':
        return '专家';
      default:
        return '未知';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* 头部 */}
        <header className="text-center pt-12 pb-8 px-4">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-bold mb-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 drop-shadow-2xl">
              华容道
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-2"
          >
            Klotski Puzzle Game
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            中国传统益智游戏，移动方块让曹操从华容道逃脱
          </motion.p>
        </header>

        {/* 拼图选择 */}
        <main className="max-w-7xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-2">选择关卡</h2>
            <p className="text-gray-400">共 {puzzles.length} 个经典布局等你挑战</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {puzzles.map((puzzle, index) => (
              <motion.div
                key={puzzle.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              >
                <Link href={`/p/${puzzle.slug}`}>
                  <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer">
                    {/* 难度标签 */}
                    <div className="flex justify-start mb-2">
                      <div
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getDifficultyColor(
                          puzzle.difficulty
                        )}`}
                      >
                        {getDifficultyLabel(puzzle.difficulty)}
                      </div>
                    </div>

                    {/* 拼图名称 */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors text-center">
                      {puzzle.name}
                    </h3>

                    {/* 棋局预览 */}
                    <div className="mb-3">
                      <PuzzlePreview puzzle={puzzle} size={140} />
                    </div>

                    {/* 开始按钮 */}
                    <div className="flex items-center justify-center">
                      <span className="text-yellow-400 font-semibold group-hover:translate-x-2 transition-transform text-sm">
                        开始挑战 →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>

        {/* 页脚 */}
        <footer className="text-center py-8 px-4 text-gray-500 text-sm">
          <p>© 2024 华容道 Klotski Game | 使用 Next.js 14 + TypeScript + Zustand 构建</p>
          <p className="mt-2">支持鼠标拖拽、触摸操作和键盘控制</p>
        </footer>
      </div>
    </div>
  );
}
