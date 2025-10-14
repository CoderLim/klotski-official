# 快速开始指南

5分钟内启动并运行华容道游戏！

## 🚀 三步启动

### 1️⃣ 安装依赖
```bash
npm install
```

### 2️⃣ 启动开发服务器
```bash
npm run dev
```

### 3️⃣ 打开浏览器
访问 http://localhost:3000

就这么简单！🎉

## 🎮 立即开始游戏

1. 在首页选择一个拼图关卡
2. 拖拽方块移动它们
3. 将红色的曹操方块移到底部中央出口
4. 恭喜过关！

## ⌨️ 键盘快捷键

| 按键 | 功能 |
|------|------|
| `Tab` | 切换选中方块 |
| `方向键` | 移动选中的方块 |
| `U` | 撤销 |
| `R` | 重做 |
| `ESC` | 关闭弹窗 |

## 📱 移动端使用

直接用手指拖拽方块即可！

## 🎯 游戏目标

将红色的 **2×2 曹操方块** 移动到棋盘底部中央的出口位置。

## 🧩 方块类型

- 🔴 **曹操** (2×2) - 红色，目标方块
- 🟡 **竖将** (2×1) - 黄色
- 🔵 **横将** (1×2) - 蓝色
- 🟢 **小兵** (1×1) - 绿色

## 🔧 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 运行测试
npm test
```

## 📚 需要帮助？

- 详细文档：查看 [README.md](./README.md)
- 开发指南：查看 [DEVELOPMENT.md](./DEVELOPMENT.md)
- 提交问题：[GitHub Issues](https://github.com/your-username/klotski-official/issues)

## 🎨 自定义配置

### 添加新拼图

编辑 `lib/puzzles/index.ts`，添加你的拼图配置：

```typescript
const myPuzzle: PuzzleConfig = {
  name: '我的拼图',
  slug: 'my-puzzle',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] }, // 曹操
    // ... 更多方块
  ],
};
```

### 更改主题颜色

编辑 `tailwind.config.ts` 或 `app/globals.css`。

## ⚡ 性能提示

- 首次加载可能需要几秒钟编译
- 后续热更新非常快（< 100ms）
- 生产构建经过优化，体积更小

## 🐛 常见问题

**Q: 端口 3000 被占用？**
```bash
# 使用其他端口
PORT=3001 npm run dev
```

**Q: 安装依赖失败？**
```bash
# 清除缓存重试
rm -rf node_modules package-lock.json
npm install
```

**Q: 页面空白？**
- 检查浏览器控制台错误
- 确保 Node.js 版本 >= 18
- 尝试清除浏览器缓存

## 🎉 享受游戏！

现在你已经准备好了！开始挑战经典的华容道拼图吧！

记得：
- ⭐ 给项目点个 Star
- 🐛 发现 Bug 请报告
- 💡 有好点子？提交 Issue

Happy Gaming! 🎮

