import { Shape } from '../puzzles/types';

/**
 * 根据方块形状映射颜色
 * 2×2 → 红色 (曹操)
 * 2×1 → 黄色 (竖将)
 * 1×2 → 蓝色 (横将)
 * 1×1 → 绿色 (小兵)
 */
export function getColorByShape(shape: Shape): string {
  const [rows, cols] = shape;
  const key = `${rows}x${cols}`;

  const colorMap: Record<string, string> = {
    '2x2': '#EF4444', // red-500
    '2x1': '#F59E0B', // amber-500
    '1x2': '#3B82F6', // blue-500
    '1x1': '#10B981', // emerald-500
  };

  return colorMap[key] || '#6B7280'; // 默认灰色
}

/**
 * 获取方块的显示名称
 */
export function getBlockName(shape: Shape): string {
  const [rows, cols] = shape;
  const key = `${rows}x${cols}`;

  const nameMap: Record<string, string> = {
    '2x2': '曹操',
    '2x1': '竖将',
    '1x2': '横将',
    '1x1': '小兵',
  };

  return nameMap[key] || '未知方块';
}

/**
 * 检查是否为目标方块（红色2×2曹操）
 */
export function isTargetBlock(shape: Shape): boolean {
  return shape[0] === 2 && shape[1] === 2;
}

