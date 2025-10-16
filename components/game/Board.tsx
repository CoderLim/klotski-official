'use client';

import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/lib/store/useGameStore';
import { tryMoveByKey } from '@/lib/engine/movement';
import { BOARD_ROWS, BOARD_COLS, CELL_SIZE, CELL_GAP } from '@/lib/utils/grid';
import { WIN_POSITION } from '@/lib/engine/win';
import Block from './Block';

export default function Board() {
  const { blocks, selectedBlockId, selectBlock, moveBlock } = useGameStore();

  const boardWidth = BOARD_COLS * CELL_SIZE;
  const boardHeight = BOARD_ROWS * CELL_SIZE;

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedBlockId) return;

      let direction: 'up' | 'down' | 'left' | 'right' | null = null;

      switch (e.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        case 'Enter':
          selectBlock(null);
          return;
        default:
          return;
      }

      if (direction) {
        e.preventDefault();
        const newPosition = tryMoveByKey(selectedBlockId, direction, blocks);
        if (newPosition) {
          moveBlock(selectedBlockId, newPosition);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, blocks, moveBlock, selectBlock]);

  // 点击空白区域取消选中
  const handleBoardClick = useCallback(() => {
    selectBlock(null);
  }, [selectBlock]);

  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative">
        {/* 棋盘容器 */}
        <div
          onClick={handleBoardClick}
          style={{
            width: boardWidth,
            height: boardHeight,
            position: 'relative',
          }}
          className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl shadow-2xl border-4 border-amber-800 overflow-hidden"
          role="grid"
          aria-label="华容道棋盘"
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
                  className="border border-amber-300/40 rounded"
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
            className="border-4 border-dashed border-red-400/50 rounded-lg bg-red-100/20 pointer-events-none flex items-center justify-center"
            aria-label="目标出口"
          >
            <span className="text-4xl opacity-30">🚪</span>
          </div>

          {/* 方块 */}
          {blocks.map((block) => (
            <Block key={block.id} block={block} cellSize={CELL_SIZE} />
          ))}
        </div>
      </div>
    </div>
  );
}

