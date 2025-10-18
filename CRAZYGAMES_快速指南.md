# CrazyGames SDK v3 快速指南

## 🎉 更新完成！

您的项目已经成功集成 CrazyGames SDK v3！所有功能都已配置完毕。

## ✅ 已完成的集成

### 1. SDK 加载
✅ 已在 `app/layout.tsx` 中添加 SDK v3 脚本

### 2. SDK 初始化
✅ 已在 `app/page.tsx` 中实现初始化逻辑

### 3. 游戏事件
✅ 游戏加载完成 - `loadingStop()`
✅ 游戏开始 - `gameplayStart()`
✅ 通关时刻 - `happytime()`

### 4. 环境检测
✅ 自动识别本地开发环境
✅ 自动识别 CrazyGames 平台

## 🚀 快速开始

### 本地开发
```bash
pnpm dev
```
在浏览器控制台会看到：
```
Not on CrazyGames platform, SDK disabled (local development)
```
✅ 这是正常的！SDK 会自动跳过，不影响游戏运行。

### 构建部署
```bash
pnpm build:static
```
这会生成 `out/` 目录，包含所有静态文件。

### 上传到 CrazyGames
1. 压缩 `out/` 目录为 ZIP 文件
2. 上传到 [CrazyGames 开发者门户](https://developer.crazygames.com)
3. 在预览环境测试

在 CrazyGames 平台控制台会看到：
```
✅ CrazyGames SDK v3 initialized successfully
Environment: crazygames
CrazyGames: Loading stopped
CrazyGames: Gameplay started
```

## 📊 v3 SDK 主要变更

| 变更项 | 说明 |
|--------|------|
| 初始化 | 必须手动调用 `init()` 方法 ✨ |
| 加载方法 | `loadingStart/Stop()` 替代旧的 `sdkGameLoadingStart/Stop()` ✨ |
| 环境检测 | 新增 `environment` 属性 ✨ |

**好消息**：所有这些变更都已经实现，您不需要做任何修改！

## 🎮 SDK 事件流程

```
游戏加载
  ↓
SDK 初始化 (自动)
  ↓
loadingStop() - 加载完成
  ↓
gameplayStart() - 游戏开始
  ↓
[玩家游戏中...]
  ↓
happytime() - 通关时触发 🎉
```

## 📁 核心文件

| 文件 | 作用 |
|------|------|
| `lib/utils/crazygames.ts` | SDK 核心封装（v3 版本） |
| `app/page.tsx` | 游戏主页面，包含 SDK 初始化 |
| `app/layout.tsx` | SDK 脚本加载 |

## 🆕 新增功能

```typescript
// 获取 SDK 环境
crazyGamesSDK.getEnvironment();
// 返回: 'crazygames' | 'local' | 'disabled' | 'unknown'

// 检查是否已初始化
crazyGamesSDK.isInitialized();
// 返回: boolean
```

## 📚 详细文档

需要了解更多技术细节？查看这些文档：

- 📄 `CRAZYGAMES_SDK_FIX.md` - v3 技术细节和实现说明
- 📄 `CRAZYGAMES_DEPLOY.md` - 完整部署指南
- 📄 `CRAZYGAMES_SDK_V3_UPGRADE.md` - 升级记录和测试结果
- 🌐 [CrazyGames SDK v3 官方文档](https://docs.crazygames.com/sdk/intro/#html5)

## ✨ 常见问题

### Q: 本地开发时看到 "SDK disabled" 是错误吗？
**A**: 不是！这是正常的。SDK 会自动检测本地环境并跳过，不会影响游戏运行。

### Q: 需要修改现有代码吗？
**A**: 不需要！SDK 封装已经做了兼容处理，对外接口保持不变。

### Q: 如何测试 SDK 是否正常工作？
**A**: 上传到 CrazyGames 预览环境后，打开浏览器控制台，应该能看到：
```
✅ CrazyGames SDK v3 initialized successfully
Environment: crazygames
```

### Q: 如果出现错误怎么办？
**A**: 
1. 查看浏览器控制台的错误信息
2. 确认 `index.html` 在 ZIP 根目录
3. 查看 `CRAZYGAMES_DEPLOY.md` 的故障排除部分
4. SDK 有完整的错误保护，不会影响游戏运行

## 🎯 下一步

现在您可以：

1. ✅ 继续本地开发（SDK 不会干扰）
2. ✅ 运行 `pnpm build:static` 构建游戏
3. ✅ 上传到 CrazyGames 测试
4. ✅ 提交审核并发布

祝您的游戏发布顺利！🎮✨

---

**更新时间**: 2025年10月18日  
**SDK 版本**: v3  
**状态**: ✅ 就绪

