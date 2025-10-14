import { Position, Shape } from '../puzzles/types';

/**
 * 游戏棋盘常量
 */
export const BOARD_ROWS = 5;
export const BOARD_COLS = 4;

/**
 * 单元格尺寸（用于计算）
 */
export const CELL_SIZE = 80; // 像素
export const CELL_GAP = 4; // 间隙

/**
 * 计算方块占据的所有格子坐标
 */
export function occupiesCells(shape: Shape, position: Position): Position[] {
  const [rows, cols] = shape;
  const [startRow, startCol] = position;
  const cells: Position[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push([startRow + r, startCol + c]);
    }
  }

  return cells;
}

/**
 * 将像素偏移量转换为网格偏移量
 */
export function pixelToGridOffset(pixelDelta: number, cellSize: number = CELL_SIZE): number {
  return Math.round(pixelDelta / cellSize);
}

/**
 * 将网格坐标转换为像素坐标
 */
export function gridToPixel(gridPos: number, cellSize: number = CELL_SIZE): number {
  return gridPos * cellSize;
}

/**
 * 检查两个位置数组是否有重叠
 */
export function hasOverlap(cells1: Position[], cells2: Position[]): boolean {
  const set1 = new Set(cells1.map(([r, c]) => `${r},${c}`));
  return cells2.some(([r, c]) => set1.has(`${r},${c}`));
}

/**
 * 检查位置是否相等
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}

/**
 * 格式化时间（秒 → MM:SS）
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

