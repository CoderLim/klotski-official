# Klotski - Traditional Chinese Puzzle Game

<div align="center">

![Klotski](https://img.shields.io/badge/Klotski-Puzzle-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A complete, modern Klotski puzzle game built with Next.js 14 + TypeScript

[Live Demo](https://klotski-official.vercel.app/) | [Quick Start](https://klotski-official.vercel.app/) | [Game Rules](#game-rules)

</div>

---

## ✨ Features

- 🎮 **Complete Game Experience** - Mouse drag, touch controls, and keyboard navigation
- 🧩 **6+ Classic Layouts** - Traditional puzzles like "Heng Dao Li Ma", "Jin Zai Zhi Chi", and more
- 🌍 **Multi-language Support** - English, Chinese, Japanese, Spanish, Portuguese, Korean (default: English)
- 🎯 **Smart Detection** - Real-time collision detection, boundary constraints, win condition checking
- ⏱️ **Progress Tracking** - Move counter, timer, and history records
- 🔄 **Undo/Redo** - Complete operation history management
- 💾 **Auto-save** - LocalStorage persistence for game progress
- 🎨 **Beautiful UI** - Arcade-style interface, smooth animations, responsive design
- 🔊 **Sound Effects** - Move, win, and error sound feedback (mutable)
- ♿ **Accessibility** - ARIA labels, keyboard navigation, high contrast focus
- 📱 **Cross-platform** - Desktop and mobile device support

## 🚀 Quick Start

### Requirements

- Node.js 18+
- npm / pnpm / yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/klotski-official.git
cd klotski-official

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Run development server
npm run dev
# or
pnpm dev

# 4. Open browser and visit
# http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
# Run unit tests
npm test

# Test coverage
npm run test:coverage
```

## 🎮 Game Rules

### Objective
Move the red **Cao Cao block (2×2)** to the exit position at the bottom center of the board to win.

### Controls

#### Mouse/Touch
- Drag blocks directly to move them

#### Keyboard Controls
- `Tab` / `Shift+Tab` - Navigate between blocks
- `Arrow Keys` - Move selected block (1 step)
- `Enter` - Select/deselect block
- `U` - Undo last move
- `R` - Redo
- `Ctrl+R` - Reset puzzle
- `ESC` - Close dialogs

### Block Types

| Block | Size | Color | Description |
|-------|------|-------|-------------|
| Cao Cao | 2×2 | Red | Target block, must reach exit |
| Vertical General | 2×1 | Yellow | Vertical rectangle |
| Horizontal General | 1×2 | Blue | Horizontal rectangle |
| Soldier | 1×1 | Green | Small square |

## 📂 Project Structure

```
klotski-official/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Multi-language routing
│   │   ├── layout.tsx       # Language layout
│   │   ├── page.tsx         # Home page (level selection)
│   │   └── p/[slug]/page.tsx # Game page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── game/
│   │   ├── Board.tsx        # Game board
│   │   ├── Block.tsx        # Draggable blocks
│   │   └── PuzzlePreview.tsx # Puzzle preview
│   └── ui/
│       ├── HUD.tsx          # Status display
│       ├── Controls.tsx     # Control buttons
│       ├── Modal.tsx        # Generic modals
│       ├── WinDialog.tsx    # Victory dialog
│       ├── HelpDialog.tsx   # Help instructions
│       ├── Confetti.tsx     # Victory effects
│       └── LanguageSwitcher.tsx # Language switcher
├── i18n/                    # Internationalization config
│   ├── request.ts           # i18n configuration
│   └── routing.ts           # Routing configuration
├── messages/                # Translation files
│   ├── en.json              # English
│   ├── zh.json              # Chinese
│   ├── ja.json              # Japanese
│   ├── es.json              # Spanish
│   ├── pt.json              # Portuguese
│   └── ko.json              # Korean
├── lib/                     # Core logic
│   ├── puzzles/
│   │   ├── types.ts         # Type definitions
│   │   └── index.ts         # Puzzle database
│   ├── engine/
│   │   ├── collision.ts     # Collision detection
│   │   ├── movement.ts      # Movement logic
│   │   ├── validation.ts    # Boundary validation
│   │   └── win.ts           # Win condition
│   ├── store/
│   │   └── useGameStore.ts  # Zustand state management
│   └── utils/
│       ├── grid.ts          # Grid calculations
│       ├── colors.ts        # Color mapping
│       └── sound.ts         # Sound management
├── public/
│   └── sounds/              # Sound files
├── __tests__/               # Unit tests
│   └── engine.test.ts
├── middleware.ts            # Internationalization middleware
├── tailwind.config.ts       # Tailwind configuration
├── vitest.config.ts         # Test configuration
└── package.json
```

## 🧩 Adding New Puzzles

### Step 1: Define Puzzle Configuration

Add new puzzle configuration in `lib/puzzles/index.ts`:

```typescript
const myPuzzleConfig: PuzzleConfig = {
  name: 'My Puzzle',
  slug: 'my-puzzle',
  difficulty: 'medium', // 'easy' | 'medium' | 'hard' | 'expert'
  blocks: [
    { shape: [2, 2], position: [0, 1] }, // Cao Cao (must have one)
    { shape: [2, 1], position: [0, 0] }, // Vertical General
    { shape: [1, 2], position: [2, 1] }, // Horizontal General
    { shape: [1, 1], position: [3, 1] }, // Soldier
    // ... more blocks
  ],
};
```

### Step 2: Register to Puzzle Table

```typescript
export const PUZZLES: Record<string, PuzzleConfig> = {
  // ... existing puzzles
  'my-puzzle': myPuzzleConfig,
};
```

### Step 3: Validate Configuration

Run the development server, configuration will be automatically validated:
- Board size: 5×4
- Blocks cannot overlap
- Blocks cannot exceed boundaries
- Must contain exactly one 2×2 red block

### JSON Schema

```typescript
{
  "name": "string",           // Puzzle name
  "slug": "string",           // URL identifier
  "difficulty": "easy" | "medium" | "hard" | "expert",
  "blocks": [
    {
      "shape": [rows, cols],  // [height, width]
      "position": [row, col]  // [row, col] (0-indexed)
    }
  ]
}
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Internationalization**: next-intl
- **State Management**: Zustand + Immer
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Audio**: Howler.js
- **Validation**: Zod
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + TypeScript

## 📊 Game Data

### Classic Layouts

1. **Heng Dao Li Ma** - Medium difficulty, ~80+ moves
2. **Jin Zai Zhi Chi** - Easy, ~60+ moves
3. **Ceng Ceng She Fang** - Hard, ~100+ moves
4. **Shui Xie Bu Tong** - Expert, ~120+ moves
5. **Xiao Yan Chu Chao** - Medium, ~70+ moves
6. **Bing Dang Jiang Zu** - Hard, ~90+ moves

### Performance Metrics

- ⚡ First load: < 1s
- 🎯 Drag response: 60 FPS
- 💾 State persistence: Real-time
- 📦 Bundle size: < 500KB (gzipped)

## 🤝 Contributing

Issues and Pull Requests are welcome!

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards

- Follow TypeScript strict mode
- Use ESLint configuration
- Components use functional + Hooks
- Add necessary comments and types

## 🌍 Multi-language Support

The project supports 6 languages:

| Language | Code | Status |
|----------|------|--------|
| 🇬🇧 English | `en` | ✅ Default |
| 🇨🇳 简体中文 | `zh` | ✅ |
| 🇯🇵 日本語 | `ja` | ✅ |
| 🇪🇸 Español | `es` | ✅ |
| 🇵🇹 Português | `pt` | ✅ |
| 🇰🇷 한국어 | `ko` | ✅ |

Access different language versions:
- English: `http://localhost:3000/en`
- Chinese: `http://localhost:3000/zh`
- Japanese: `http://localhost:3000/ja`

For detailed internationalization guide, see [I18N_GUIDE.md](I18N_GUIDE.md)

## 📝 Todo List

- [x] Internationalization (English, Chinese, Japanese, Spanish, Portuguese, Korean)
- [ ] Add more classic layouts (10+)
- [ ] Implement auto-solver (AI)
- [ ] Add multiplayer mode
- [ ] Support custom puzzle editor
- [ ] Leaderboard feature (least moves/shortest time)
- [ ] PWA support (offline available)
- [ ] Hint system (show possible moves)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Klotski game inspiration from traditional Chinese puzzle games
- Classic layouts referenced from historical literature and internet resources
- UI design inspired by modern arcade games

---

<div align="center">

**If you find this project useful, please give it a ⭐ Star!**

Made with ❤️ by CoderLim

[Report Bug](https://github.com/your-username/klotski-official/issues) · [Request Feature](https://github.com/your-username/klotski-official/issues)

</div>
