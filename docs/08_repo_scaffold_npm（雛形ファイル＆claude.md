# 08_repo_scaffold_npm（雛形ファイル＆CLAUDE.md）
最終更新: 2025-08-31 (JST)

> ここにある内容をそのままリポジトリに配置すれば、**npm workspaces** 前提のモノレポが立ち上がります。各ファイルはコピー＆ペーストで作成してください。

---

## 📁 ディレクトリ構成（npm workspaces）
```
book-journal/
├─ apps/
│  ├─ mobile/
│  ├─ web/
│  └─ api/
├─ packages/
│  ├─ core/
│  ├─ ui/
│  └─ analytics/
├─ infra/
│  ├─ prisma/
│  └─ docker-compose.yml
├─ .github/
│  └─ workflows/
├─ docs/
│  ├─ 00_Overview_v2.md
│  ├─ 01_要件定義_FR-NFR_フェーズ計画.md
│  ├─ 02_データモデル_API仕様.md
│  ├─ 03_UI-UX_画面仕様_編集UI.md
│  ├─ 04_アーキテクチャ_開発運用.md
│  ├─ 05_ToC_仕様.md
│  ├─ 06_ClaudeCode_タスク指示テンプレ.md
│  ├─ 07_P1_MVP_Work_Plan_VS.md
│  ├─ decisions/
│  └─ diagrams/
├─ CLAUDE.md
├─ package.json
├─ .npmrc
├─ .env.example
└─ README.md
```

---

## 📦 ルート: `package.json`
```json
{
  "name": "book-journal",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "typecheck": "npm -ws run typecheck --if-present",
    "lint": "npm -ws run lint --if-present",
    "build": "npm -ws run build --if-present",
    "dev:web": "npm --workspace apps/web run dev",
    "dev:mobile": "npm --workspace apps/mobile run start",
    "dev:api": "npm --workspace apps/api run start:dev",
    "e2e": "npm --workspace apps/web run e2e --if-present"
  }
}
```

### ルート: `.npmrc`
```ini
fund=false
audit=false
```

### ルート: `.env.example`
```env
# 共通
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
SUPABASE_URL=
SUPABASE_ANON_KEY=

# API
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookjournal
JWT_SECRET=change_me
```

### ルート: `README.md`
```md
# book-journal (npm workspaces)

## 開発サクッと手順
1) npm i
2) 別ターミナル3つなどで:
   - API:   npm run dev:api
   - Web:   npm run dev:web
   - Mobile:npm run dev:mobile

## 参照ドキュメント
- docs/00_Overview_v2.md からどうぞ
```

---

## 🧪 GitHub Actions: `.github/workflows/ci.yml`
```yaml
name: CI
on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
```

---

