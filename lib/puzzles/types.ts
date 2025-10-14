import { z } from 'zod';

/**
 * 方块形状 [高度, 宽度]
 */
export type Shape = [rows: number, cols: number];

/**
 * 方块位置 [行, 列] (0-indexed)
 */
export type Position = [row: number, col: number];

/**
 * 方块数据（运行时使用）
 */
export interface BlockData {
  id: string;
  shape: Shape;
  position: Position;
  color: string;
}

/**
 * 拼图原始配置块（JSON格式）
 */
export interface RawBlockConfig {
  shape: Shape;
  position: Position;
}

/**
 * 拼图配置
 */
export interface PuzzleConfig {
  name: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  blocks: RawBlockConfig[];
}

/**
 * 移动历史记录
 */
export interface MoveHistory {
  blockId: string;
  from: Position;
  to: Position;
  timestamp: number;
}

/**
 * Zod 验证 Schema
 */
export const ShapeSchema = z.tuple([z.number().min(1).max(5), z.number().min(1).max(4)]);
export const PositionSchema = z.tuple([z.number().min(0).max(4), z.number().min(0).max(3)]);

export const RawBlockConfigSchema = z.object({
  shape: ShapeSchema,
  position: PositionSchema,
});

export const PuzzleConfigSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  blocks: z.array(RawBlockConfigSchema).min(1),
});

/**
 * 验证拼图配置是否有效
 */
export function validatePuzzleConfig(config: unknown): PuzzleConfig {
  return PuzzleConfigSchema.parse(config);
}

