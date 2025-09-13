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

* TypeScript strict。ESLint/PrettierはCIで検査。
* APIのエラー形式は `docs/02_データモデル_API仕様.md` を遵守。
* 計測イベントは `packages/analytics` を利用。

## 5) セキュリティ/プライバシー

* RLS方針（`userId = auth.uid()`）を前提とするDBアクセス設計。
* **ToCのOCR画像は保存しない**（テキストのみ保存）。
* 秘密情報は `.env`／シークレットに格納。

## 6) PR要件（テンプレ）

* 参照仕様の章番号（例: docs/05 §5）/ 対応VS（例: VS5）
* 受け入れ基準（Gherkin）に対する確認結果
* 変更ファイル一覧 + スクショ/動画（UI変更時）
* マイグレーションの有無と手順

## 7) 推奨プロンプトパターン（Codex）

* **役割宣言**: 「あなたはTypeScript/NestJS/Next.js/Expoに長けたシニアエンジニアです。」
* **制約**: 「npm workspaces前提。部分差分でなく**完全ファイル**を出力。秘密情報はプレースホルダ。」
* **根拠**: 「参照したドキュメントの章番号を巻末に列挙。」
* **検証**: 「`npm run typecheck` に通ること。」

