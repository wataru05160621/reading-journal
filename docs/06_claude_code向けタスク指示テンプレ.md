# 06_Claude Code向けタスク指示テンプレ
最終更新: 2025-08-31 (JST)

## 使い方
- 下記テンプレをそのまま貼り、必要箇所を追記して発注。

### T-001: モノレポ初期化
```
あなたは熟練のフルスタックエンジニアです。以下の要件でモノレポ雛形を作成し、READMEを整えてください。
[要件]
- Yarn workspaces + TypeScript
- apps/mobile: Expo, apps/web: Next.js, apps/api: NestJS
- packages/core, packages/ui, packages/analytics
- ESLint/Prettier/TSConfig/commitlint/husky
- GitHub Actions: lint/test/build
[成果物]
- 生成コマンド/手順のスクリプト化
- README: セットアップ/起動方法
```

### T-002: Prisma スキーマ & マイグレーション
```
以下のERをPrisma schemaに実装し、初回マイグレーションを作成。
- User, Book, LibraryItem, Tag, LibraryItemTag, ReadingSession, TocItem
[要件] Supabase(Postgres)/外部キー/インデックス/seed
```

### T-003: 書籍検索アダプタ
```
`BookProvider` 抽象、GoogleBooks/OpenLibrary 実装、NestJSに /books/search を追加。
[要件] 正規化DTO/フォールバック/メモリキャッシュ/単体テスト
```

### T-004: Library/Session API CRUD
```
/library-items, /reading-sessions, /tags を NestJS+Prisma で実装。RLS相当の userId ガード。
```

### T-005: Expo 画面雛形 & タイマー
```
Home/Library/BookDetail/Timer の4画面。Zustand + React Query。オフライン時はキュー。
```

### T-006: Web(Next.js) Library/Stats
```
Webで Library/BookDetail/Stats。SDKは packages/core を使用。PlaywrightでSmoke。
```

### T-007: CSV エクスポート
```
/exports/csv を実装（ストリーム化）。Web/RNのダウンロード/共有連携も用意。
```

### T-008: 計測ラッパ
```
イベント型定義と実装（PostHog/Amplitude切替）。主要フローに埋め込み。
```

### T-009: ToC 解析ルール
```
正規表現/ルールで章/節の抽出。ユニットテストを用意。
```

### T-010: ToC API
```
/toc/preview（保存なし）と /toc（Upsert）、/toc-items/:id PATCH/DELETE。RLSガードとe2e。
```

### T-011: ToC UI
```
「目次」タブの編集UI（インデント/並べ替え/タイトル・ページ編集）。キーボード操作対応。
```

### T-012: OCR 入力（P2）
```
端末内OCR（RN: vision-camera-text-recognition等）。テキストのみサーバ送信。信頼度表示。
```

