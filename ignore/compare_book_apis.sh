#!/usr/bin/env bash
#
# compare_book_apis.sh
# 指定した ISBN で各APIを一括叩き、返り値の比較サマリを表示＆生レスポンスを保存
#
# 使い方:
#   bash compare_book_apis.sh 9784101010014
#   RAKUTEN_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxx bash compare_book_apis.sh 9784101010014
#
# オプション:
#   環境変数 RAKUTEN_APP_ID があれば楽天ブックスAPIも叩きます
#
set -euo pipefail

ISBN_RAW="${1:-}"
if [[ -z "${ISBN_RAW}" ]]; then
  echo "使い方: $0 <ISBN-10/13 or hyphenated>"
  exit 1
fi

# 依存コマンド確認
need_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "エラー: '$1' が必要です"; exit 1; }; }
need_cmd curl
need_cmd jq
XML_OK=0
if command -v xmllint >/dev/null 2>&1; then XML_OK=1; fi

# ISBN 正規化（ハイフン除去）
ISBN="$(echo "$ISBN_RAW" | tr -d '-')"

OUTDIR="out_${ISBN}_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTDIR"

hr() { printf '%*s\n' "${COLUMNS:-100}" '' | tr ' ' '-'; }

# -------- Google Books --------
echo "▶ Google Books API を問い合わせ中..."
GB_URL="https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}"
curl -sS "$GB_URL" > "${OUTDIR}/google.json" || true

# 1件目volumeInfoを抽出
GB_HIT=$(jq -r '.totalItems // 0' "${OUTDIR}/google.json")
GB_TITLE=$(jq -r '.items[0].volumeInfo.title // empty' "${OUTDIR}/google.json")
GB_AUTHORS=$(jq -r '[.items[0].volumeInfo.authors // []] | flatten | join(", ")' "${OUTDIR}/google.json")
GB_PUBLISHER=$(jq -r '.items[0].volumeInfo.publisher // empty' "${OUTDIR}/google.json")
GB_DATE=$(jq -r '.items[0].volumeInfo.publishedDate // empty' "${OUTDIR}/google.json")
GB_PAGES=$(jq -r '.items[0].volumeInfo.pageCount // empty' "${OUTDIR}/google.json")
GB_TOC_COUNT="-"   # Googleは目次がほぼ無い
GB_COVER=$(jq -r '.items[0].volumeInfo.imageLinks.thumbnail // empty' "${OUTDIR}/google.json")

# -------- Open Library --------
echo "▶ Open Library API を問い合わせ中..."
OL_URL="https://openlibrary.org/api/books?bibkeys=ISBN:${ISBN}&format=json&jscmd=data"
curl -sS "$OL_URL" > "${OUTDIR}/openlibrary.json" || true

OL_KEY="ISBN:${ISBN}"
OL_HAS=$(jq -r --arg k "$OL_KEY" 'has($k)' "${OUTDIR}/openlibrary.json")
if [[ "$OL_HAS" == "true" ]]; then
  OL_TITLE=$(jq -r --arg k "$OL_KEY" '.[$k].title // empty' "${OUTDIR}/openlibrary.json")
  OL_AUTHORS=$(jq -r --arg k "$OL_KEY" '[.[$k].authors[]?.name] | join(", ")' "${OUTDIR}/openlibrary.json")
  OL_PUBLISHER=$(jq -r --arg k "$OL_KEY" '[.[$k].publishers[]?.name] | join(", ")' "${OUTDIR}/openlibrary.json")
  OL_DATE=$(jq -r --arg k "$OL_KEY" '.[$k].publish_date // empty' "${OUTDIR}/openlibrary.json")
  OL_PAGES=$(jq -r --arg k "$OL_KEY" '.[$k].number_of_pages // empty' "${OUTDIR}/openlibrary.json")
  OL_TOC_COUNT=$(jq -r --arg k "$OL_KEY" '.[$k].table_of_contents | if type=="array" then length else 0 end' "${OUTDIR}/openlibrary.json")
  OL_COVER=$(jq -r --arg k "$OL_KEY" '.[$k].cover.large // .[$k].cover.medium // .[$k].cover.small // empty' "${OUTDIR}/openlibrary.json")
else
  OL_TITLE=""; OL_AUTHORS=""; OL_PUBLISHER=""; OL_DATE=""; OL_PAGES=""; OL_TOC_COUNT="-"; OL_COVER="";
fi

