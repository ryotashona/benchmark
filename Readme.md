# branch
- `dev`

# 開発環境
## 起動方法
```markdown
docker-compose -f docker-compose-dev.yml up -d --build
```
上記コマンド実行後、ブラウザからlocalhostにアクセスするとreactの起動画面が表示されます。

起動直後に **502 Bad Gateway** が発生した際は、node_moduleインストール中です。
しばらくたってから再度アクセスしてください。
front/react/react-app へ node.js がインストール中だと思います。

## 終了方法
```markdown
docker-compose -f docker-compose-dev.yml down
```

# 本番環境
```markdown
docker-compose up -d --build
```
上記コマンド実行後、ブラウザからlocalhostにアクセスするとreactの起動画面が表示されます。

## 終了方法
```markdown
docker-compose down
```
