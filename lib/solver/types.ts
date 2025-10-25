import { BlockData, Position } from '../puzzles/types';

/**
 * 游戏状态
 */
export interface GameState {
  blocks: BlockData[];
  depth: number;  // 当前步数
  parent: GameState | null;  // 父状态（用于回溯路径）
  move?: Move;  // 从父状态到当前状态的移动
}

/**
 * 移动记录
 */
export interface Move {
  blockId: string;
  from: Position;
  to: Position;
  direction: 'up' | 'down' | 'left' | 'right';
}

/**
 * 求解结果
 */
export interface SolverResult {
  success: boolean;
  moves: Move[];  // 解法步骤
  totalSteps: number;  // 总步数
  statesExplored: number;  // 探索的状态数
  timeElapsed: number;  // 求解耗时（毫秒）
}

/**
 * 求解器配置
 */
export interface SolverConfig {
  algorithm: 'bfs' | 'astar';  // 算法选择
  maxStates?: number;  // 最大探索状态数（防止内存溢出）
  timeout?: number;  // 超时时间（毫秒）
  heuristic?: 'manhattan' | 'custom';  // A*启发式函数
}