# -------- 楽天ブックス --------
RK_TITLE=""; RK_AUTHORS=""; RK_PUBLISHER=""; RK_DATE=""; RK_PAGES=""; RK_TOC_COUNT="-"; RK_COVER="";
if [[ -n "${RAKUTEN_APP_ID:-}" ]]; then
  echo "▶ 楽天ブックスAPI を問い合わせ中..."
  RK_URL="https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=${RAKUTEN_APP_ID}&isbn=${ISBN}&formatVersion=2"
  curl -sS "$RK_URL" > "${OUTDIR}/rakuten.json" || true
  # 先頭アイテム
  RK_ITEM_EXISTS=$(jq -r '.Items | (type=="array" and length>0)' "${OUTDIR}/rakuten.json")
  if [[ "$RK_ITEM_EXISTS" == "true" ]]; then
    RK_TITLE=$(jq -r '.Items[0].title // empty' "${OUTDIR}/rakuten.json")
    RK_AUTHORS=$(jq -r '.Items[0].author // empty' "${OUTDIR}/rakuten.json")
    RK_PUBLISHER=$(jq -r '.Items[0].publisherName // empty' "${OUTDIR}/rakuten.json")
    RK_DATE=$(jq -r '.Items[0].salesDate // empty' "${OUTDIR}/rakuten.json")
    RK_PAGES=$(jq -r '.Items[0].size // empty' "${OUTDIR}/rakuten.json") # ページ数が無い場合あり
    RK_COVER=$(jq -r '.Items[0].largeImageUrl // .Items[0].mediumImageUrl // .Items[0].smallImageUrl // empty' "${OUTDIR}/rakuten.json")
  fi
else
  echo "※ 楽天ブックスAPIは RAKUTEN_APP_ID が未設定のためスキップします（環境変数で設定してください）"
fi

# -------- NDLサーチ --------
echo "▶ NDLサーチAPI（OpenSearch XML）を問い合わせ中..."
NDL_URL="https://ndlsearch.ndl.go.jp/api/opensearch?isbn=${ISBN}"
curl -sS "$NDL_URL" > "${OUTDIR}/ndl.xml" || true
# 書影（あれば）
curl -sS "https://ndlsearch.ndl.go.jp/thumbnail/${ISBN}.jpg" -o "${OUTDIR}/ndl_cover.jpg" || true
NDL_COVER_SIZE=$(stat -c%s "${OUTDIR}/ndl_cover.jpg" 2>/dev/null || stat -f%z "${OUTDIR}/ndl_cover.jpg" 2>/dev/null || echo 0)
NDL_COVER_HIT=""; [[ "${NDL_COVER_SIZE}" -gt 0 ]] && NDL_COVER_HIT="yes" || NDL_COVER_HIT="no"

NDL_TITLE=""; NDL_AUTHORS=""; NDL_PUBLISHER=""; NDL_DATE="";
if [[ "$XML_OK" -eq 1 ]]; then
  # NDLはOpenSearch/Atom系 + Dublin Core 名前空間を含む場合がある
  # item/title, item/dc:creator, item/dc:publisher, item/dc:date を優先的に取得
  NDL_TITLE=$(xmllint --xpath 'string(//item/title[1])' "${OUTDIR}/ndl.xml" 2>/dev/null || true)
  NDL_AUTHORS=$(xmllint --xpath 'string(//item/dc:creator[1])' "${OUTDIR}/ndl.xml" 2>/dev/null || true)
  NDL_PUBLISHER=$(xmllint --xpath 'string(//item/dc:publisher[1])' "${OUTDIR}/ndl.xml" 2>/dev/null || true)
  NDL_DATE=$(xmllint --xpath 'string(//item/dc:date[1])' "${OUTDIR}/ndl.xml" 2>/dev/null || true)
fi

# -------- サマリー表示 --------
hr
printf "ISBN: %s\n" "$ISBN"
echo "保存ディレクトリ: ${OUTDIR}"
hr
printf "%-12s | %-40s | %-22s | %-18s | %-12s | %-7s | %-5s | %-5s\n" "Source" "Title" "Authors" "Publisher" "Published" "Pages" "TOC" "Cover"
hr

safe_trim() { echo "$1" | tr '\n' ' ' | sed -e 's/[[:space:]]\+/ /g' -e 's/^ *//' -e 's/ *$//' ; }

# Google
printf "%-12s | %-40s | %-22s | %-18s | %-12s | %-7s | %-5s | %-5s\n" \
  "Google" \
  "$(safe_trim "${GB_TITLE:0:40}")" \
  "$(safe_trim "${GB_AUTHORS:0:22}")" \
  "$(safe_trim "${GB_PUBLISHER:0:18}")" \
  "$(safe_trim "${GB_DATE:0:12}")" \
  "$(safe_trim "${GB_PAGES:0:7}")" \
  "${GB_TOC_COUNT}" \
  "$([[ -n "$GB_COVER" ]] && echo yes || echo no)"

