# CrazyGames 部署指南

本文档说明如何将华容道游戏部署到 CrazyGames.com 平台。

## ✅ 已完成的准备工作

### 1. 静态导出配置
- ✅ `next.config.ts` 已配置 `output: 'export'`
- ✅ 图片优化已禁用（`unoptimized: true`）
- ✅ 项目可以打包为纯静态 HTML5 应用

### 2. CrazyGames SDK 集成
- ✅ SDK 脚本已添加到 `app/layout.tsx`
- ✅ SDK 工具类 `lib/utils/crazygames.ts` 已创建
- ✅ 关键事件已集成：
  - `gameplayStart()` - 游戏开始时触发
  - `gameLoadingStop()` - 资源加载完成时触发
  - `happytime()` - 玩家通关时触发

### 3. 技术要求检查

| 要求 | 状态 | 说明 |
|-----|------|------|
| 文件大小 < 250MB | ✅ | 当前构建约 2-5MB |
| 初始下载 < 50MB | ✅ | 首次加载很小 |
| 移动端优化 < 20MB | ✅ | 响应式设计，适配移动端 |
| Chrome/Edge 兼容 | ✅ | 使用现代 React 和标准 Web API |
| 4GB RAM 设备流畅 | ✅ | 轻量级拼图游戏，性能优异 |
| 支持英语 | ✅ | 支持 6 种语言（含英语） |

## 📦 构建静态文件

运行以下命令生成部署文件：

```bash
pnpm build:static
```

构建完成后，所有文件将生成在 `out/` 目录中。

**重要说明**：
- ✅ 所有资源路径已自动转换为**相对路径**（`./`）
- ✅ 可以部署到任何路径，无需额外配置
- ✅ 构建过程会自动运行路径修复脚本
- 📄 详见 [相对路径配置指南](./RELATIVE_PATHS_GUIDE.md)

## 📤 上传到 CrazyGames

