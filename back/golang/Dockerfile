# ベースイメージを指定
FROM golang:1.20.2-bullseye AS base


# 開発用ステージ
# multi-stage buildのため、下記ワーニング問題なし
# [Base images should specify a tag to use.]
FROM base AS development
RUN apt-get update\
 && apt-get install -y --no-install-recommends time\
 && rm -rf /var/lib/apt/lists/*
# サーバーアプリケーションをビルド&実行する
COPY ./startup.sh /
CMD [ "/bin/sh", "/startup.sh" ]


# ビルドステージ
# multi-stage buildのため、下記ワーニング問題なし
# [Base images should specify a tag to use.]
FROM base AS build
# ソースコピー
WORKDIR /opt
COPY ./src/ .
# 各PJビルド
WORKDIR /opt/leibniz_formula
RUN go build -o ./bin/ ./leibniz_formula.go
WORKDIR /opt/fibonacci
RUN go build -o ./bin/ ./fibonacci.go
WORKDIR /opt/io
RUN go mod download
RUN go build -o ./bin/ ./io.go
WORKDIR /opt/golang_server
RUN go build -o ./bin/ ./golang_server.go

# デプロイステージ
# multi-stage buildのため、下記ワーニング問題なし
# [Base images should specify a tag to use.]
FROM base AS deployment
RUN apt-get update\
 && apt-get install -y --no-install-recommends time\
 && rm -rf /var/lib/apt/lists/*
# 各PJ実行ファイルをコピー
RUN mkdir -p /opt/leibniz_formula/bin
COPY ./src/leibniz_formula/leibniz_formula.sh /opt/leibniz_formula/
COPY --from=build /opt/leibniz_formula/bin/leibniz_formula /opt/leibniz_formula/bin/

RUN mkdir -p /opt/fibonacci/bin
COPY ./src/fibonacci/fibonacci.sh /opt/fibonacci/
COPY --from=build /opt/fibonacci/bin/fibonacci /opt/fibonacci/bin/

RUN mkdir -p /opt/io/bin
COPY ./src/io/io.sh /opt/io/
COPY --from=build /opt/io/bin/io /opt/io/bin/
COPY ./src/test_in.csv /opt/

RUN mkdir -p /opt/golang_server/bin
COPY --from=build /opt/golang_server/bin/golang_server /opt/golang_server/bin/
# ポート指定
EXPOSE 9002
# サーバー実行
ENTRYPOINT [ "/opt/golang_server/bin/golang_server" ]