# Open Library
printf "%-12s | %-40s | %-22s | %-18s | %-12s | %-7s | %-5s | %-5s\n" \
  "OpenLibrary" \
  "$(safe_trim "${OL_TITLE:0:40}")" \
  "$(safe_trim "${OL_AUTHORS:0:22}")" \
  "$(safe_trim "${OL_PUBLISHER:0:18}")" \
  "$(safe_trim "${OL_DATE:0:12}")" \
  "$(safe_trim "${OL_PAGES:0:7}")" \
  "${OL_TOC_COUNT}" \
  "$([[ -n "$OL_COVER" ]] && echo yes || echo no)"

# Rakuten
if [[ -n "${RAKUTEN_APP_ID:-}" ]]; then
  printf "%-12s | %-40s | %-22s | %-18s | %-12s | %-7s | %-5s | %-5s\n" \
    "Rakuten" \
    "$(safe_trim "${RK_TITLE:0:40}")" \
    "$(safe_trim "${RK_AUTHORS:0:22}")" \
    "$(safe_trim "${RK_PUBLISHER:0:18}")" \
    "$(safe_trim "${RK_DATE:0:12}")" \
    "$(safe_trim "${RK_PAGES:0:7}")" \
    "${RK_TOC_COUNT}" \
    "$([[ -n "$RK_COVER" ]] && echo yes || echo no)"
fi

# NDL
printf "%-12s | %-40s | %-22s | %-18s | %-12s | %-7s | %-5s | %-5s\n" \
  "NDL" \
  "$(safe_trim "${NDL_TITLE:0:40}")" \
  "$(safe_trim "${NDL_AUTHORS:0:22}")" \
  "$(safe_trim "${NDL_PUBLISHER:0:18}")" \
  "$(safe_trim "${NDL_DATE:0:12}")" \
  "-" \
  "-" \
  "${NDL_COVER_HIT}"

hr
echo "📦 生レスポンス保存:"
echo "  - ${OUTDIR}/google.json"
echo "  - ${OUTDIR}/openlibrary.json"
[[ -n "${RAKUTEN_APP_ID:-}" ]] && echo "  - ${OUTDIR}/rakuten.json"
echo "  - ${OUTDIR}/ndl.xml"
echo "  - ${OUTDIR}/ndl_cover.jpg  (存在すれば書影)"
hr

# 便利: JSONの要約も保存
SUMMARY_JSON="${OUTDIR}/summary.json"
jq -n \
  --arg isbn "$ISBN" \
  --arg gb_title "$GB_TITLE" --arg gb_auth "$GB_AUTHORS" --arg gb_pub "$GB_PUBLISHER" --arg gb_date "$GB_DATE" --arg gb_pages "$GB_PAGES" --arg gb_cover "$GB_COVER" \
  --arg ol_title "$OL_TITLE" --arg ol_auth "$OL_AUTHORS" --arg ol_pub "$OL_PUBLISHER" --arg ol_date "$OL_DATE" --arg ol_pages "$OL_PAGES" --argjson ol_toc ${OL_TOC_COUNT//-/0} --arg ol_cover "$OL_COVER" \
  --arg rk_title "$RK_TITLE" --arg rk_auth "$RK_AUTHORS" --arg rk_pub "$RK_PUBLISHER" --arg rk_date "$RK_DATE" --arg rk_pages "$RK_PAGES" --arg rk_cover "$RK_COVER" \
  --arg ndl_title "$NDL_TITLE" --arg ndl_auth "$NDL_AUTHORS" --arg ndl_pub "$NDL_PUBLISHER" --arg ndl_date "$NDL_DATE" --arg ndl_cover_hit "$NDL_COVER_HIT" \
  '{
    isbn: $isbn,
    google: {title:$gb_title, authors:$gb_auth, publisher:$gb_pub, published:$gb_date, pages:$gb_pages, cover:$gb_cover},
    openlibrary: {title:$ol_title, authors:$ol_auth, publisher:$ol_pub, published:$ol_date, pages:$ol_pages, toc_count:$ol_toc, cover:$ol_cover},
    rakuten: {title:$rk_title, authors:$rk_auth, publisher:$rk_pub, published:$rk_date, pages:$rk_pages, cover:$rk_cover},
    ndl: {title:$ndl_title, authors:$ndl_auth, publisher:$ndl_pub, published:$ndl_date, cover_exists:$ndl_cover_hit}
  }' > "$SUMMARY_JSON"

echo "🧾 要約JSON: ${SUMMARY_JSON}"
