FROM rust:1.68

RUN apt-get update\
 && apt-get install -y time\
 && rustup component add rustfmt\
 && rustup component add clippy

# !!上位ディレクトリは見れない!!
# WORKDIR /opt
# COPY ../../../src/back/rust/ .

WORKDIR /opt
# アプリケーションをビルド&実行する
COPY ./startup.sh /
ENTRYPOINT [ "/bin/sh", "/startup.sh" ]
