# CrazyGames SDK 错误修复说明

## 🐛 问题描述

之前在完成关卡后会出现以下错误：

```
t.GeneralError
code: "sdkNotInitialized"
message: "CrazySDK is not initialized yet. Check docs.crazygames.com for more info."
```

## ✅ 修复内容

### 1. 增强的平台检测

**文件**: `lib/utils/crazygames.ts`

```typescript
isOnCrazyGames(): boolean {
  // 本地开发环境自动返回 false
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    return false;
  }
  
  // 只在实际 CrazyGames 平台上返回 true
  const referrer = document.referrer.toLowerCase();
  const isCrazyGames = referrer.includes('crazygames.com') || 
                       referrer.includes('crazygames.') ||
                       hostname.includes('crazygames') ||
                       !!window.CrazyGames;
  
  return isCrazyGames;
}
```

### 2. 所有 SDK 方法增加安全检查

所有 SDK 调用（`gameplayStart()`, `happytime()`, `gameplayStop()` 等）现在都会：

1. **检查初始化状态**
   ```typescript
   if (!this.initialized || !this.isOnCrazyGames()) {
     return; // 安全退出，不报错
   }
   ```

2. **Try-Catch 保护**
   ```typescript
   try {
     if (this.sdk?.game?.happytime) {
       this.sdk.game.happytime();
     }
   } catch (error) {
     console.warn('CrazyGames: Failed to trigger happytime', error);
   }
   ```

3. **详细日志**
   - ✅ 本地开发：`Not on CrazyGames platform, SDK disabled (local development)`
   - ✅ 通关时（本地）：`Happytime skipped (SDK not initialized or not on platform)`
   - ✅ CrazyGames 平台：`✅ CrazyGames SDK initialized successfully`

## 🧪 测试步骤

### 本地开发测试

1. **启动开发服务器**
   ```bash
   pnpm dev
   ```

2. **打开浏览器控制台**（F12）

3. **预期看到的日志**
   ```
   Not on CrazyGames platform, SDK disabled (local development)
   ```

4. **完成一关**
   - 应该不会报任何 SDK 错误
   - 控制台会显示：`Happytime skipped (SDK not initialized or not on platform)`
   - 游戏正常运行

### 生产环境测试（CrazyGames 平台）

1. **构建静态文件**
   ```bash
   pnpm build:static
   ```

2. **上传到 CrazyGames**

3. **在 CrazyGames 测试环境**
   - 打开浏览器控制台
   - 预期看到：`✅ CrazyGames SDK initialized successfully`
   - 完成关卡时应触发 `happytime` 事件
   - 无任何错误

## 📊 修复前后对比

| 场景 | 修复前 | 修复后 |
|------|--------|--------|
| 本地开发 | ❌ SDK 未初始化错误 | ✅ 自动检测，静默跳过 |
| 完成关卡（本地） | ❌ `sdkNotInitialized` 错误 | ✅ 安全跳过，有日志说明 |
| CrazyGames 平台 | ⚠️ 可能初始化失败 | ✅ 正确初始化和触发事件 |
| 错误处理 | ❌ 抛出异常 | ✅ Try-Catch 保护，仅警告 |

## 🎯 关键改进

### 1. 智能环境检测
- ✅ 自动识别本地开发环境
- ✅ 自动识别 CrazyGames 平台
- ✅ 避免不必要的初始化尝试

### 2. 防御性编程
- ✅ 所有方法都检查初始化状态
- ✅ 所有 SDK 调用都有 Try-Catch
- ✅ 不影响游戏主体功能

### 3. 开发者友好
- ✅ 清晰的控制台日志
- ✅ 区分正常跳过和真实错误
- ✅ 不会干扰本地开发

## 📝 受影响的文件

```
lib/utils/crazygames.ts      ← 主要修复
app/page.tsx                  ← SDK 初始化调用（无需改动）
app/layout.tsx                ← SDK 脚本加载（无需改动）
CRAZYGAMES_DEPLOY.md         ← 更新故障排除部分
```

## 🚀 部署建议

1. **本地测试通过后**，运行完整构建：
   ```bash
   pnpm build:static
   ```

2. **本地预览静态文件**：
   ```bash
   pnpm preview
   ```

3. **验证以下功能**：
   - ✅ 游戏正常加载
   - ✅ 完成关卡无错误
   - ✅ 控制台日志正常
   - ✅ 所有功能正常工作

4. **上传到 CrazyGames** 进行最终测试

## 💡 技术细节

### SDK 初始化流程

```typescript
// app/page.tsx 中的初始化
useEffect(() => {
  crazyGamesSDK.init().then((success) => {
    if (success) {
      // 只在 CrazyGames 平台执行
      crazyGamesSDK.gameLoadingStop();
      crazyGamesSDK.gameplayStart();
    }
    // 本地环境 success = false，安全跳过
  });
}, []);
```

### 通关事件触发

```typescript
// app/page.tsx 中的胜利检测
useEffect(() => {
  if (isWin && !showWinDialog) {
    setShowWinDialog(true);
    // 自动检测环境，只在 CrazyGames 平台触发
    crazyGamesSDK.happytime();
  }
}, [isWin, showWinDialog]);
```

## ✨ 总结

这个修复确保了：
- ✅ 本地开发时不会报 SDK 错误
- ✅ CrazyGames 平台上正确工作
- ✅ 游戏在任何环境都能正常运行
- ✅ 开发者体验更好（清晰的日志）
- ✅ 生产环境更稳定（错误保护）

现在可以放心地在本地开发和测试，不会再看到 `sdkNotInitialized` 错误！🎉

