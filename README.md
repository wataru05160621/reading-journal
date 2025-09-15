# Reading Journal — Monorepo (Workspaces)

This repo contains early scaffolding for a reading-journal app.

## Workspaces
- `apps/api`: minimal Node HTTP server on `:3000`
- `apps/web`: simple static dev server on `:5173`
- `apps/mobile`: placeholder script before Expo setup
- `packages/{core,ui,analytics}`: shared libraries (stubs)
- `infra/prisma`: Prisma schema placeholder

## Dev Commands
- `npm run dev:api` — start API at http://localhost:3000
- API endpoints:
  - `GET /books/search?q=キーワード` または `GET /books/search?isbn=ISBN`（Google/OpenLibrary統合）
- `npm run dev:web` — start web at http://localhost:5173
- `npm run dev:mobile` — run mobile placeholder
- `npm run typecheck && npm run lint && npm run build` — aggregate tasks per workspace

## Environment
- Node.js 18+ recommended. Use `.env.local` (gitignored) for secrets.

## Next Steps
- Implement Prisma models (see `docs/02`), then CRUD (VS tasks).
- Replace stubs with proper frameworks (NestJS/Next.js/Expo) as per `CODEX.md` and `docs/06_Codex_タスク指示テンプレ.md`.
- NestJS API (apps/api) development
  - 依存インストール: `cd apps/api && npm i`
  - 起動: `npm run start:dev`
  - もし tsconfig が見つからないエラーが出た場合は、`apps/api/nest-cli.json` の `tsConfigPath` が `tsconfig.json` になっているか確認してください（本リポジトリでは修正済み）。
