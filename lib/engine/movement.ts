import { BlockData, Position } from '../puzzles/types';
import { isWithinBounds, constrainPosition } from './validation';
import { hasCollision } from './collision';
import { pixelToGridOffset, CELL_SIZE } from '../utils/grid';

/**
 * 计算拖拽后的目标位置
 * @param block 方块数据
 * @param dragDelta 拖拽的像素偏移量 {x, y}
 * @param cellSize 单元格大小
 * @returns 新的网格位置
 */
export function calculateDragPosition(
  block: BlockData,
  dragDelta: { x: number; y: number },
  cellSize: number = CELL_SIZE
): Position {
  const [currentRow, currentCol] = block.position;

  // 将像素偏移转换为网格偏移
  const rowOffset = pixelToGridOffset(dragDelta.y, cellSize);
  const colOffset = pixelToGridOffset(dragDelta.x, cellSize);

  const newRow = currentRow + rowOffset;
  const newCol = currentCol + colOffset;

  // 约束在边界内
  return constrainPosition(block.shape, [newRow, newCol]);
}

/**
 * 尝试移动方块到新位置
 * @param blockId 方块ID
 * @param newPosition 目标位置
 * @param allBlocks 所有方块列表
 * @returns 移动是否成功（合法且无碰撞）
 */
export function canMoveTo(
  blockId: string,
  newPosition: Position,
  allBlocks: BlockData[]
): boolean {
  const block = allBlocks.find((b) => b.id === blockId);
  if (!block) return false;

  // 检查边界
  if (!isWithinBounds(block.shape, newPosition)) {
    return false;
  }

  // 检查碰撞
  if (hasCollision(blockId, newPosition, allBlocks)) {
    return false;
  }

  return true;
}

/**
 * 尝试按方向键移动方块（1格）
 * @param blockId 方块ID
 * @param direction 方向 'up' | 'down' | 'left' | 'right'
 * @param allBlocks 所有方块列表
 * @returns 新位置，如果无法移动则返回null
 */
export function tryMoveByKey(
  blockId: string,
  direction: 'up' | 'down' | 'left' | 'right',
  allBlocks: BlockData[]
): Position | null {
  const block = allBlocks.find((b) => b.id === blockId);
  if (!block) return null;

  const [row, col] = block.position;
  let newPosition: Position;

  switch (direction) {
    case 'up':
      newPosition = [row - 1, col];
      break;
    case 'down':
      newPosition = [row + 1, col];
      break;
    case 'left':
      newPosition = [row, col - 1];
      break;
    case 'right':
      newPosition = [row, col + 1];
      break;
    default:
      return null;
  }

  if (canMoveTo(blockId, newPosition, allBlocks)) {
    return newPosition;
  }

  return null;
}

/**
 * 计算方块移动的距离（用于动画）
 */
export function calculateMoveDistance(from: Position, to: Position): { rows: number; cols: number } {
  return {
    rows: to[0] - from[0],
    cols: to[1] - from[1],
  };
}


