# 06_Codex_タスク指示テンプレ

> 使い方: このテンプレをCodex系アシスタントに貼り、必要なパラメータだけ追記して実行します。

## T-001: モノレポ初期化（npm）
あなたはnpm workspaces/TypeScriptに精通したシニアフルスタックです。以下を実施:
- ルート `package.json` に workspaces 設定 / scripts を追加
- `apps/{api,web,mobile}` と `packages/{core,ui,analytics}` の最小雛形を**完全ファイル**で出力
- 共有 `tsconfig.base.json` と `.env.example`、`.github/workflows/ci.yml`
- `README.md` に起動手順を記載
制約: 機密はダミー、ESM前提、`npm run dev:*` が動くこと。

## T-002: Prisma スキーマ & 初回マイグレーション
- `infra/prisma/schema.prisma` に `docs/02` のER（User/Book/LibraryItem/Tag/LibraryItemTag/ReadingSession/TocItem）を実装
- 推奨インデックスを付与
- `prisma migrate dev` を実行するためのスクリプトとREADMEを作成

## T-003: 書籍検索アダプタ
- `BookProvider` 抽象を設計し、Google/OpenLibrary 実装
- NestJS（apps/api）に `GET /books/search` を追加
- 正規化DTO/フォールバック/キャッシュ、ユニットテストを作成

## T-004: Library/Session API CRUD
- `/library-items`, `/reading-sessions`, `/tags` を NestJS+Prisma で実装
- RLS相当の `userId` スコープガード、共通エラー形式
- e2e テスト（supertest）

## T-005: Expo 画面雛形 & タイマー
- Home/Library/BookDetail/Timer を作成
- Zustand + React Query、オフライン時は再送キュー
- 型安全APIクライアント（packages/core）を利用

## T-006: Web(Next.js) Library/Stats
- Library/BookDetail/Stats ページ
- Playwright のSmokeテスト

## T-007: CSV エクスポート
- `/exports/csv` をストリームで実装
- Web/RNでのダウンロード/共有導線

## T-008: 計測ラッパ
- `packages/analytics` にイベント型定義/実装（PostHog/Amplitude切替）
- 主要フローに埋め込み

## T-009: ToC 解析ルール
- 正規表現/ルールで章/節/ページ抽出、ユニットテスト

## T-010: ToC API
- `/library-items/:id/toc/preview`（保存なし）、`/library-items/:id/toc`（Upsert）、`/toc-items/:id` CRUD
- RLSガード + e2e

## T-011: ToC UI
- 目次タブ: 貼付→プレビュー→編集（上下/インデント/タイトル/ページ）→保存
- キーボード操作支援、アクセシビリティ

## T-012: OCR 入力（P2）
- 端末内OCR（RN: vision-camera-text-recognition等）
- サーバ送信はテキストのみ、信頼度表示

### 送信フォーマット（Codex向け共通）
- まず **更新/新規ファイルのツリー** を列挙
- 続けて **各ファイルの完全内容** をコードブロックで提示
- 実行コマンド（npm）と検証結果を最後に記載
- 参照した `docs/xx` の章番号を列挙

