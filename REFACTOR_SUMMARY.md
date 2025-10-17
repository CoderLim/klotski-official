# 路由和多语言重构总结

## 概述

本次重构将项目从多路由结构简化为单页面应用（SPA），并将多语言实现从路由切换改为基于 localStorage 的客户端状态管理。

## 主要变更

### 1. 移除了路由结构
- ✅ 删除了 `app/[locale]/` 目录及其所有子路由
  - `/[locale]/page.tsx` - 原游戏主页
  - `/[locale]/levels/page.tsx` - 关卡选择页面
  - `/[locale]/p/[slug]/page.tsx` - 单个关卡详情页面
  - `/[locale]/layout.tsx` - 语言路由布局
- ✅ 删除了 `middleware.ts` - 路由重定向中间件
- ✅ 删除了 `i18n/` 目录及其配置文件
  - `i18n/routing.ts` - 路由配置
  - `i18n/request.ts` - 请求配置

### 2. 创建了新的单页面结构
- ✅ 创建了新的 `app/page.tsx` - 作为唯一的游戏页面
- ✅ 更新了 `app/layout.tsx` - 添加了新的 I18nProvider
- ✅ 创建了 `lib/i18n/I18nProvider.tsx` - 基于 localStorage 的多语言 Provider

### 3. 更新了多语言实现
- ✅ 语言设置现在保存在 `localStorage` 中（key: `klotski-locale`）
- ✅ 默认语言为中文（`zh`）
- ✅ 支持的语言：英语、中文、日语、西班牙语、葡萄牙语、韩语
- ✅ 语言切换无需刷新页面，动态加载语言包

### 4. 更新了组件
- ✅ `LanguageSwitcher.tsx` - 使用新的 `useLocaleContext` hook 而不是路由切换
- ✅ `Controls.tsx` - 移除了"选择关卡"按钮和路由依赖
- ✅ `WinDialog.tsx` - 简化了逻辑，移除路由跳转

### 5. 更新了配置
- ✅ `next.config.ts` - 移除了 `next-intl` 插件配置

## 功能变化

### 保留的功能
- ✅ 多语言支持（6种语言）
- ✅ 游戏核心功能（移动、撤销、重做、重置）
- ✅ 胜利检测和庆祝动画
- ✅ 关卡切换（通过"下一关"按钮）
- ✅ 帮助对话框
- ✅ 音效支持

### 移除的功能
- ❌ 关卡列表页面（`/levels`）
- ❌ 独立关卡页面（`/p/[slug]`）
- ❌ URL 中的语言路径（`/zh/`, `/en/` 等）
- ❌ "选择关卡"按钮

## 技术细节

### localStorage 存储
```typescript
// 存储 key
const LOCALE_STORAGE_KEY = 'klotski-locale';

// 默认值
const DEFAULT_LOCALE = 'zh';

// 支持的语言
const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'es', 'pt', 'ko'];
```

### 使用方式
```typescript
// 在任何客户端组件中使用
import { useLocaleContext } from '@/lib/i18n/I18nProvider';

function MyComponent() {
  const { locale, setLocale } = useLocaleContext();
  
  // 切换语言
  setLocale('en');
}
```

## 构建验证

✅ 项目构建成功
✅ 无 TypeScript 错误
✅ 无 Linter 错误
✅ 开发服务器正常运行

## 迁移说明

如果用户之前访问过带语言路径的 URL（如 `/zh/levels`），现在会直接访问根路径 `/`，语言设置会从 localStorage 中读取。首次访问的用户将使用默认语言（中文）。

