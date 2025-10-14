import { BlockData, Position, Shape } from '../puzzles/types';
import { occupiesCells, hasOverlap } from '../utils/grid';

/**
 * 检测指定方块在新位置是否与其他方块发生碰撞
 * @param blockId 要检测的方块ID
 * @param newPosition 新位置
 * @param allBlocks 所有方块列表
 * @returns 是否发生碰撞
 */
export function hasCollision(
  blockId: string,
  newPosition: Position,
  allBlocks: BlockData[]
): boolean {
  const targetBlock = allBlocks.find((b) => b.id === blockId);
  if (!targetBlock) return true; // 方块不存在，视为碰撞

  const targetCells = occupiesCells(targetBlock.shape, newPosition);

  // 检查是否与其他方块重叠
  for (const block of allBlocks) {
    if (block.id === blockId) continue; // 跳过自己

    const blockCells = occupiesCells(block.shape, block.position);
    if (hasOverlap(targetCells, blockCells)) {
      return true;
    }
  }

  return false;
}

/**
 * 获取方块当前占据的所有格子
 */
export function getBlockCells(block: BlockData): Position[] {
  return occupiesCells(block.shape, block.position);
}

/**
 * 检查两个方块是否相邻（可以交换位置）
 */
export function areBlocksAdjacent(block1: BlockData, block2: BlockData): boolean {
  const cells1 = getBlockCells(block1);
  const cells2 = getBlockCells(block2);

  // 检查是否有相邻的格子
  for (const [r1, c1] of cells1) {
    for (const [r2, c2] of cells2) {
      const rowDiff = Math.abs(r1 - r2);
      const colDiff = Math.abs(c1 - c2);
      // 相邻定义：横向或纵向距离为1，且另一方向距离为0
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        return true;
      }
    }
  }

  return false;
}

