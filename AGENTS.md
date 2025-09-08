# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `src/` (Next.js App Router in `src/app`).
- UI in `src/components/` (e.g., `ui/`, `Common/`, `Home/`, `Player/`).
- Shared code: `src/lib/`, hooks in `src/hooks/`, types in `src/types/`, utils in `src/utils/`, email templates in `src/templates/`.
- Public assets in `public/`. Middleware at `src/middleware.ts`.
- Config at repo root: `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `postcss.config.mjs`.
- Generated folders: `.next/` and `.open-next/` (do not edit or commit outputs).

## Build, Test, and Development Commands
- `npm run dev` — Start local dev (HTTPS, host `local.mofei.life`).
- `npm run lint` — Run ESLint with Next.js rules.
- `npm run build` — Create production build.
- `npm start` — Serve the production build locally.
- `npm run preview` — Build and preview via OpenNext Cloudflare.
- `npm run deploy` — Build and deploy to Cloudflare.
- `npm run cf-typegen` — Generate Cloudflare env types to `cloudflare-env.d.ts`.

Setup: copy `.env.example` to `.env.local` for local dev. Cloudflare bindings are managed in `wrangler.jsonc`.

## Coding Style & Naming Conventions
- TypeScript, 2-space indent. Keep imports sorted; remove dead code.
- Components: PascalCase filenames; hooks: `useXyz` camelCase; utilities: camelCase.
- Prefer Tailwind CSS utility classes; use CSS Modules/SCSS only when necessary.
- Run `npm run lint` and fix issues before PRs.

## Testing Guidelines
- No formal test suite yet. When adding tests:
  - Prefer Vitest + React Testing Library.
  - Name files `*.test.ts`/`*.test.tsx` colocated with source.
  - Test DOM-visible behavior and pure functions; avoid brittle snapshots.

## Commit & Pull Request Guidelines
- Use Conventional Commits, e.g.: `feat(player): add progress bar`, `fix(article): prevent rerenders`, `perf: split vendor chunk`.
- PRs must include: purpose, linked issues, UI screenshots (if visual), and notes on perf/SEO impacts. Ensure build and lint pass.

## Security & Configuration Tips
- Never commit secrets. Configure endpoints and image domains in `next.config.ts`.
- Use `wrangler` for secrets/bindings; verify `.env*` files are gitignored.

## Agent-Specific Instructions
- Do not modify generated output (`.next/`, `.open-next/`) or `certificates/`.
- Keep changes minimal and scoped; update docs when adding scripts, env vars, or directories.