### 第 1 步：注册开发者账户
1. 访问 [CrazyGames 开发者门户](https://developer.crazygames.com)
2. 注册并创建开发者账户
3. 完成账户验证

### 第 2 步：创建游戏条目
1. 在开发者控制台点击 "Add Game"
2. 填写游戏基本信息：
   - **游戏名称**: Klotski / 华容道
   - **类型**: Puzzle
   - **标签**: puzzle, strategy, classic, brain, sliding-puzzle
   - **描述**: 经典中国滑块拼图游戏，移动方块让曹操逃出华容道

### 第 3 步：上传游戏文件
1. 将 `out/` 目录中的**所有文件**压缩为 `.zip` 格式
2. 在开发者控制台上传 ZIP 文件
3. 确保 `index.html` 在 ZIP 根目录

**重要提示**：
- 不要包含 `node_modules/` 或源代码
- 只上传 `out/` 目录的内容
- 文件结构应该是：
  ```
  game.zip
  ├── index.html
  ├── _next/
  ├── sounds/
  └── 其他静态资源
  ```

### 第 4 步：配置游戏设置

#### 基本设置
- **游戏尺寸**: 推荐 16:9 或响应式
- **方向**: 支持横屏和竖屏
- **最小屏幕**: 320px x 480px

#### 截图和素材
准备以下素材：
- **游戏图标**: 512x512 PNG
- **缩略图**: 400x300 JPG/PNG
- **游戏截图**: 至少 3 张（1920x1080）
- **预览视频**（可选）: MP4 格式

#### 元数据
```
标题: Klotski - 华容道拼图
描述: 经典的中国滑块拼图游戏。移动方块，帮助曹操从华容道逃脱！这是一个考验智力和策略的益智游戏，拥有多个难度等级。支持多语言。

特点:
- 40+ 精心设计的关卡
- 6 种语言支持
- 精美的动画效果
- 撤销/重做功能
- 计步和计时系统
- 响应式设计，适配所有设备
```

### 第 5 步：测试
1. 上传后，使用 CrazyGames 提供的测试链接
2. 检查以下内容：
   - ✅ 游戏正常加载
   - ✅ SDK 事件正常触发
   - ✅ 音效正常播放
   - ✅ 多语言切换正常
   - ✅ 在不同浏览器测试（Chrome、Edge）
   - ✅ 在移动设备测试

### 第 6 步：提交审核
1. 完成所有配置后，点击 "Submit for Review"
2. CrazyGames QA 团队将在 3-7 个工作日内审核
3. 审核通过后，游戏将上线

## 🎯 优化建议

### 性能优化
- ✅ 已使用 Zustand 进行状态管理
- ✅ 已使用 Framer Motion 优化动画
- ✅ 音频使用 Howler.js 高效管理
- ✅ 使用 localStorage 保存进度

### 用户体验
- ✅ 响应式设计，适配各种屏幕
- ✅ 支持键盘快捷键（U 撤销，R 重做）
- ✅ 提供视觉和音频反馈
- ✅ 多语言支持（6 种语言）

### 未来增强（可选）
- [ ] 集成广告系统（中插广告/激励广告）
- [ ] 添加排行榜功能
- [ ] 添加每日挑战
- [ ] 集成 CrazyGames 用户系统

## 📊 SDK 集成详情

### 已实现的 SDK 功能

#### 1. 基础事件
```typescript
// 游戏加载完成
crazyGamesSDK.gameLoadingStop();

// 游戏开始
crazyGamesSDK.gameplayStart();

// 游戏停止（暂停/菜单）
crazyGamesSDK.gameplayStop();

// 快乐时刻（通关）
crazyGamesSDK.happytime();
```

#### 2. 广告支持（已预留接口）
```typescript
// 中插广告
await crazyGamesSDK.requestMidgameAd();

// 激励广告
await crazyGamesSDK.requestRewardedAd();
```

### SDK 文件位置
- SDK 集成代码: `lib/utils/crazygames.ts`
- SDK 初始化: `app/page.tsx`（第 32-40 行）
- SDK 脚本引入: `app/layout.tsx`（第 20 行）

## 🐛 故障排除

### 问题：游戏无法加载
**解决方案**：
- 检查浏览器控制台错误
- 确保所有资源路径正确
- 验证 `index.html` 在 ZIP 根目录

### 问题：SDK 事件未触发或报错 "sdkNotInitialized"
**解决方案**：
- ✅ **已修复**：SDK 现在会自动检测平台和初始化状态
- 在本地开发环境（localhost），SDK 会自动禁用，不会报错
- 所有 SDK 调用都有错误保护，不会影响游戏运行
- 查看控制台日志：
  - `Not on CrazyGames platform, SDK disabled (local development)` - 正常
  - `Happytime skipped (SDK not initialized...)` - 正常，本地开发
  - `✅ CrazyGames SDK initialized successfully` - 在 CrazyGames 平台成功初始化

### 问题：音频无法播放
**解决方案**：
- 确保音频文件在 `out/sounds/` 目录
- 检查浏览器自动播放策略
- 验证 Howler.js 正确初始化

### 问题：文件过大
**解决方案**：
- 优化图片资源
- 移除未使用的语言文件
- 使用 gzip 压缩（CrazyGames 会自动处理）

## 📞 支持资源

- [CrazyGames 开发者文档](https://docs.crazygames.com/)
- [SDK 文档](https://docs.crazygames.com/sdk/html5/)
- [技术要求](https://docs.crazygames.com/requirements/technical/)
- [质量要求](https://docs.crazygames.com/requirements/quality/)

## ✨ 下一步

1. 运行 `pnpm build:static` 构建游戏
2. 测试 `out/` 目录的静态文件（运行 `pnpm preview`）
3. 准备游戏素材（图标、截图、描述）
4. 注册 CrazyGames 开发者账户
5. 上传并提交审核

祝您的游戏发布顺利！🎮🎉

