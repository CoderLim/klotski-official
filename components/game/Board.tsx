'use client';

import { useEffect, useCallback, useRef, useState, type DragEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/lib/store/useGameStore';
import { tryMoveByKey } from '@/lib/engine/movement';
import { BOARD_ROWS, BOARD_COLS, CELL_SIZE, CELL_GAP } from '@/lib/utils/grid';
import { WIN_POSITION } from '@/lib/engine/win';
import Block from './Block';
import { Shape } from '@/lib/puzzles/types';
import { useShallow } from 'zustand/react/shallow';

export default function Board() {
  const t = useTranslations('board');
  const { blocks, selectedBlockId, selectBlock, moveBlock, addBlock, isCustomBoard } =
    useGameStore(
      useShallow((state) => ({
        blocks: state.blocks,
        selectedBlockId: state.selectedBlockId,
        selectBlock: state.selectBlock,
        moveBlock: state.moveBlock,
        addBlock: state.addBlock,
        isCustomBoard: state.isCustomBoard,
      }))
    );
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(CELL_SIZE);
  const [isDragActive, setIsDragActive] = useState(false);

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

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (!isCustomBoard) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (!isDragActive) {
        setIsDragActive(true);
      }
    },
    [isCustomBoard, isDragActive]
  );

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (!isCustomBoard) return;

      const nextTarget = e.relatedTarget as Node | null;
      if (nextTarget && e.currentTarget.contains(nextTarget)) {
        return;
      }

      if (isDragActive) {
        setIsDragActive(false);
      }
    },
    [isCustomBoard, isDragActive]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (!isCustomBoard) return;
      e.preventDefault();
      setIsDragActive(false);

      const payload = e.dataTransfer.getData('application/json');
      if (!payload || !boardRef.current) return;

      try {
        const data = JSON.parse(payload) as { shape?: Shape };
        if (!data.shape) return;

        const rect = boardRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        if (cellSize <= 0) return;

        const [shapeRows, shapeCols] = data.shape;

        const clampIndex = (value: number, min: number, max: number) =>
          Math.max(min, Math.min(value, max));

        const cellRow = clampIndex(Math.floor(offsetY / cellSize), 0, BOARD_ROWS - 1);
        const cellCol = clampIndex(Math.floor(offsetX / cellSize), 0, BOARD_COLS - 1);

        const createAxisCandidates = (
          pointerIndex: number,
          shapeSpan: number,
          maxCells: number
        ) => {
          const candidates = new Map<number, number>();
          const minStart = pointerIndex - shapeSpan + 1;
          const maxStart = pointerIndex;

          for (let start = minStart; start <= maxStart; start += 1) {
            const clampedStart = clampIndex(start, 0, maxCells - shapeSpan);
            if (
              pointerIndex < clampedStart ||
              pointerIndex > clampedStart + shapeSpan - 1
            ) {
              continue;
            }

            const center = clampedStart + (shapeSpan - 1) / 2;
            const score = Math.abs(pointerIndex - center);
            const existing = candidates.get(clampedStart);

            if (existing === undefined || score < existing) {
              candidates.set(clampedStart, score);
            }
          }

          if (candidates.size === 0) {
            const fallbackStart = clampIndex(pointerIndex, 0, maxCells - shapeSpan);
            const center = fallbackStart + (shapeSpan - 1) / 2;
            candidates.set(fallbackStart, Math.abs(pointerIndex - center));
          }

          return Array.from(candidates.entries())
            .map(([start, score]) => ({ start, score }))
            .sort((a, b) => (a.score - b.score) || (a.start - b.start));
        };

        const rowCandidates = createAxisCandidates(cellRow, shapeRows, BOARD_ROWS);
        const colCandidates = createAxisCandidates(cellCol, shapeCols, BOARD_COLS);

        const candidateMap = new Map<string, { position: [number, number]; score: number }>();

        for (const row of rowCandidates) {
          for (const col of colCandidates) {
            const key = `${row.start}-${col.start}`;
            const score = row.score + col.score;
            const existing = candidateMap.get(key);

            if (!existing || score < existing.score) {
              candidateMap.set(key, { position: [row.start, col.start], score });
            }
          }
        }

        const fallbackRow = clampIndex(
          cellRow - Math.floor(shapeRows / 2),
          0,
          BOARD_ROWS - shapeRows
        );
        const fallbackCol = clampIndex(
          cellCol - Math.floor(shapeCols / 2),
          0,
          BOARD_COLS - shapeCols
        );
        const fallbackKey = `${fallbackRow}-${fallbackCol}`;
        if (!candidateMap.has(fallbackKey)) {
          const fallbackScore =
            Math.abs(cellRow - (fallbackRow + (shapeRows - 1) / 2)) +
            Math.abs(cellCol - (fallbackCol + (shapeCols - 1) / 2));
          candidateMap.set(fallbackKey, {
            position: [fallbackRow, fallbackCol],
            score: fallbackScore,
          });
        }

        const candidates = Array.from(candidateMap.values()).sort(
          (a, b) =>
            a.score - b.score ||
            a.position[0] - b.position[0] ||
            a.position[1] - b.position[1]
        );

        let createdId: string | null = null;

        for (const candidate of candidates) {
          createdId = addBlock(data.shape, candidate.position);
          if (createdId) break;
        }

        if (!createdId) {
          console.warn(t('cantPlace'));
        }
      } catch (error) {
        console.error(t('parseError'), error);
      }
    },
    [addBlock, cellSize, isCustomBoard, t]
  );

  return (
    <div ref={containerRef} className="flex justify-center items-center p-4 w-full h-full">
      <div className="relative">
        {/* 棋盘容器 */}
        <div
          ref={boardRef}
          onClick={handleBoardClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            width: boardWidth,
            height: boardHeight,
            position: 'relative',
          }}
          className={`bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl shadow-2xl border-4 overflow-hidden transition-shadow ${
            isDragActive ? 'border-blue-500 shadow-blue-300/70' : 'border-amber-800'
          }`}
          role="grid"
          aria-label={t('ariaLabel')}
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
            aria-label={t('exitLabel')}
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
