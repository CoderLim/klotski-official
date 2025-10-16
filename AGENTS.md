# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts Next.js 15 App Router entry points; pair each route with localized messages from `messages/<locale>.json`.
- `components/game/` renders the puzzle board and controls; `components/ui/` holds reusable layout primitives.
- Domain logic lives in `lib/`: `lib/engine/` manages movement and collision, `lib/store/` wraps the Zustand state, and `lib/utils/` centralizes helpers.
- Localization config sits in `i18n/`, shared copy in `messages/`; static assets and puzzle thumbnails live under `public/`.
- Tests reside in `__tests__/`, with fixtures co-located beside the modules they exercise.

## Build, Test, and Development Commands
- `pnpm install` syncs dependencies (uses the repo's locked pnpm toolchain).
- `pnpm dev` launches the turbopack dev server at `http://localhost:3000` with hot reload.
- `pnpm build` produces a production bundle; run before release to confirm routes compile.
- `pnpm start` serves the built app locally for smoke checks.
- `pnpm test`, `pnpm test -- --run`, and `pnpm test:coverage` run the Vitest suite in watch, single-run, and coverage modes.
- `pnpm test:ui` opens the Vitest UI dashboard; `pnpm exec tsc --noEmit` performs strict type checks.

## Coding Style & Naming Conventions
- Write TypeScript throughout; keep components in PascalCase files (e.g., `Block.tsx`) and hooks/utilities in camelCase (e.g., `useGameStore.ts`).
- Use two-space indentation, single quotes, and Tailwind utility classes for styling whenever possible.
- Prefer the `@/` alias for repo-relative imports to simplify refactors.
- When adding UI strings, update every locale file in `messages/` using dot-separated keys; default English copy remains the source of truth.

## Testing Guidelines
- Use Vitest with `@testing-library/react` for UI behavior; place specs in `__tests__/feature.test.ts` to mirror the module under test.
- Cover happy path and guard-rail scenarios (movement failures, win detection) so regressions surface quickly.
- Run `pnpm test:coverage` before opening a PR to confirm coverage stays stable.

## Commit & Pull Request Guidelines
- Follow conventional commits (`feat:`, `fix:`, `chore:`, `docs:`); optional scopes like `engine` or `i18n` help triage.
- Keep commits focused and document notable UI or gameplay shifts in the message body.
- In PRs, link issues, include user-facing summaries, and attach screenshots or GIFs for visual updates; call out localization or puzzle data edits for targeted review.

## Localization & Configuration Tips
- Register new locales in `i18n/config.ts` and supply matching `messages/<locale>.json`; verify `next-intl` loads them via `pnpm dev`.
- Place new audio or media under `public/` and reference them with absolute `/` paths to leverage Next.js asset handling.
