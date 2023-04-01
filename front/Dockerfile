# ビルドステージ
FROM node:19.7.0-alpine AS build
# ソースコピー
WORKDIR /usr/src/app
COPY ./react/src/ .
# ビルド
WORKDIR /usr/src/app/react-app
RUN npm install
RUN npm run build


# 開発ステージ
FROM nginx:1.23.3 AS development


# デプロイステージ
FROM nginx:1.23.3 AS production
# ビルドステージからの成果物をコピー
COPY --from=build /usr/src/app/react-app/build /usr/share/nginx/html
# Nginxの設定ファイルをコピー
COPY ./nginx_conf/prod/nginx.prod.conf /etc/nginx/conf.d/default.conf
# 80番ポートでサーバーを起動
EXPOSE 80
# サーバー実行
CMD ["nginx", "-g", "daemon off;"]
