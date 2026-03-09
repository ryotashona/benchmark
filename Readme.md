# 開発環境
- 起動方法
```markdown
docker-compose -f docker-compose-dev.yml up -d --build
```
上記コマンド実行後、ブラウザからlocalhostにアクセスするとreactの起動画面が表示されます。

起動直後に **502 Bad Gateway** が発生した際は、node_moduleインストール中です。
しばらくたってから再度アクセスしてください。front/react/react-app へ node.js がインストール中だと思います。

rustはサーバー起動(ビルド)に時間がかかります。ログを見て確認してください。

- Playwright コンテナで UI 確認する場合
```markdown
docker compose -f docker-compose-dev.yml -f docker-compose.playwright.yml up -d --build
docker compose -f docker-compose-dev.yml -f docker-compose.playwright.yml exec playwright bash
```
Playwright コンテナ内では、アプリ本体へ `http://proxy-nginx-dev` でアクセスできます。
必要に応じて `npx playwright test` や Playwright CLI をそのまま実行してください。
ブラウザ確認の運用ルールは [docs/browser-verification.md](/home/ytana/work/benchmark/docs/browser-verification.md) を参照してください。


- 終了方法
```markdown
docker-compose -f docker-compose-dev.yml down
```
Playwright コンテナも同時に落とす場合は以下です。
```markdown
docker compose -f docker-compose-dev.yml -f docker-compose.playwright.yml down
```



# 本番環境
- 起動方法
```markdown
docker-compose up -d --build
```
上記コマンド実行後、ブラウザからlocalhostにアクセスするとreactの起動画面が表示されます。

- 終了方法
```markdown
docker-compose down
```
