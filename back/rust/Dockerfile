# ベースイメージを指定
FROM rust:1.68 AS base
WORKDIR /opt

# 開発用ステージ
# multi-stage buildのため、下記ワーニング問題なし
# [Base images should specify a tag to use.]
FROM base AS development
RUN apt-get update\
 && apt-get install -y --no-install-recommends time\
 && rm -rf /var/lib/apt/lists/*\
 && rustup component add rustfmt\
 && rustup component add clippy
# サーバーアプリケーションをビルド&実行する
COPY ./startup.sh /
CMD [ "/bin/sh", "/startup.sh" ]

# ビルドステージ
# multi-stage buildのため、下記ワーニング問題なし
# [Base images should specify a tag to use.]
FROM base AS build
WORKDIR /opt
# ビルドキャッシュ作成
RUN cargo new tmp
WORKDIR /opt/tmp
RUN cargo build -r
RUN rm -rf /opt/tmp
# ソースコピー
WORKDIR /opt
COPY ./src/ .
# 各PJビルド
WORKDIR /opt/leibniz_formula
RUN cargo build -r
WORKDIR /opt/fibonacci
RUN cargo build -r
WORKDIR /opt/io
RUN cargo build -r
WORKDIR /opt/rust_server
RUN cargo build -r

# デプロイステージ
FROM debian:bullseye-slim AS deployment
RUN apt-get update\
 && apt-get install -y --no-install-recommends time\
 && rm -rf /var/lib/apt/lists/*
# 各PJ実行ファイルをコピー
RUN mkdir -p /opt/leibniz_formula/target/release
COPY ./src/leibniz_formula/leibniz_formula.sh /opt/leibniz_formula/
COPY --from=build /opt/leibniz_formula/target/release/leibniz_formula /opt/leibniz_formula/target/release/

RUN mkdir -p /opt/fibonacci/target/release
COPY ./src/fibonacci/fibonacci.sh /opt/fibonacci/
COPY --from=build /opt/fibonacci/target/release/fibonacci /opt/fibonacci/target/release/

RUN mkdir -p /opt/io/target/release
COPY ./src/io/io.sh /opt/io/
COPY --from=build /opt/io/target/release/io /opt/io/target/release/
COPY ./src/test_in.csv /opt/

RUN mkdir -p /opt/rust_server/target/release
COPY --from=build /opt/rust_server/target/release/rust_server /opt/rust_server/target/release/
# ポート指定
EXPOSE 9001
# サーバー実行
ENTRYPOINT [ "/opt/rust_server/target/release/rust_server" ]
