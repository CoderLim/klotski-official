import { PuzzleConfig, validatePuzzleConfig } from './types';
import { getColorByShape } from '../utils/colors';
import { BlockData } from './types';

/**
 * 拼图配置数据库
 * 包含经典华容道布局
 */

// 1. 横刀立马 (用户提供的布局)
const hengdaoConfig: PuzzleConfig = {
  name: '横刀立马',
  slug: 'hengdao',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] }, // 曹操
    { shape: [2, 1], position: [0, 0] }, // 左竖将
    { shape: [2, 1], position: [0, 3] }, // 右竖将
    { shape: [2, 1], position: [2, 0] }, // 左下竖将
    { shape: [2, 1], position: [2, 3] }, // 右下竖将
    { shape: [1, 2], position: [2, 1] }, // 横将
    { shape: [1, 1], position: [3, 1] }, // 小兵1
    { shape: [1, 1], position: [3, 2] }, // 小兵2
    { shape: [1, 1], position: [4, 0] }, // 小兵3
    { shape: [1, 1], position: [4, 3] }, // 小兵4
  ],
};

// 2. 近在咫尺
const jinzaichichiConfig: PuzzleConfig = {
  name: '近在咫尺',
  slug: 'jinzaichichi',
  difficulty: 'easy',
  blocks: [
    { shape: [2, 2], position: [0, 1] }, // 曹操
    { shape: [2, 1], position: [0, 0] }, // 左竖将
    { shape: [2, 1], position: [0, 3] }, // 右竖将
    { shape: [1, 2], position: [2, 1] }, // 横将
    { shape: [2, 1], position: [2, 0] }, // 左下竖将
    { shape: [2, 1], position: [2, 3] }, // 右下竖将
    { shape: [1, 1], position: [4, 0] }, // 小兵1
    { shape: [1, 1], position: [4, 1] }, // 小兵2
    { shape: [1, 1], position: [4, 2] }, // 小兵3
    { shape: [1, 1], position: [4, 3] }, // 小兵4
  ],
};

// 3. 层层设防
const cengcengshefangConfig: PuzzleConfig = {
  name: '层层设防',
  slug: 'cengcengshefang',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [1, 1] }, // 曹操
    { shape: [1, 2], position: [0, 1] }, // 上横将
    { shape: [2, 1], position: [0, 0] }, // 左竖将
    { shape: [2, 1], position: [0, 3] }, // 右竖将
    { shape: [1, 2], position: [3, 1] }, // 下横将
    { shape: [1, 1], position: [3, 0] }, // 小兵1
    { shape: [1, 1], position: [3, 3] }, // 小兵2
    { shape: [1, 1], position: [4, 0] }, // 小兵3
    { shape: [1, 1], position: [4, 1] }, // 小兵4
    { shape: [1, 1], position: [4, 2] }, // 小兵5
    { shape: [1, 1], position: [4, 3] }, // 小兵6
  ],
};

// 4. 水泄不通
const shuixiebutongConfig: PuzzleConfig = {
  name: '水泄不通',
  slug: 'shuixiebutong',
  difficulty: 'expert',
  blocks: [
    { shape: [2, 2], position: [0, 1] }, // 曹操
    { shape: [2, 1], position: [2, 0] }, // 左竖将
    { shape: [2, 1], position: [2, 1] }, // 中左竖将
    { shape: [2, 1], position: [2, 2] }, // 中右竖将
    { shape: [2, 1], position: [2, 3] }, // 右竖将
    { shape: [1, 2], position: [0, 0] }, // 左上横将
    { shape: [1, 1], position: [4, 0] }, // 小兵1
    { shape: [1, 1], position: [4, 1] }, // 小兵2
    { shape: [1, 1], position: [4, 2] }, // 小兵3
    { shape: [1, 1], position: [4, 3] }, // 小兵4
  ],
};

// 5. 小燕出巢
const xiaoyanchuchaoConfig: PuzzleConfig = {
  name: '小燕出巢',
  slug: 'xiaoyanchuchao',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [2, 1] }, // 曹操
    { shape: [2, 1], position: [0, 0] }, // 左上竖将
    { shape: [2, 1], position: [0, 3] }, // 右上竖将
    { shape: [1, 2], position: [0, 1] }, // 上横将
    { shape: [1, 2], position: [4, 1] }, // 下横将
    { shape: [2, 1], position: [2, 0] }, // 左竖将
    { shape: [2, 1], position: [2, 3] }, // 右竖将
    { shape: [1, 1], position: [4, 0] }, // 小兵1
    { shape: [1, 1], position: [4, 3] }, // 小兵2
  ],
};

// 6. 兵挡将阻
const bingdangjiangzuConfig: PuzzleConfig = {
  name: '兵挡将阻',
  slug: 'bingdangjiangzu',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] }, // 曹操
    { shape: [2, 1], position: [2, 0] }, // 左竖将
    { shape: [2, 1], position: [2, 3] }, // 右竖将
    { shape: [1, 2], position: [2, 1] }, // 横将
    { shape: [2, 1], position: [0, 0] }, // 左上竖将
    { shape: [2, 1], position: [0, 3] }, // 右上竖将
    { shape: [1, 1], position: [3, 1] }, // 小兵1
    { shape: [1, 1], position: [3, 2] }, // 小兵2
    { shape: [1, 1], position: [4, 1] }, // 小兵3
    { shape: [1, 1], position: [4, 2] }, // 小兵4
  ],
};

/**
 * 所有拼图的注册表
 */
export const PUZZLES: Record<string, PuzzleConfig> = {
  hengdao: hengdaoConfig,
  jinzaichichi: jinzaichichiConfig,
  cengcengshefang: cengcengshefangConfig,
  shuixiebutong: shuixiebutongConfig,
  xiaoyanchuchao: xiaoyanchuchaoConfig,
  bingdangjiangzu: bingdangjiangzuConfig,
};

/**
 * 获取所有拼图列表（用于首页显示）
 */
export function getAllPuzzles(): PuzzleConfig[] {
  return Object.values(PUZZLES);
}

/**
 * 根据 slug 获取拼图配置
 */
export function getPuzzleBySlug(slug: string): PuzzleConfig | null {
  return PUZZLES[slug] || null;
}

/**
 * 将原始拼图配置转换为运行时方块数据
 */
export function initializeBlocks(config: PuzzleConfig): BlockData[] {
  return config.blocks.map((block, index) => ({
    id: `block-${index}`,
    shape: block.shape,
    position: block.position,
    color: getColorByShape(block.shape),
  }));
}

/**
 * 验证所有拼图配置
 */
export function validateAllPuzzles(): void {
  Object.entries(PUZZLES).forEach(([slug, config]) => {
    try {
      validatePuzzleConfig(config);
    } catch (error) {
      console.error(`拼图配置验证失败: ${slug}`, error);
      throw error;
    }
  });
}

// 在模块加载时验证所有拼图
if (typeof window === 'undefined') {
  // 仅在服务端验证
  validateAllPuzzles();
}