## 🗄️ Prisma: `infra/prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// MVPの最小雛形（詳細は docs/02 を参照して拡張）
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  displayName String?
  createdAt   DateTime @default(now())
}
```

> 実テーブルは `docs/02_データモデル_API仕様.md` に従って拡張してください。

---

## 🌐 Web (Next.js): `apps/web`
**`apps/web/package.json`**
```json
{
  "name": "@bj/web",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev -p 5173",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "next": "^14.2.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.11.30",
    "@types/react": "^18.2.66",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.4",
    "typescript": "^5.4.0"
  }
}
```

**`apps/web/tsconfig.json`**
```json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "jsx": "react-jsx" }, "include": ["src"] }
```

**`apps/web/src/app/page.tsx`**
```tsx
export default function Page() {
  return <main style={{padding:24}}>Hello book-journal (Web)</main>;
}
```

**`apps/web/next.config.mjs`**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

---

## 📱 Mobile (Expo): `apps/mobile`
**`apps/mobile/package.json`**
```json
{
  "name": "@bj/mobile",
  "private": true,
  "version": "0.0.0",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "typecheck": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "react": "^18.3.1",
    "react-native": "0.74.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

**`apps/mobile/app.json`**
```json
{ "expo": { "name": "book-journal", "slug": "book-journal", "scheme": "bookjournal" } }
```

**`apps/mobile/App.tsx`**
```tsx
import { Text, View } from 'react-native';
export default function App(){
  return <View style={{padding:24}}><Text>Hello book-journal (Mobile)</Text></View>;
}
```

---

## 🧩 API (NestJS): `apps/api`
**`apps/api/package.json`**
```json
{
  "name": "@bj/api",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "start": "node dist/main.js",
    "start:dev": "ts-node -r tsconfig-paths/register src/main.ts",
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.4.0"
  }
}
```

**`apps/api/tsconfig.json`**
```json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "outDir": "dist" }, "include": ["src"] }
```

**`apps/api/src/main.ts`**
```ts
import 'reflect-metadata';
import { createServer } from 'http';

const server = createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, service: 'api' }));
});

server.listen(3000, () => console.log('API listening on http://localhost:3000'));
```

> ※ 本来は NestFactory を使いますが、雛形なので最小HTTPサーバで起動確認できる形にしています。Nest への置き換えは T-001/T-004 の実装で。

---

## 📦 パッケージ群: `packages/*`
**`packages/core/package.json`**
```json
{ "name": "@bj/core", "private": true, "version": "0.0.0", "main": "dist/index.js", "types": "dist/index.d.ts", "scripts": { "build": "tsc -p tsconfig.json", "typecheck": "tsc -p tsconfig.json" }, "devDependencies": { "typescript": "^5.4.0" } }
```

**`packages/core/tsconfig.json`**
```json
{ "extends": "../../tsconfig.base.json", "include": ["src"] }
```

**`packages/core/src/index.ts`**
```ts
export const ping = () => 'pong';
```

**`packages/ui/package.json`**
```json
{ "name": "@bj/ui", "private": true, "version": "0.0.0", "main": "dist/index.js", "types": "dist/index.d.ts", "peerDependencies": { "react": ">=18" }, "scripts": { "build": "tsc -p tsconfig.json", "typecheck": "tsc -p tsconfig.json" }, "devDependencies": { "typescript": "^5.4.0" } }
```

**`packages/ui/tsconfig.json`**
```json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "jsx": "react-jsx" }, "include": ["src"] }
```

**`packages/ui/src/index.tsx`**
```tsx
export const Hello = () => null;
```

**`packages/analytics/package.json`**
```json
{ "name": "@bj/analytics", "private": true, "version": "0.0.0", "main": "dist/index.js", "types": "dist/index.d.ts", "scripts": { "build": "tsc -p tsconfig.json", "typecheck": "tsc -p tsconfig.json" }, "devDependencies": { "typescript": "^5.4.0" } }
```

**`packages/analytics/tsconfig.json`**
```json
{ "extends": "../../tsconfig.base.json", "include": ["src"] }
```

**`packages/analytics/src/index.ts`**
```ts
export type Event = { name: string; props?: Record<string, unknown> };
export const track = (e: Event) => { if (process.env.NODE_ENV !== 'test') console.log('track', e); };
```

---

## 🧰 共有: ルート `tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

---

## 📄 ルート: `CLAUDE.md`（初版・npm対応）
```md
# CLAUDE.md — Implementation Playbook (npm workspaces)

## 1) 必読ドキュメント
- P1の作業順序: `docs/07_P1_MVP_Work_Plan_VS.md`
- 仕様の参照順: 01 → 03 → 02 → 04 → 05 → 06

## 2) 作業の進め方（VS単位）
- 1PR = 1 Vertical Slice（VS0〜VS7）
- PRに最低1つのテストと受け入れ基準の確認を含める
- フィーチャーフラグ: `TOC_FEATURE_FLAG` などを使用

## 3) 開発環境（npm）
```bash
# 依存の取得（全ワークスペース）
npm i

# API (dev)
npm run dev:api

# Web (dev)
npm run dev:web

# Mobile (dev)
npm run dev:mobile

# 型/静的解析/ビルド
npm run typecheck
npm run lint
npm run build
```

## 4) 規約
- TypeScript strict、ESLint/Prettier（導入は後続PRで）
- APIエラーは `docs/02` の共通フォーマット
- 計測は `packages/analytics` を利用

## 5) セキュリティ・プライバシー
- RLS方針（`userId = auth.uid()`）から外れない
- **ToCのOCR画像は保存しない**（テキストのみ）
- 秘密情報は `.env` を使用

## 6) PR要件
- 参照仕様の章番号をPRに明記
- 受け入れ基準（Gherkin）の達成状況を記載
- UI変更はスクショ/動画

## 7) 提案
- 仕様の改善は `docs/decisions/` に ADR を起票しPRに添付
```

---

## ✅ 次のアクション
1. リポジトリにこれらのファイル/内容を配置
2. `npm i` → `npm run dev:api` / `npm run dev:web` / `npm run dev:mobile` で起動確認
3. 以降は `docs/06_ClaudeCode_タスク指示テンプレ.md` と `docs/07_P1_MVP_Work_Plan_VS.md` に沿ってPRを刻む

