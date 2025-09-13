# 07_P1_MVP_Work_Plan（Vertical Slices & Tasks）
最終更新: 2025-08-31 (JST)

## 0. P1 スコープ再確認（2週間・MVPコア）
- 認証（同一アカウントでモバイル/タブレット/Web）
- 階層：分類（1層）→ 本棚（1層）→ 本
- ネット検索 + 追加（タイトル/著者/ISBN、重複検知）
- ビュー切替（サムネ/テキスト）※ユーザー設定に同期
- 本へのコメント・評価（★）・タグ
- 進捗％（読了章/総章 または ページベースのどちらか）
- ToC 手動入力 → プレビュー → 一括保存（OCRはP2）

> 注: 章への評価/タグ、棚の入れ子、詳細集計は **P2 以降**。

---

## 1. 垂直スライス（Vertical Slices）
> 1スライス=「ユーザーが目に見える価値」+ FE/BE/DB/テストを **完結** させる単位。

| Slice | ゴール | BE/DB | FE | テスト | 受け入れ基準（サマリ） |
|---|---|---|---|---|---|
| **VS0** | 雛形+認証土台 | Monorepo/CI、Prisma init、Supabase Auth連携、RLS雛形 | Login/Logout画面、セッション保持 | API e2e: /health、Authフロー | 3端末で同一アカウントにログイン/ログアウトが可能 |
| **VS1** | 分類/棚の最小CRUD | tables: **Category, Shelf**（`userId`付）、CRUD API（/categories,/shelves） | Libraryテキストビューに分類→棚リスト、作成/編集/削除 | e2e: 作成→表示→編集→削除 | 分類/棚の作成・並べ替え・削除がUIで完了 |
| **VS2** | 書籍検索→追加 | BookProvider（Google/OpenLibrary）、/books/search、/library-items | 検索UI（タイトル/著者/ISBN）、一覧→追加、重複警告 | ユニット: 正規化、e2e: 検索→追加 | 2タップ以内で本を追加、重複は警告表示 |
| **VS3** | ビュー切替と同期 | user_settings テーブル or JSONB、/settings | サムネ↔テキスト切替、設定保持（端末間同期） | e2e: 切替→再ログイン後も反映 | 端末を跨いでも同じ表示設定 |
| **VS4** | Book Detail & コメント/評価/タグ | /library-items/:id、/comments、/tags、Tag付与API | Book Detail（概要/セッション/目次タブの枠）コメント・★評価・タグ付与 | ユニット: バリデーション、e2e: 付与→再表示 | 本へのコメント/★/タグが保存・再表示される |
| **VS5** | ToC 手動→プレビュー→保存 | /library-items/:id/toc/preview、/toc Upsert、`TocItem` | ToCタブ：テキスト貼付→プレビュー→編集（インデント/並べ替え）→保存 | ユニット: 解析ルール、e2e: プレビュー→保存 | プレビュー精度“概ね”良好、編集可能、保存反映 |
| **VS6** | 進捗％（簡易） | 集計API `/stats/book/:id`（章 or ページ比で1方式に限定） | Bookカード/Detailに進捗％表示、Libraryにもバッジ | ユニット: 集計ロジック、e2e: 目次変更で％更新 | 進捗%が一貫して更新・表示 |
| **VS7** | 観測性/品質 | イベント計測（最低限）、エラーハンドリング、CIゲート | トースト/ローディング/再試行UI、空状態UI | smoke: 重要経路の自動化 | 主要イベントが計測され、失敗時のUXが破綻しない |

---

## 2. タスク分解（各VSのチェックリスト）

### VS0 雛形+認証土台
- [ ] T-001 モノレポ初期化（apps: mobile/web/api、packages: core/ui/analytics）
- [ ] Supabase Auth（Email Link/OAuth）の設定&SDK実装
- [ ] API: /auth/me, /health、RLS雛形
- [ ] FE: Login/Logout、セッション保持、保護ルート
- [ ] CI: lint/test/build、PR必須チェック

### VS1 分類/棚 CRUD
- [ ] Prisma: Category(id,userId,name,order) / Shelf(id,userId,categoryId,name,order)
- [ ] API: GET/POST/PATCH/DELETE /categories, /shelves（RLS）
- [ ] FE: テキストビューのツリー表示、作成/編集/削除/並べ替え
- [ ] e2e: 作成→表示→編集→削除→並べ替え

### VS2 書籍検索→追加
- [ ] T-003 BookProvider抽象 + Google/OpenLibrary実装
- [ ] API: GET /books/search、POST /library-items
- [ ] FE: 検索UI、結果リスト、追加、重複検知
- [ ] テスト: 正規化（ISBN/著者配列）、フォールバック時の挙動

