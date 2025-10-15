# 多语言支持指南 (i18n Guide)

## 概述

华容道游戏现已支持 6 种语言：

- 🇬🇧 **English (en)** - 默认语言
- 🇨🇳 **简体中文 (zh)**
- 🇯🇵 **日本語 (ja)**
- 🇪🇸 **Español (es)**
- 🇵🇹 **Português (pt)**
- 🇰🇷 **한국어 (ko)**

## 技术栈

- **next-intl**: Next.js 国际化框架
- **中间件路由**: 基于 URL 路径的语言切换 (例如: `/en`, `/zh`, `/ja`)
- **SSG 预渲染**: 所有语言版本都会在构建时预渲染

## 项目结构

```
klotski-official/
├── i18n/
│   ├── request.ts          # i18n 配置
│   └── routing.ts          # 路由配置
├── messages/
│   ├── en.json             # 英文翻译
│   ├── zh.json             # 中文翻译
│   ├── ja.json             # 日文翻译
│   ├── es.json             # 西班牙语翻译
│   ├── pt.json             # 葡萄牙语翻译
│   └── ko.json             # 韩语翻译
├── middleware.ts           # 语言路由中间件
└── app/
    └── [locale]/           # 语言路由目录
        ├── layout.tsx
        ├── page.tsx
        └── p/[slug]/
            └── page.tsx
```

## URL 结构

所有路由现在都包含语言代码：

- 主页: `/{locale}` (例如: `/en`, `/zh`, `/ja`)
- 游戏页: `/{locale}/p/{slug}` (例如: `/en/p/hengdao`, `/zh/p/hengdao`)

访问根路径 `/` 会自动重定向到默认语言 `/en`。

## 语言切换

用户可以通过以下方式切换语言：

1. **语言切换器组件**: 在主页右上角点击语言选择器
2. **直接访问 URL**: 修改 URL 中的语言代码

语言切换器会保持当前页面路径，只改变语言部分。

## 添加新语言

1. 在 `i18n/routing.ts` 中添加语言代码到 `locales` 数组
2. 在 `messages/` 目录下创建新的翻译文件 (例如: `fr.json`)
3. 复制 `en.json` 的结构并翻译所有文本
4. 在 `components/ui/LanguageSwitcher.tsx` 中添加语言选项

## 添加新的翻译文本

在 `messages/{locale}.json` 文件中添加新的键值对：

```json
{
  "section": {
    "key": "Translated text"
  }
}
```

在组件中使用：

```tsx
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('section');
  return <div>{t('key')}</div>;
}
```

## 开发和构建

### 开发模式
```bash
npm run dev
```

访问 `http://localhost:3000` 会自动重定向到 `http://localhost:3000/en`

### 生产构建
```bash
npm run build
npm start
```

构建时会为所有 6 种语言生成静态页面。

## 注意事项

- 默认语言设置为英文 (en)，符合国际化最佳实践
- 所有翻译文本都保存在 `messages/` 目录的 JSON 文件中
- 语言代码遵循 ISO 639-1 标准
- 使用服务端和客户端混合渲染以获得最佳性能
- 语言选择会在页面导航时保持

## 贡献翻译

欢迎贡献新的语言翻译或改进现有翻译！请确保：

1. 翻译准确且符合上下文
2. 保持 JSON 文件格式正确
3. 测试所有翻译文本在 UI 中的显示效果
4. 注意字符长度，避免 UI 布局问题

