# Browser Verification

## Purpose
- 実ブラウザでの UI 確認を、ホスト環境を汚さずに再現可能な手順で回す。
- 見た目確認と DOM 構造確認を分離せず、毎回セットで証跡を残す。

## Artifacts
- Playwright の成果物は `output/playwright/<label>/` 配下に保存する。
- `screenshot` は見た目確認用の PNG として扱う。
- `snapshot` は DOM 構造、表示テキスト、Playwright の要素参照 ID 確認用の YAML として扱う。
- UI 確認は `screenshot` 単体、または `snapshot` 単体で完了扱いにしない。

## Required Pairing
- 初期表示確認では、ページ読み込み直後に `snapshot` と `screenshot` を両方取る。
- ボタンクリック、入力、モーダル表示、ページ遷移などで状態が変わる確認では、変化後に `snapshot` と `screenshot` を両方取り直す。
- 状態変化の確認では、必要に応じて操作前と操作後の 2 組を残す。

## Playwright Container
- UI 確認は Playwright 専用コンテナを優先し、ホストにブラウザや Playwright 用依存を入れない。
- 起動:
```bash
docker compose -f docker-compose-dev.yml -f docker-compose.playwright.yml up -d --build
```
- シェルに入る:
```bash
docker compose -f docker-compose-dev.yml -f docker-compose.playwright.yml exec playwright bash
```
- コンテナ内では `http://proxy-nginx-dev` をアプリのベース URL として使う。

## Playwright CLI Workflow
- `open`
- `snapshot`
- `screenshot`
- 操作
- 必要なら待機
- `snapshot`
- `screenshot`

## Reporting
- ユーザーへ結果を返すときは、少なくとも最新の PNG と YAML の両方を示す。
- YAML は全文をそのまま説明しない。確認できた事実だけを要約する。
- 失敗時は、操作内容、見えていた UI 状態、関連するネットワークログまたはコンソールログを併記する。
