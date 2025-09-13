# 09_Codex_Playbook（CODEX.md初版＆タスクテンプレ）
最終更新: 2025-09-13 (JST)

このファイルは **Codex系エージェント**（例: OpenAI系コードアシスタントやCopilot Chat相当）に実装を依頼するための共通プレイブックです。`CLAUDE.md` と同等の役割を担い、**リポジトリ直下に `CODEX.md` として配置**します。加えて、Codex用の発注テンプレは `docs/06_Codex_タスク指示テンプレ.md` として配置します。

---

## CODEX.md（ルート配置用・初版）
> 下の内容をそのまま `CODEX.md` としてリポジトリ直下に保存してください。

```md
# CODEX.md — Implementation Playbook (npm workspaces)

## 1) 必読ドキュメント
- P1作業順序: `docs/07_P1_MVP_Work_Plan_VS.md`
- 仕様参照順: 01 → 03 → 02 → 04 → 05 → 06_Codex

## 2) 作業の原則（Codex向け）
- 1PR = 1 Vertical Slice（VS0〜VS7）。PRごとにテストを最低1つ含めること。
- 生成物は **ファイルパスと完全なファイル内容** を提示（部分差分のみは不可）。
- `.env` 値はモック/プレースホルダを使用。機密は直書きしない。
- 仕様に曖昧さがある場合は、`docs/decisions/` に ADR ドラフトを追加する提案を行う。

## 3) 開発環境（npm workspaces）
```bash
npm i
npm run dev:api   # http://localhost:3000 で起動（雛形）
npm run dev:web   # http://localhost:5173
npm run dev:mobile
npm run typecheck && npm run lint && npm run build
```

## 4) コーディング規約
- TypeScript strict。ESLint/PrettierはCIで検査。
- APIのエラー形式は `docs/02_データモデル_API仕様.md` を遵守。
- 計測イベントは `packages/analytics` を利用。

## 5) セキュリティ/プライバシー
- RLS方針（`userId = auth.uid()`）を前提とするDBアクセス設計。
- **ToCのOCR画像は保存しない**（テキストのみ保存）。
- 秘密情報は `.env`／シークレットに格納。

## 6) PR要件（テンプレ）
- 参照仕様の章番号（例: docs/05 §5）/ 対応VS（例: VS5）
- 受け入れ基準（Gherkin）に対する確認結果
- 変更ファイル一覧 + スクショ/動画（UI変更時）
- マイグレーションの有無と手順

## 7) 推奨プロンプトパターン（Codex）
- **役割宣言**: 「あなたはTypeScript/NestJS/Next.js/Expoに長けたシニアエンジニアです。」
- **制約**: 「npm workspaces前提。部分差分でなく**完全ファイル**を出力。秘密情報はプレースホルダ。」
- **根拠**: 「参照したドキュメントの章番号を巻末に列挙。」
- **検証**: 「`npm run typecheck` に通ること。」
```

---

## 06_Codex_タスク指示テンプレ（docs 配置用）
> 下の内容を `docs/06_Codex_タスク指示テンプレ.md` として保存してください。

```md
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
```

---

## 付録: 既存リポ構成への差分
- ルートに `CODEX.md` を追加
- `docs/06_ClaudeCode_...` は残しつつ、Codex用に `docs/06_Codex_...` を追加
- `00_Overview_v2.md` の文書マップに Codex 追記（別途更新）

