'use client';

import { PuzzleConfig } from '@/lib/puzzles/types';
import { getColorByShape } from '@/lib/utils/colors';
import { WIN_POSITION } from '@/lib/engine/win';

interface PuzzlePreviewProps {
  puzzle: PuzzleConfig;
  size?: number; // 预览大小（像素）
}

export default function PuzzlePreview({ puzzle, size = 160 }: PuzzlePreviewProps) {
  const BOARD_ROWS = 5;
  const BOARD_COLS = 4;
  const CELL_SIZE = size / BOARD_ROWS; // 动态计算单元格大小
  const CELL_GAP = 2;
  const boardWidth = CELL_SIZE * BOARD_COLS; // 宽度 = 4列
  const boardHeight = size; // 高度 = 5行

  return (
    <div 
      style={{
        width: boardWidth,
        height: boardHeight,
        position: 'relative',
      }}
      className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-md border-2 border-amber-700 overflow-hidden mx-auto"
    >
      {/* 网格背景 */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: BOARD_ROWS }).map((_, row) =>
          Array.from({ length: BOARD_COLS }).map((_, col) => (
            <div
              key={`grid-${row}-${col}`}
              style={{
                position: 'absolute',
                left: col * CELL_SIZE,
                top: row * CELL_SIZE,
                width: CELL_SIZE - CELL_GAP,
                height: CELL_SIZE - CELL_GAP,
              }}
              className="border border-amber-300/30 rounded-sm"
            />
          ))
        )}
      </div>

      {/* 出口指示器 */}
      <div
        style={{
          position: 'absolute',
          left: WIN_POSITION[1] * CELL_SIZE,
          top: WIN_POSITION[0] * CELL_SIZE,
          width: 2 * CELL_SIZE - CELL_GAP,
          height: 2 * CELL_SIZE - CELL_GAP,
        }}
        className="border-2 border-dashed border-red-400/40 rounded bg-red-100/10 pointer-events-none flex items-center justify-center"
      >
        <span className="text-lg opacity-20">🚪</span>
      </div>

      {/* 方块 */}
      {puzzle.blocks.map((block, index) => {
        const [row, col] = block.position;
        const [rows, cols] = block.shape;
        const color = getColorByShape(block.shape);
        const isTarget = rows === 2 && cols === 2;

        const pixelX = col * CELL_SIZE;
        const pixelY = row * CELL_SIZE;
        const width = cols * CELL_SIZE - CELL_GAP;
        const height = rows * CELL_SIZE - CELL_GAP;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: pixelX,
              top: pixelY,
              width,
              height,
              backgroundColor: color,
            }}
            className={`
              rounded pointer-events-none
              border shadow-sm
              ${isTarget ? 'border-red-700' : 'border-gray-700'}
            `}
          >
            {/* 曹操标记 */}
            {isTarget && (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white font-bold text-xs opacity-60">曹</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

