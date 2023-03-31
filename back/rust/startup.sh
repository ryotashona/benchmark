#!/bin/sh

# ビルドキャッシュ生成
cd /opt/
cargo new pre_build
cd /opt/pre_build
cargo build
cargo build -r
rm -rf /opt/pre_build

# サーバービルド
SERVER_DIR="/opt/rust_server"
cd $SERVER_DIR
cargo build -r

./target/release/rust_server

