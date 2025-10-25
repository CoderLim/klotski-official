import { BlockData, Position } from '../puzzles/types';
import { Move } from './types';
import { checkWin } from '../engine/win';
import { isTargetBlock } from '../utils/colors';

/**
 * 将游戏状态转换为 klotski 库需要的格式
 * @param blocks 游戏方块数组
 * @returns klotski 库需要的游戏对象
 */
function blocksToKlotskiGame(blocks: BlockData[]): any {
  return {
    blocks: blocks.map(block => ({
      shape: block.shape,
      position: block.position,
    })),
    boardSize: [5, 4],
    escapePoint: [3, 1], // 华容道的出口位置
  };
}

/**
 * 将 klotski 库的移动序列转换为游戏移动序列
 * @param klotskiMoves klotski 库返回的移动数组
 * @param initialBlocks 初始方块数组
 * @returns 游戏移动数组
 */
function convertKlotskiMovesToGameMoves(
  klotskiMoves: any[],
  initialBlocks: BlockData[]
): Move[] {
  const moves: Move[] = [];
  
  // 创建方块位置的副本用于跟踪
  const currentBlocks = initialBlocks.map(block => ({ ...block }));
  
  // 转换方向索引 (0=down, 1=right, 2=up, 3=left)
  const directionMap: { [key: number]: string } = {
    0: 'down',
    1: 'right',
    2: 'up', 
    3: 'left'
  };
  
  for (const klotskiMove of klotskiMoves) {
    if (!klotskiMove || typeof klotskiMove.blockIdx === 'undefined' || typeof klotskiMove.dirIdx === 'undefined') {
      continue;
    }
    
    const blockIndex = klotskiMove.blockIdx;
    const block = currentBlocks[blockIndex];
    if (!block) continue;
    
    const direction = directionMap[klotskiMove.dirIdx] as 'up' | 'down' | 'left' | 'right' || 'down';
    const [row, col] = block.position;
    
    // 计算目标位置
    let newPosition: Position;
    switch (direction) {
      case 'down':
        newPosition = [row + 1, col];
        break;
      case 'up':
        newPosition = [row - 1, col];
        break;
      case 'right':
        newPosition = [row, col + 1];
        break;
      case 'left':
        newPosition = [row, col - 1];
        break;
      default:
        continue;
    }
    
    // 检查移动是否有效（在边界内）
    const [newRow, newCol] = newPosition;
    if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 4) {
      continue;
    }
    
    // 检查移动是否有效
    const [blockHeight, blockWidth] = block.shape;
    
    // 检查边界
    if (newRow + blockHeight > 5 || newCol + blockWidth > 4 || newRow < 0 || newCol < 0) {
      console.log(`跳过无效移动: ${block.id} 到 [${newRow}, ${newCol}] (超出边界)`);
      continue;
    }
    
    // 检查是否与其他方块冲突
    let hasConflict = false;
    for (const otherBlock of currentBlocks) {
      if (otherBlock.id === block.id) continue;
      
      const [otherRow, otherCol] = otherBlock.position;
      const [otherHeight, otherWidth] = otherBlock.shape;
      
      // 检查矩形重叠
      if (!(newRow >= otherRow + otherHeight || 
            newRow + blockHeight <= otherRow ||
            newCol >= otherCol + otherWidth || 
            newCol + blockWidth <= otherCol)) {
        hasConflict = true;
        break;
      }
    }
    
    if (hasConflict) {
      console.log(`跳过冲突移动: ${block.id} 到 [${newRow}, ${newCol}] (与其他方块冲突)`);
      continue;
    }
    
    // 记录移动
    const move = {
      blockId: block.id,
      from: [row, col] as Position,
      to: newPosition,
      direction
    };
    
    moves.push(move);
    console.log(`有效移动: ${block.id} ${direction} 从 [${row}, ${col}] 到 [${newRow}, ${newCol}]`);
    
    // 更新方块位置
    block.position = newPosition;
  }
  
  return moves;
}

/**
 * 使用 klotski 库求解华容道
 * @param blocks 游戏方块数组
 * @returns 求解结果
 */
export function solveWithKlotski(blocks: BlockData[]): {
  success: boolean;
  moves: Move[];
  totalSteps: number;
  timeElapsed: number;
} {
  const startTime = Date.now();
  
  try {
    // 动态导入 klotski 库
    const Klotski = require('klotski');
    
    // 转换为 klotski 格式
    const klotskiGame = blocksToKlotskiGame(blocks);
    
    console.log('Klotski 游戏配置:', klotskiGame);
    
    // 创建 Klotski 实例
    const klotski = new Klotski();
    
    // 调用 klotski 求解
    const solution = klotski.solve(klotskiGame);
    
    console.log('Klotski 求解结果:', solution);
    console.log('求解步骤数量:', solution?.length || 0);
    
    if (solution && Array.isArray(solution) && solution.length > 0) {
      // 转换移动步骤
      const moves = convertKlotskiMovesToGameMoves(solution, blocks);
      
      console.log('转换后的移动数量:', moves.length);
      console.log('前3步移动:', moves.slice(0, 3));
      
      return {
        success: true,
        moves,
        totalSteps: moves.length,
        timeElapsed: Date.now() - startTime
      };
    } else {
      console.log('Klotski 库未找到解法，将回退到自实现算法');
      return {
        success: false,
        moves: [],
        totalSteps: 0,
        timeElapsed: Date.now() - startTime
      };
    }
  } catch (error) {
    console.error('Klotski 求解失败:', error);
    return {
      success: false,
      moves: [],
      totalSteps: 0,
      timeElapsed: Date.now() - startTime
    };
  }
}

/**
 * 检查 klotski 库是否可用
 */
export function isKlotskiAvailable(): boolean {
  try {
    require('klotski');
    return true;
  } catch {
    return false;
  }
}
