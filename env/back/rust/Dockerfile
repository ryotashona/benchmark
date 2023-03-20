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
# COPY ./startup.sh /
# ENTRYPOINT [ "/bin/sh", "/startup.sh" ]

# oci環境用: 負荷軽減のため、事前ビルドしたファイルを利用する.
RUN mkdir -p /opt/leibniz_formula/target/release/
COPY ./leibniz_formula /opt/leibniz_formula/target/release/
COPY ./leibniz_formula.sh /opt/leibniz_formula/

RUN mkdir -p /opt/fibonacci/target/release/
COPY ./fibonacci /opt/fibonacci/target/release/
COPY ./fibonacci.sh /opt/fibonacci/

RUN mkdir -p /opt/rust_server/target/release/
COPY ./rust_server /opt/rust_server/target/release/
ENTRYPOINT [ "/opt/rust_server/target/release/rust_server" ]
