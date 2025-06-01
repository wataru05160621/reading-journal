以下、ご要望・決定事項を反映したドキュメント案です。

1. プロジェクト概要
アプリ名（仮）：読書記録アプリ
対象プラットフォーム：iOS / Android（React Native）
目的：本の目次ごとにコメントを残し、振り返りができる個人向け読書管理アプリ
MVPフェーズ：
認証・ログイン
本棚一覧（表紙サムネイル）
目次の多階層ツリー表示（最大 5 階層）＋テキストコメント

2. 要件定義
2.1 認証・ログイン
方式
Email ＋ パスワード
パスワードリセット機能
メール認証（Email Verification）
SNSログイン：Google, Apple
認証基盤
推奨：Supabase Auth（メール・OAuth 両対応、無料枠あり）
代替案：Firebase Auth
2.2 本棚表示
ユーザーごとに登録した本一覧を取得
表示：表紙画像（サムネイル）
2.3 目次ツリー管理
多階層ツリー（最大 5 階層）
トグルで開閉
各ノードにテキストコメントを紐付け
2.4 コメント機能
目次項目ごとに テキストのみ のコメント追加／編集
長押しで簡易プレビュー表示
2.5 本の登録
ISBN 手入力 or Web 検索
API連携例：
Amazon Product Advertising API
OpenBD API（無料で利用可）
今後検討：AI 自動取得（OpenAI API など）
2.6 お気に入り登録
本棚一覧で ★ マークを設定
2.7 タグ／ジャンル管理
本にタグを多対多で付与
タグごとに本棚をフィルタリング
2.8 非機能要件
パフォーマンス：200 冊規模でも快適表示
セキュリティ：JWT＋HTTPS
運用監視：Sentry（エラー追跡）、Analytics

3. 技術構成
層	技術スタック
フロントエンド	React Native（TypeScript）
UI: React Native Paper 等
バックエンド	NestJS（TypeScript）
DB ＋ 認証	Supabase
– PostgreSQL
– Auth（Email/Password, OAuth Google & Apple, パスワードリセット, メール認証）
代替 DB／認証	Firebase（Firestore + Firebase Auth）
外部連携	Amazon PA-API v5, OpenBD API, OpenAI API
CI/CD	GitHub Actions → Expo Publish / Vercel
テスト	フロント: Jest + React Native Testing Library
バック: Jest + Supertest

4. 画面設計
画面名	概要	主な要素・操作
ログイン画面	Email/Password ＋ SNS（Google, Apple）	E-mail, Password, ログイン, パスワードリセット, SNSログイン
本棚一覧画面	本のサムネ一覧＋タグ／お気に入り絞り込み	FlatList（表紙）, タグドロップダウン, 検索バー, ★アイコン
本登録画面	ISBN or 検索結果から本を追加	ISBN入力欄, 検索ボタン, 検索結果リスト, 追加ボタン
目次ツリー画面	最大5階層のツリー表示＋ノード長押しでコメントプレビュー	折りたたみ可能なツリー, ノード長押しポップアップ
コメント編集ダイアログ	テキストコメント追加／編集	TextInput, 保存／キャンセル
タグ管理画面	タグ一覧＋新規タグ追加	タグリスト, 追加フォーム
設定画面	アカウント設定、ログアウト	プロフィール編集, パスワード変更, メール認証再送, ログアウト

5. 基本設計
5.1 DB設計（Supabase PostgreSQL例）
sql
コピーする
編集する
-- users
id           UUID   PK
email        TEXT   UNIQUE
password_hash TEXT
is_verified  BOOLEAN
created_at   TIMESTAMP

-- books
id           UUID   PK
user_id      UUID   FK → users.id
isbn         TEXT
title        TEXT
cover_url    TEXT
favorite     BOOLEAN
created_at   TIMESTAMP

-- toc_items
id           UUID   PK
book_id      UUID   FK → books.id
parent_id    UUID   FK → toc_items.id  -- null可
title        TEXT
sort_order   INT

-- comments
id           UUID   PK
toc_item_id  UUID   FK → toc_items.id
user_id      UUID   FK → users.id
content      TEXT
created_at   TIMESTAMP

-- tags
id           UUID   PK
user_id      UUID   FK → users.id
name         TEXT

-- book_tags
book_id      UUID   FK → books.id
tag_id       UUID   FK → tags.id
PRIMARY KEY (book_id, tag_id)

5.2 API設計（REST + JWTヘッダ方式）
方法	パス	説明
POST	/auth/signup	サインアップ（メール認証送信）
POST	/auth/login	ログイン
POST	/auth/verify-email	メール認証リンク検証
POST	/auth/reset-password	パスワードリセットリクエスト
POST	/auth/reset-password/confirm	パスワード再設定
GET	/books	本棚取得
POST	/books	本登録
GET	/books/:id/toc	目次ツリー取得
POST	/books/:id/toc	目次項目追加
PUT	/toc/:tocItemId	目次項目編集
POST	/toc/:tocItemId/comment	コメント追加
GET	/tags	タグ一覧
POST	/tags	タグ追加
POST	/books/:id/favorite	お気に入り設定
GraphQL 採用メリット
クライアントが必要なフィールドだけ取得可能 → 過不足ないデータ転送
単一エンドポイントで複数リソースを一度にフェッチ
型定義＋自動ドキュメント生成
ただし、初期セットアップやキャッシュ設計に工数がかかるため、MVP は REST から開始がおすすめです。

6. 実装フェーズ
リポジトリ構成
Monorepo：/frontend（React Native）と/backend（NestJS）を同一リポジトリ
Lint/Prettier, Husky, CI（GitHub Actions）

フェーズ1：認証＋本棚表示
Supabase Auth 連携
GET /books → FlatList でサムネ表示

フェーズ2：目次ツリー＋コメント
toc_items テーブル実装
折りたたみ UI（React Native Collapsible 等）
コメントダイアログ

フェーズ3：本登録機能
OpenBD API 連携
書誌情報＋表紙取得 → DB 登録

フェーズ4：タグ／お気に入り
タグ CRUD
お気に入り API

フェーズ5：拡張
AI 自動目次取得
プッシュ通知（読書リマインダー）
オフライン対応
