import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { BlockData, Position, MoveHistory, PuzzleConfig } from '../puzzles/types';
import { getPuzzleBySlug, initializeBlocks } from '../puzzles';
import { checkWin } from '../engine/win';
import { canMoveTo } from '../engine/movement';

interface GameState {
  // 游戏数据
  currentPuzzle: PuzzleConfig | null;
  blocks: BlockData[];
  moves: number;
  startTime: number | null;
  elapsedTime: number;
  isWin: boolean;
  selectedBlockId: string | null;
  
  // 历史记录（撤销/重做）
  history: MoveHistory[];
  historyIndex: number;
  
  // 设置
  isMuted: boolean;
  
  // Actions
  loadPuzzle: (slug: string) => void;
  moveBlock: (blockId: string, newPosition: Position) => boolean;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  selectBlock: (blockId: string | null) => void;
  setElapsedTime: (time: number) => void;
  toggleMute: () => void;
  
  // 辅助方法
  canUndo: () => boolean;
  canRedo: () => boolean;
  getBlockById: (blockId: string) => BlockData | undefined;
}

const STORAGE_KEY_PREFIX = 'klotski-game-';

/**
 * 从 localStorage 加载游戏状态
 */
function loadGameState(slug: string): Partial<GameState> | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${slug}`);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    return {
      blocks: data.blocks,
      moves: data.moves,
      startTime: data.startTime,
      elapsedTime: data.elapsedTime,
      history: data.history || [],
      historyIndex: data.historyIndex || -1,
    };
  } catch (error) {
    console.error('加载游戏状态失败:', error);
    return null;
  }
}

/**
 * 保存游戏状态到 localStorage
 */
function saveGameState(slug: string, state: GameState) {
  if (typeof window === 'undefined') return;
  
  try {
    const data = {
      blocks: state.blocks,
      moves: state.moves,
      startTime: state.startTime,
      elapsedTime: state.elapsedTime,
      history: state.history,
      historyIndex: state.historyIndex,
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${slug}`, JSON.stringify(data));
  } catch (error) {
    console.error('保存游戏状态失败:', error);
  }
}

/**
 * 清除游戏状态
 */
export function clearGameState(slug: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${slug}`);
}

export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    // 初始状态
    currentPuzzle: null,
    blocks: [],
    moves: 0,
    startTime: null,
    elapsedTime: 0,
    isWin: false,
    selectedBlockId: null,
    history: [],
    historyIndex: -1,
    isMuted: false,

    // 加载拼图
    loadPuzzle: (slug: string) => {
      const puzzle = getPuzzleBySlug(slug);
      if (!puzzle) {
        console.error(`拼图未找到: ${slug}`);
        return;
      }

      // 尝试加载保存的进度
      const savedState = loadGameState(slug);

      set((state) => {
        state.currentPuzzle = puzzle;
        
        if (savedState) {
          // 恢复保存的状态
          state.blocks = savedState.blocks || initializeBlocks(puzzle);
          state.moves = savedState.moves || 0;
          state.startTime = savedState.startTime || null;
          state.elapsedTime = savedState.elapsedTime || 0;
          state.history = savedState.history || [];
          state.historyIndex = savedState.historyIndex ?? -1;
        } else {
          // 新游戏
          state.blocks = initializeBlocks(puzzle);
          state.moves = 0;
          state.startTime = null;
          state.elapsedTime = 0;
          state.history = [];
          state.historyIndex = -1;
        }
        
        state.isWin = checkWin(state.blocks);
        state.selectedBlockId = null;
      });
    },

    // 移动方块
    moveBlock: (blockId: string, newPosition: Position) => {
      const state = get();
      
      // 检查是否可以移动
      if (!canMoveTo(blockId, newPosition, state.blocks)) {
        return false;
      }

      const block = state.blocks.find((b) => b.id === blockId);
      if (!block) return false;

      const oldPosition = block.position;

      set((draft) => {
        const targetBlock = draft.blocks.find((b) => b.id === blockId);
        if (!targetBlock) return;

        // 更新位置
        targetBlock.position = newPosition;

        // 增加移动计数
        draft.moves += 1;

        // 如果是第一次移动，记录开始时间
        if (draft.startTime === null) {
          draft.startTime = Date.now();
        }

        // 记录历史（清除当前索引之后的历史）
        draft.history = draft.history.slice(0, draft.historyIndex + 1);
        draft.history.push({
          blockId,
          from: oldPosition,
          to: newPosition,
          timestamp: Date.now(),
        });
        draft.historyIndex += 1;

        // 检查胜利
        draft.isWin = checkWin(draft.blocks);
      });

      // 保存状态
      const newState = get();
      if (newState.currentPuzzle) {
        saveGameState(newState.currentPuzzle.slug, newState);
      }

      return true;
    },

    // 撤销
    undo: () => {
      const state = get();
      if (!state.canUndo()) return;

      set((draft) => {
        const move = draft.history[draft.historyIndex];
        if (!move) return;

        const block = draft.blocks.find((b) => b.id === move.blockId);
        if (!block) return;

        // 恢复位置
        block.position = move.from;
        draft.historyIndex -= 1;
        draft.moves = Math.max(0, draft.moves - 1);
        draft.isWin = checkWin(draft.blocks);
      });

      const newState = get();
      if (newState.currentPuzzle) {
        saveGameState(newState.currentPuzzle.slug, newState);
      }
    },

    // 重做
    redo: () => {
      const state = get();
      if (!state.canRedo()) return;

      set((draft) => {
        const move = draft.history[draft.historyIndex + 1];
        if (!move) return;

        const block = draft.blocks.find((b) => b.id === move.blockId);
        if (!block) return;

        // 重新应用移动
        block.position = move.to;
        draft.historyIndex += 1;
        draft.moves += 1;
        draft.isWin = checkWin(draft.blocks);
      });

      const newState = get();
      if (newState.currentPuzzle) {
        saveGameState(newState.currentPuzzle.slug, newState);
      }
    },

    // 重置
    reset: () => {
      const state = get();
      if (!state.currentPuzzle) return;

      // 清除保存的状态
      clearGameState(state.currentPuzzle.slug);

      // 重新加载拼图
      state.loadPuzzle(state.currentPuzzle.slug);
    },

    // 选择方块（键盘控制）
    selectBlock: (blockId: string | null) => {
      set((state) => {
        state.selectedBlockId = blockId;
      });
    },

    // 更新经过时间
    setElapsedTime: (time: number) => {
      set((state) => {
        state.elapsedTime = time;
      });
    },

    // 切换静音
    toggleMute: () => {
      set((state) => {
        state.isMuted = !state.isMuted;
      });
    },

    // 辅助方法
    canUndo: () => {
      const state = get();
      return state.historyIndex >= 0;
    },

    canRedo: () => {
      const state = get();
      return state.historyIndex < state.history.length - 1;
    },

    getBlockById: (blockId: string) => {
      const state = get();
      return state.blocks.find((b) => b.id === blockId);
    },
  }))
);

