'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { BlockData, Position } from '@/lib/puzzles/types';
import { useGameStore } from '@/lib/store/useGameStore';
import { calculateDragPosition, canMoveTo } from '@/lib/engine/movement';
import { CELL_SIZE, CELL_GAP, gridToPixel } from '@/lib/utils/grid';
import { getBlockName, isTargetBlock } from '@/lib/utils/colors';

interface BlockProps {
  block: BlockData;
  cellSize?: number;
}

export default function Block({ block, cellSize = CELL_SIZE }: BlockProps) {
  const t = useTranslations('blocks');
  const tBoard = useTranslations('board');
  const tCommon = useTranslations('common');
  const { blocks, moveBlock, selectedBlockId, selectBlock } = useGameStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef<Position>([0, 0]);
  const currentValidPos = useRef<Position>([0, 0]); // 当前有效的网格位置
  const pointerStartRef = useRef({ x: 0, y: 0 });

  const isSelected = selectedBlockId === block.id;
  const isTarget = isTargetBlock(block.shape);

  // 计算方块的像素位置和尺寸
  const [row, col] = block.position;
  const [rows, cols] = block.shape;

  const pixelX = col * cellSize;
  const pixelY = row * cellSize;
  const width = cols * cellSize - CELL_GAP;
  const height = rows * cellSize - CELL_GAP;

  // 开始拖拽
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      setIsDragging(true);
      dragStartPos.current = block.position;
      currentValidPos.current = block.position; // 初始化为当前位置
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      setDragOffset({ x: 0, y: 0 });
      selectBlock(block.id);
    },
    [block.id, block.position, selectBlock]
  );

  // 拖拽中
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - pointerStartRef.current.x;
      const deltaY = e.clientY - pointerStartRef.current.y;

      // 计算目标网格位置
      const targetPosition = calculateDragPosition(block, { x: deltaX, y: deltaY }, cellSize);

      const [currentRow, currentCol] = currentValidPos.current;
      const [targetRow, targetCol] = targetPosition;
      const rowDiff = Math.abs(targetRow - currentRow);
      const colDiff = Math.abs(targetCol - currentCol);
      const isSamePosition = currentRow === targetRow && currentCol === targetCol;

      // 只允许步进到相邻位置（最多相差1格，且只能横向或纵向移动）
      const isAdjacentMove = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);

      if (!isSamePosition && isAdjacentMove && canMoveTo(block.id, targetPosition, blocks)) {
        const moved = moveBlock(block.id, targetPosition);
        if (moved) {
          currentValidPos.current = targetPosition;
          dragStartPos.current = targetPosition;
          pointerStartRef.current = { x: e.clientX, y: e.clientY };
          setDragOffset({ x: 0, y: 0 });
          return;
        }
      }

      // 计算应该显示的偏移量（基于当前有效位置）
      const [validRow, validCol] = currentValidPos.current;
      const [startRow, startCol] = dragStartPos.current;

      const validOffsetX = (validCol - startCol) * cellSize;
      const validOffsetY = (validRow - startRow) * cellSize;

      setDragOffset({ x: validOffsetX, y: validOffsetY });
    },
    [isDragging, block, blocks, cellSize, moveBlock]
  );

  // 结束拖拽
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;

      const target = e.currentTarget as HTMLElement;
      target.releasePointerCapture(e.pointerId);

      setIsDragging(false);

      // 使用拖动过程中验证过的有效位置
      const finalPosition = currentValidPos.current;
      
      // 检查是否真的移动了位置
      const [startRow, startCol] = dragStartPos.current;
      const [finalRow, finalCol] = finalPosition;
      const hasMoved = startRow !== finalRow || startCol !== finalCol;

      if (hasMoved) {
        // 尝试移动到最终位置
        moveBlock(block.id, finalPosition);
      }

      // 重置拖拽偏移
      setDragOffset({ x: 0, y: 0 });
    },
    [isDragging, block.id, moveBlock]
  );

  // 点击选中（用于键盘控制）
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isDragging) {
        selectBlock(isSelected ? null : block.id);
      }
    },
    [isDragging, isSelected, block.id, selectBlock]
  );

  return (
    <motion.div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: pixelX,
        top: pixelY,
        width,
        height,
        backgroundColor: block.color,
        x: dragOffset.x,
        y: dragOffset.y,
        zIndex: isDragging ? 50 : isTarget ? 20 : 10,
      }}
      className={`
        rounded-lg cursor-grab active:cursor-grabbing touch-none select-none
        border-2 shadow-lg
        ${isTarget ? 'border-red-700 shadow-red-500/50' : 'border-gray-800'}
        ${isSelected ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
        ${isDragging ? 'opacity-90' : 'opacity-100'}
        transition-opacity
      `}
      animate={{
        scale: isDragging ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      role="button"
      aria-label={tBoard('blockPosition', { 
        name: (() => {
          const [rows, cols] = block.shape;
          if (rows === 2 && cols === 2) return t('caocao');
          if (rows === 2 && cols === 1) return t('vertical');
          if (rows === 1 && cols === 2) return t('horizontal');
          if (rows === 1 && cols === 1) return t('soldier');
          return t('unknown');
        })(), 
        row: row + 1, 
        col: col + 1 
      })}
      aria-pressed={isSelected}
      tabIndex={0}
    >
      {/* 方块内容 - 显示名称（可选） */}
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-white font-bold text-shadow select-none pointer-events-none opacity-75">
          {isTarget ? tCommon('caocao') : ''}
        </span>
      </div>
    </motion.div>
  );
}
