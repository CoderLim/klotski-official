import { describe, it, expect } from 'vitest';
import { occupiesCells, hasOverlap } from '../lib/utils/grid';
import { hasCollision } from '../lib/engine/collision';
import { isWithinBounds, constrainPosition } from '../lib/engine/validation';
import { checkWin, WIN_POSITION } from '../lib/engine/win';
import { canMoveTo } from '../lib/engine/movement';
import { BlockData, Shape, Position } from '../lib/puzzles/types';

describe('Grid Utils', () => {
  describe('occupiesCells', () => {
    it('should return correct cells for 2×2 block', () => {
      const cells = occupiesCells([2, 2], [0, 1]);
      expect(cells).toHaveLength(4);
      expect(cells).toContainEqual([0, 1]);
      expect(cells).toContainEqual([0, 2]);
      expect(cells).toContainEqual([1, 1]);
      expect(cells).toContainEqual([1, 2]);
    });

    it('should return correct cells for 1×1 block', () => {
      const cells = occupiesCells([1, 1], [3, 2]);
      expect(cells).toHaveLength(1);
      expect(cells).toContainEqual([3, 2]);
    });

    it('should return correct cells for 2×1 block', () => {
      const cells = occupiesCells([2, 1], [0, 0]);
      expect(cells).toHaveLength(2);
      expect(cells).toContainEqual([0, 0]);
      expect(cells).toContainEqual([1, 0]);
    });
  });

  describe('hasOverlap', () => {
    it('should detect overlap', () => {
      const cells1: Position[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
      const cells2: Position[] = [[1, 1], [1, 2]];
      expect(hasOverlap(cells1, cells2)).toBe(true);
    });

    it('should not detect overlap when cells are separate', () => {
      const cells1: Position[] = [[0, 0], [0, 1]];
      const cells2: Position[] = [[2, 2], [2, 3]];
      expect(hasOverlap(cells1, cells2)).toBe(false);
    });

    it('should detect adjacent cells as non-overlapping', () => {
      const cells1: Position[] = [[0, 0], [0, 1]];
      const cells2: Position[] = [[0, 2], [0, 3]];
      expect(hasOverlap(cells1, cells2)).toBe(false);
    });
  });
});

describe('Validation', () => {
  describe('isWithinBounds', () => {
    it('should validate block within bounds', () => {
      expect(isWithinBounds([2, 2], [0, 0])).toBe(true);
      expect(isWithinBounds([2, 2], [3, 2])).toBe(true);
      expect(isWithinBounds([1, 1], [4, 3])).toBe(true);
    });

    it('should invalidate block outside bounds', () => {
      expect(isWithinBounds([2, 2], [4, 0])).toBe(false); // too far down
      expect(isWithinBounds([2, 2], [0, 3])).toBe(false); // too far right
      expect(isWithinBounds([1, 1], [-1, 0])).toBe(false); // negative row
      expect(isWithinBounds([1, 1], [0, -1])).toBe(false); // negative col
    });

    it('should handle edge cases', () => {
      expect(isWithinBounds([1, 4], [0, 0])).toBe(true); // full width
      expect(isWithinBounds([5, 1], [0, 0])).toBe(true); // full height
      expect(isWithinBounds([1, 4], [4, 0])).toBe(true); // bottom edge
    });
  });

  describe('constrainPosition', () => {
    it('should constrain position within bounds', () => {
      expect(constrainPosition([2, 2], [4, 0])).toEqual([3, 0]);
      expect(constrainPosition([2, 2], [0, 3])).toEqual([0, 2]);
      expect(constrainPosition([1, 1], [-1, -1])).toEqual([0, 0]);
    });

    it('should not change valid positions', () => {
      expect(constrainPosition([2, 2], [1, 1])).toEqual([1, 1]);
      expect(constrainPosition([1, 1], [2, 2])).toEqual([2, 2]);
    });
  });
});

describe('Collision Detection', () => {
  const mockBlocks: BlockData[] = [
    { id: '0', shape: [2, 2], position: [0, 1], color: '#EF4444' },
    { id: '1', shape: [2, 1], position: [0, 0], color: '#F59E0B' },
    { id: '2', shape: [1, 1], position: [3, 1], color: '#10B981' },
  ];

  it('should detect collision with another block', () => {
    // Try to move block 1 to overlap with block 0
    expect(hasCollision('1', [0, 1], mockBlocks)).toBe(true);
  });

  it('should not detect collision when moving to empty space', () => {
    // Move block 2 to empty space
    expect(hasCollision('2', [4, 2], mockBlocks)).toBe(false);
  });

  it('should allow block to stay in same position', () => {
    expect(hasCollision('0', [0, 1], mockBlocks)).toBe(false);
  });
});

describe('Win Condition', () => {
  it('should detect win when 2×2 block is at target position', () => {
    const blocks: BlockData[] = [
      { id: '0', shape: [2, 2], position: WIN_POSITION, color: '#EF4444' },
      { id: '1', shape: [1, 1], position: [0, 0], color: '#10B981' },
    ];
    expect(checkWin(blocks)).toBe(true);
  });

  it('should not detect win when 2×2 block is not at target', () => {
    const blocks: BlockData[] = [
      { id: '0', shape: [2, 2], position: [0, 1], color: '#EF4444' },
      { id: '1', shape: [1, 1], position: [0, 0], color: '#10B981' },
    ];
    expect(checkWin(blocks)).toBe(false);
  });

  it('should not detect win when no 2×2 block exists', () => {
    const blocks: BlockData[] = [
      { id: '0', shape: [1, 1], position: [0, 0], color: '#10B981' },
    ];
    expect(checkWin(blocks)).toBe(false);
  });
});

describe('Movement', () => {
  const mockBlocks: BlockData[] = [
    { id: '0', shape: [2, 2], position: [0, 1], color: '#EF4444' },
    { id: '1', shape: [2, 1], position: [0, 0], color: '#F59E0B' },
    { id: '2', shape: [1, 1], position: [4, 3], color: '#10B981' },
  ];

  it('should allow valid move', () => {
    // Move block 2 to adjacent empty space
    expect(canMoveTo('2', [4, 2], mockBlocks)).toBe(true);
  });

  it('should prevent move that causes collision', () => {
    // Try to move block 2 to overlap with block 0
    expect(canMoveTo('2', [0, 1], mockBlocks)).toBe(false);
  });

  it('should prevent move outside bounds', () => {
    // Try to move block 2 outside board
    expect(canMoveTo('2', [5, 3], mockBlocks)).toBe(false);
    expect(canMoveTo('2', [4, 4], mockBlocks)).toBe(false);
  });

  it('should allow block to stay in same position', () => {
    expect(canMoveTo('0', [0, 1], mockBlocks)).toBe(true);
  });
});

