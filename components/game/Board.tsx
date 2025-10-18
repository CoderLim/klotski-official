'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useGameStore } from '@/lib/store/useGameStore';
import { tryMoveByKey } from '@/lib/engine/movement';
import { BOARD_ROWS, BOARD_COLS, CELL_SIZE, CELL_GAP } from '@/lib/utils/grid';
import { WIN_POSITION } from '@/lib/engine/win';
import Block from './Block';

export default function Board() {
  const { blocks, selectedBlockId, selectBlock, moveBlock } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(CELL_SIZE);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateCellSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const styles = window.getComputedStyle(container);
      const paddingX =
        parseFloat(styles.paddingLeft || '0') + parseFloat(styles.paddingRight || '0');
      const paddingY =
        parseFloat(styles.paddingTop || '0') + parseFloat(styles.paddingBottom || '0');

      const availableWidth = container.clientWidth - paddingX;
      const availableHeight = container.clientHeight - paddingY;

      if (availableWidth <= 0 || availableHeight <= 0) {
        return;
      }

      const nextCellSize = Math.floor(
        Math.min(availableWidth / BOARD_COLS, availableHeight / BOARD_ROWS)
      );

      if (!Number.isFinite(nextCellSize) || nextCellSize <= 0) {
        return;
      }

      setCellSize((prev) => (prev === nextCellSize ? prev : nextCellSize));
    };

    updateCellSize();

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateCellSize())
        : null;

    if (observer && containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateCellSize);

    return () => {
      if (observer && containerRef.current) {
        observer.unobserve(containerRef.current);
        observer.disconnect();
      }
      window.removeEventListener('resize', updateCellSize);
    };
  }, []);

  const boardWidth = BOARD_COLS * cellSize;
  const boardHeight = BOARD_ROWS * cellSize;

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
    <div ref={containerRef} className="flex justify-center items-center p-4 w-full h-full">
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
                    left: col * cellSize,
                    top: row * cellSize,
                    width: cellSize - CELL_GAP,
                    height: cellSize - CELL_GAP,
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
              left: WIN_POSITION[1] * cellSize,
              top: WIN_POSITION[0] * cellSize,
              width: 2 * cellSize - CELL_GAP,
              height: 2 * cellSize - CELL_GAP,
            }}
            className="border-4 border-dashed border-red-400/50 rounded-lg bg-red-100/20 pointer-events-none flex items-center justify-center"
            aria-label="目标出口"
          >
            <span className="text-4xl opacity-30">🚪</span>
          </div>

          {/* 方块 */}
          {blocks.map((block) => (
            <Block key={block.id} block={block} cellSize={cellSize} />
          ))}
        </div>
      </div>
    </div>
  );
}
