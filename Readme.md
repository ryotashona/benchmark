# 起動方法
```markdown
docker-compose up -d --build
```
上記コマンド実行後、ブラウザからlocalhostにアクセスするとreactの起動画面が表示されます。

起動直後に **502 Bad Gateway** が発生した際は、node_moduleインストール中です。
しばらくたってから再度アクセスしてください。
src/front/react/react-app へ node.js がインストール中だと思います。
