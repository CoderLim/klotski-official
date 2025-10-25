import { BlockData } from '../puzzles/types';
import { SolverResult } from './types';
import { solveWithKlotski, isKlotskiAvailable } from './klotski-wrapper';

/**
 * Klotski solver using external library
 */
export function solveKlotski(blocks: BlockData[]): SolverResult {
  // 检查 klotski 库是否可用
  if (!isKlotskiAvailable()) {
    console.error('❌ Klotski library is not available');
    return {
      success: false,
      moves: [],
      totalSteps: 0,
      statesExplored: 0,
      timeElapsed: 0,
    };
  }

  try {
    const klotskiResult = solveWithKlotski(blocks);
    if (klotskiResult.success) {
      console.log('✅ Successfully solved using klotski library');
      return {
        success: true,
        moves: klotskiResult.moves,
        totalSteps: klotskiResult.totalSteps,
        statesExplored: 0, // klotski 库不提供此信息
        timeElapsed: klotskiResult.timeElapsed,
      };
    } else {
      console.log('⚠️ Klotski library found no solution');
      return {
        success: false,
        moves: [],
        totalSteps: 0,
        statesExplored: 0,
        timeElapsed: klotskiResult.timeElapsed,
      };
    }
  } catch (error) {
    console.error('❌ Klotski library failed:', error);
    return {
      success: false,
      moves: [],
      totalSteps: 0,
      statesExplored: 0,
      timeElapsed: 0,
    };
  }
}

// 导出类型和 klotski 相关函数
export * from './types';
export { solveWithKlotski, isKlotskiAvailable } from './klotski-wrapper';

