import { Position, Shape } from '../puzzles/types';
import { BOARD_ROWS, BOARD_COLS } from '../utils/grid';

/**
 * 检查方块在指定位置是否在棋盘边界内
 * @param shape 方块形状
 * @param position 方块位置
 * @returns 是否在边界内
 */
export function isWithinBounds(shape: Shape, position: Position): boolean {
  const [rows, cols] = shape;
  const [row, col] = position;

  // 检查左上角
  if (row < 0 || col < 0) return false;

  // 检查右下角
  if (row + rows > BOARD_ROWS || col + cols > BOARD_COLS) return false;

  return true;
}

/**
 * 约束位置在有效范围内
 * @param shape 方块形状
 * @param position 原始位置
 * @returns 约束后的位置
 */
export function constrainPosition(shape: Shape, position: Position): Position {
  const [rows, cols] = shape;
  let [row, col] = position;

  // 约束到有效范围
  row = Math.max(0, Math.min(row, BOARD_ROWS - rows));
  col = Math.max(0, Math.min(col, BOARD_COLS - cols));

  return [row, col];
}

/**
 * 验证位置是否为有效的网格坐标
 */
export function isValidGridPosition(position: Position): boolean {
  const [row, col] = position;
  return (
    Number.isInteger(row) &&
    Number.isInteger(col) &&
    row >= 0 &&
    col >= 0 &&
    row < BOARD_ROWS &&
    col < BOARD_COLS
  );
}