### VS3 ビュー切替と同期
- [ ] DB/設定: user_settings（`viewMode: 'thumb'|'text'`）
- [ ] API: GET/PUT /settings
- [ ] FE: トグルUI、初回読み・更新保存、再ログイン反映

### VS4 Book Detail & コメント/評価/タグ
- [ ] DB: comment/rating/tag schema（本単位）
- [ ] API: /comments, /tags, /library-items/:id/tags
- [ ] FE: Book Detail（概要タブ）にコメント・★・タグUI
- [ ] 検索/フィルタ: タグで絞り込み（最低限）

### VS5 ToC 手動→プレビュー→保存
- [ ] T-009 解析ルール（番号/インデント/末尾ページ）
- [ ] API: /toc/preview（保存なし）、/toc（一括Upsert）、/toc-items/:id PATCH/DELETE
- [ ] FE: 目次タブ、貼付→プレビュー→編集（上下/インデント/タイトル/ページ）→保存
- [ ] テスト: サンプルテキストで80%目安の抽出精度、編集UI操作

### VS6 進捗％（簡易）
- [ ] ロジック: 章ベース or ページベースの**どちらかに固定**（実装負荷を抑制）
- [ ] API: /stats/book/:id（%返却）
- [ ] FE: カード/Detail/Libraryにバッジ表示

### VS7 観測性/品質
- [ ] 計測: `book_add`, `toc_save`, `view_toggle` など最小イベント
- [ ] エラートラッキング導入（Sentry等は任意、最低限ログ）
- [ ] ローディング/エラー/空状態のUI整備
- [ ] Smoke: Playwright シナリオ（検索→追加→コメント→ToC保存→進捗表示）

---

## 3. 並行度とクリティカルパス
- **CP**: VS0 → VS2 → VS4/VS5 → VS6（VS1, VS3, VS7は並行可能）
- 並行チーム例:
  - BE: VS2(API) → VS5(API) → VS6
  - FE-Web: VS3 → VS4 → VS6
  - FE-Mobile: VS0(Auth画面) → VS2(検索UI) → VS5(ToC UI)

---

## 4. 切り取り線（Cut Lines）
- 時間が逼迫した場合：
  1) VS4の**タグ**をオプション化（コメント+★優先）
  2) VS6を**ページベース**に固定（章依存を外す）
  3) VS3の**ユーザー設定同期**をローカル優先に一時ダウンスコープ（後で同期）

---

## 5. DoD & 受け入れ基準（詳細）
- **DoD**: 型/ESLint/Prettierゼロ、API e2eグリーン、Smoke通過、主要イベント計測が可視
- **Gherkin（例: 検索→追加）**
```gherkin
Feature: Add a book from search
  Scenario: Add by ISBN
    Given I am logged in
    When I search by ISBN "9784123456789"
    And I tap the first result to add
    Then the book appears in my library
    And duplicate additions are prevented
```
- **Gherkin（例: ToC手動→保存）**
```gherkin
Feature: Create ToC manually
  Scenario: Paste and save
    Given a library item exists
    When I paste ToC text and request preview
    And I indent two lines and edit one title
    And I save the ToC
    Then the ToC items are persisted
    And progress percentage updates accordingly
```

---

## 6. 見積り感（相対値）
- VS0: 3pt / VS1: 3pt / VS2: 5pt / VS3: 2pt / VS4: 5pt / VS5: 8pt / VS6: 3pt / VS7: 2pt  
> 合計: **31pt**（1pt≈半日目安）。**タグの先送り**や**進捗%の方式固定**で 4–6pt 圧縮可。

---

## 7. リスクと対策
- 書誌APIのレート制限 → 簡易キャッシュ/フォールバック、開発時はモック固定
- ToC抽出精度が低い → ルールで先行、P2でAI補助/OCRを追加
- 進捗%の定義ブレ → P1は**単一方式**に限定し、P2で切替を検討

---

## 8. Git/PRポリシー（P1）
- 1スライス=1〜2PR、PRには e2e/ユニットの最低1つを含む
- レビューSLA: 1営業日以内、CIグリーン必須
- フィーチャーフラグ: ToC/タグを flag で囲い、切り戻し容易に

---

## 9. 参照
- 01_要件定義（FR/NFR）＆フェーズ計画
- 02_データモデル＆API仕様
- 03_UI/UX設計（画面仕様・編集UI）
- 06_Claude Code向けタスク指示テンプレ（T-001〜T-012）

