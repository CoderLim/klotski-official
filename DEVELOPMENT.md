# 开发指南

本文档提供华容道游戏项目的详细开发说明。

## 开发环境设置

### 必需软件
- Node.js 18+
- npm/pnpm/yarn
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 推荐 IDE
- VS Code + 以下扩展：
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## 项目架构

### 核心概念

#### 1. 数据流
```
用户操作 → UI组件 → Zustand Store → 游戏引擎 → 状态更新 → UI重渲染
```

#### 2. 游戏引擎层次
```
高层: Zustand Store (状态管理)
  ↓
中层: Movement/Collision (移动和碰撞)
  ↓
底层: Validation/Grid (验证和网格计算)
```

#### 3. 组件层次
```
Page (路由页面)
  ├─ HUD (状态显示)
  ├─ Board (棋盘)
  │   └─ Block[] (方块列表)
  └─ Controls (控制按钮)
```

### 关键模块说明

#### 游戏引擎 (`lib/engine/`)

**collision.ts** - 碰撞检测
- `hasCollision()`: 检测方块是否与其他方块重叠
- 使用 Set 优化性能（O(n) 复杂度）

**movement.ts** - 移动逻辑
- `calculateDragPosition()`: 计算拖拽后的目标位置
- `canMoveTo()`: 验证移动是否合法
- `tryMoveByKey()`: 键盘控制移动

**validation.ts** - 边界验证
- `isWithinBounds()`: 检查方块是否在棋盘内
- `constrainPosition()`: 约束位置到有效范围

**win.ts** - 胜利判定
- `checkWin()`: 检查红色2×2方块是否到达目标位置
- 目标位置：`[3, 1]`（左上角）

#### 状态管理 (`lib/store/`)

**useGameStore.ts** - Zustand 核心状态
- 使用 `immer` 中间件实现不可变更新
- 自动持久化到 localStorage
- 历史栈支持撤销/重做

状态结构：
```typescript
{
  currentPuzzle: PuzzleConfig | null,
  blocks: BlockData[],
  moves: number,
  startTime: number | null,
  elapsedTime: number,
  isWin: boolean,
  selectedBlockId: string | null,
  history: MoveHistory[],
  historyIndex: number,
  isMuted: boolean,
}
```

#### UI组件 (`components/`)

**Block.tsx** - 可拖拽方块
- 处理 Pointer Events（统一鼠标和触摸）
- 使用 Framer Motion 实现动画
- 拖拽过程中实时预览，松手时验证并吸附

关键实现：
```typescript
onPointerDown → 记录起始位置
onPointerMove → 更新视觉偏移
onPointerUp → 验证并提交移动
```

**Board.tsx** - 游戏棋盘
- 渲染网格背景
- 显示目标出口指示器
- 监听全局键盘事件

## 开发工作流

### 1. 运行开发服务器
```bash
npm run dev
# 访问 http://localhost:3000
```

### 2. 运行测试
```bash
# 监听模式
npm test

# 单次运行
npm test -- --run

# 覆盖率报告
npm run test:coverage
```

### 3. 代码检查
```bash
# TypeScript 类型检查
npx tsc --noEmit

# 查看构建输出
npm run build
```

### 4. 调试技巧

#### 状态调试
在浏览器控制台：
```javascript
// 查看当前状态
window.__ZUSTAND_STORE__ = require('@/lib/store/useGameStore').useGameStore

// 查看所有方块
useGameStore.getState().blocks

// 手动触发移动
useGameStore.getState().moveBlock('block-0', [3, 1])
```

#### React DevTools
- 安装 React DevTools 扩展
- 查看组件树和 props
- 性能分析

## 添加新功能

### 示例：添加新的游戏模式

#### 1. 定义新类型
```typescript
// lib/puzzles/types.ts
export interface GameMode {
  name: string;
  timeLimit?: number;
  moveLimit?: number;
}
```

#### 2. 更新 Store
```typescript
// lib/store/useGameStore.ts
interface GameState {
  // ...existing
  gameMode: GameMode | null;
  setGameMode: (mode: GameMode) => void;
}
```

#### 3. 创建 UI
```typescript
// components/ui/GameModeSelector.tsx
export default function GameModeSelector() {
  // ...
}
```

#### 4. 集成到页面
```typescript
// app/p/[slug]/page.tsx
import GameModeSelector from '@/components/ui/GameModeSelector';
```

## 性能优化

### 已实施的优化
1. **React.memo** - 防止不必要的重渲染
2. **useCallback** - 稳定事件处理器引用
3. **CSS transform** - 使用 GPU 加速动画
4. **Set 数据结构** - O(1) 碰撞检测
5. **LocalStorage 节流** - 避免频繁写入

### 性能监控
```bash
# 使用 Lighthouse
npm run build
npm start
# 打开 Chrome DevTools → Lighthouse
```

## 常见问题

### Q: 拖拽在移动端不流畅
A: 确保使用 Pointer Events 而非 Touch Events，并设置 `touch-action: none`

### Q: 状态没有保存到 localStorage
A: 检查浏览器控制台是否有 quota 错误，清除旧数据或减小保存频率

### Q: 测试失败
A: 确保所有依赖都安装正确，运行 `npm install` 重新安装

### Q: 构建警告
A: 检查是否有未使用的导入或变量，使用 ESLint 自动修复

## 代码规范

### TypeScript
- 使用严格模式
- 避免 `any` 类型
- 为函数添加返回类型
- 导出的接口必须有注释

### React
- 函数组件 + Hooks
- Props 解构
- 事件处理器命名：`handleXxx`
- 使用 TypeScript 类型推断

### CSS
- 优先使用 Tailwind 工具类
- 自定义样式放在 `globals.css`
- 使用 CSS 变量实现主题

### 命名规范
- 组件：PascalCase (`Block.tsx`)
- 工具函数：camelCase (`occupiesCells()`)
- 常量：UPPER_CASE (`BOARD_ROWS`)
- 类型/接口：PascalCase (`BlockData`)

## 发布流程

### 1. 版本更新
```bash
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0
```

### 2. 构建
```bash
npm run build
npm run test -- --run
```

### 3. 部署到 Vercel
```bash
# 连接项目
vercel link

# 部署
vercel --prod
```

## 资源链接

- [Next.js 文档](https://nextjs.org/docs)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

## 贡献者

如有问题，请提交 Issue 或联系维护者。

Happy Coding! 🎮

