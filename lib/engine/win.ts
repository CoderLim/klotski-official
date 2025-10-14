import { BlockData, Position } from '../puzzles/types';
import { isTargetBlock } from '../utils/colors';

/**
 * 目标位置：红色2×2方块的左上角应该在[3, 1]
 * 这样方块会占据rows 3-4, cols 1-2（底部中央出口）
 */
export const WIN_POSITION: Position = [3, 1];

/**
 * 检查游戏是否获胜
 * 胜利条件：红色2×2方块（曹操）到达底部中央出口位置
 * @param blocks 所有方块列表
 * @returns 是否获胜
 */
export function checkWin(blocks: BlockData[]): boolean {
  // 找到红色2×2方块
  const targetBlock = blocks.find((block) => isTargetBlock(block.shape));

  if (!targetBlock) {
    console.warn('未找到目标方块（2×2红色方块）');
    return false;
  }

  // 检查位置是否在目标位置
  const [row, col] = targetBlock.position;
  const [winRow, winCol] = WIN_POSITION;

  return row === winRow && col === winCol;
}

/**
 * 获取目标方块的当前位置
 */
export function getTargetBlockPosition(blocks: BlockData[]): Position | null {
  const targetBlock = blocks.find((block) => isTargetBlock(block.shape));
  return targetBlock ? targetBlock.position : null;
}

/**
 * 计算目标方块距离胜利位置的距离（用于提示）
 */
export function getDistanceToWin(blocks: BlockData[]): number {
  const currentPos = getTargetBlockPosition(blocks);
  if (!currentPos) return Infinity;

  const [currentRow, currentCol] = currentPos;
  const [winRow, winCol] = WIN_POSITION;

  return Math.abs(currentRow - winRow) + Math.abs(currentCol - winCol);
}

