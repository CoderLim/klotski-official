# CrazyGames SDK v3 集成说明

## 📦 SDK 版本

**当前版本**: v3  
**文档**: https://docs.crazygames.com/sdk/intro/#html5

## 🎯 v2 到 v3 的重要变更

### 1. SDK 需要手动初始化
v3 SDK 必须在使用前调用初始化方法：

```typescript
await window.CrazyGames.SDK.init();
```

### 2. 方法名称变更
| v2 方法名 | v3 方法名 | 说明 |
|----------|----------|------|
| `sdkGameLoadingStart()` | `loadingStart()` | 游戏加载开始 |
| `sdkGameLoadingStop()` | `loadingStop()` | 游戏加载完成 |
| `gameplayStart()` | `gameplayStart()` | 游戏开始（不变） |
| `gameplayStop()` | `gameplayStop()` | 游戏暂停（不变） |
| `happytime()` | `happytime()` | 快乐时刻（不变） |

### 3. 新增 environment 属性
```typescript
window.CrazyGames.SDK.environment
// 返回: 'crazygames' | 'local' | 'disabled'
```

## ✅ 当前集成状态

### 1. SDK 脚本加载
**文件**: `app/layout.tsx`

```tsx
<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>
```

### 2. SDK 初始化（v3 版本）
**文件**: `lib/utils/crazygames.ts`

```typescript
async init(): Promise<boolean> {
  // 等待 SDK 脚本加载
  await this.waitForSDK();
  
  // ✨ v3 新增：调用官方 init 方法
  if (window.CrazyGames?.SDK?.init) {
    await window.CrazyGames.SDK.init();
    this.sdk = window.CrazyGames.SDK;
    this.initialized = true;
    console.log('✅ CrazyGames SDK v3 initialized successfully');
    console.log('Environment:', this.sdk.environment);
    return true;
  }
}
```

### 3. 方法调用（使用 v3 API）
**文件**: `lib/utils/crazygames.ts`

```typescript
// ✨ 使用 v3 新方法名
gameLoadingStop(): void {
  if (this.sdk?.game?.loadingStop) {
    this.sdk.game.loadingStop();  // v3: loadingStop
  }
}

// 其他方法保持不变
gameplayStart(): void {
  if (this.sdk?.game?.gameplayStart) {
    this.sdk.game.gameplayStart();
  }
}

happytime(): void {
  if (this.sdk?.game?.happytime) {
    this.sdk.game.happytime();
  }
}
```

### 4. 安全检查机制

所有 SDK 方法都包含以下保护：

1. **平台检测**
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

3. **智能环境检测**
   - 本地开发环境（localhost/127.0.0.1）→ 自动禁用
   - CrazyGames 平台 → 正常初始化和运行
   - 其他域名 → 禁用（除非从 CrazyGames 嵌入）

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
   - ✅ 不会报任何 SDK 错误
   - ✅ 控制台会显示：`Happytime skipped (SDK not initialized or not on platform)`
   - ✅ 游戏正常运行

### 生产环境测试（CrazyGames 平台）

1. **构建静态文件**
   ```bash
   pnpm build:static
   ```

2. **上传到 CrazyGames Preview Tool**

3. **在 CrazyGames 测试环境打开控制台**
   
   **预期日志流程**：
   ```
   Initializing CrazyGames SDK v3...
   ✅ CrazyGames SDK v3 initialized successfully
   Environment: crazygames (或 local)
   CrazyGames: Loading stopped
   CrazyGames: Gameplay started
   ```

4. **完成一关后**
   ```
   CrazyGames: Happytime triggered
   ```

5. **验证**
   - ✅ SDK 成功初始化
   - ✅ 游戏加载事件正常触发
   - ✅ 通关事件正常触发
   - ✅ 无任何错误

## 📊 v2 vs v3 对比

| 项目 | v2 SDK | v3 SDK |
|------|--------|--------|
| 初始化 | 自动初始化 | ✨ 需要手动调用 `init()` |
| 加载方法 | `sdkGameLoadingStart/Stop()` | ✨ `loadingStart/Stop()` |
| 环境检测 | 无内置方法 | ✨ `SDK.environment` 属性 |
| 本地开发 | 可能报错 | ✅ 自动识别，安全跳过 |
| 错误处理 | 不一致（字符串或对象） | ✅ 统一格式 `{code, message}` |

## 🎯 关键改进

### 1. 符合 v3 SDK 规范
- ✅ 调用官方 `window.CrazyGames.SDK.init()` 方法
- ✅ 使用新的方法名（`loadingStart/Stop`）
- ✅ 利用 `environment` 属性进行环境检测

### 2. 智能环境检测
- ✅ 自动识别本地开发环境（localhost/127.0.0.1/内网 IP）
- ✅ 自动识别 CrazyGames 平台
- ✅ 避免不必要的初始化尝试

### 3. 防御性编程
- ✅ 所有方法都检查初始化状态
- ✅ 所有 SDK 调用都有 Try-Catch 保护
- ✅ 不影响游戏主体功能

### 4. 开发者友好
- ✅ 清晰的控制台日志
- ✅ 区分正常跳过和真实错误
- ✅ 本地开发不会干扰游戏运行

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

### SDK 初始化流程（v3）

```typescript
// app/page.tsx 中的初始化
useEffect(() => {
  crazyGamesSDK.init().then((success) => {
    if (success) {
      // ✨ v3: 只在 CrazyGames 平台执行
      crazyGamesSDK.gameLoadingStop();  // 内部调用 loadingStop()
      crazyGamesSDK.gameplayStart();
    }
    // 本地环境 success = false，安全跳过
  });
}, []);
```

### SDK 初始化内部流程

```typescript
// lib/utils/crazygames.ts
async init() {
  // 1. 检测平台
  if (!this.isOnCrazyGames()) {
    return false;
  }
  
  // 2. 等待 SDK 脚本加载
  await this.waitForSDK();
  
  // 3. ✨ v3 关键：调用官方 init 方法
  await window.CrazyGames.SDK.init();
  
  // 4. 保存 SDK 实例
  this.sdk = window.CrazyGames.SDK;
  this.initialized = true;
}
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

## 🆕 新增方法

```typescript
// 获取 SDK 环境
crazyGamesSDK.getEnvironment();
// 返回: 'crazygames' | 'local' | 'disabled' | 'unknown'

// 检查是否已初始化
crazyGamesSDK.isInitialized();
// 返回: boolean
```

## ✨ 总结

本次更新确保了：
- ✅ **符合 v3 规范**：调用官方 init 方法，使用新的 API
- ✅ **向后兼容**：对外接口保持不变（`gameLoadingStop` 等）
- ✅ **本地开发友好**：不会报 SDK 错误
- ✅ **CrazyGames 平台正确工作**：完整支持所有功能
- ✅ **稳定可靠**：多层错误保护，不影响游戏运行
- ✅ **易于调试**：清晰的日志和环境检测

现在您可以安全地部署到 CrazyGames 平台了！🎉

