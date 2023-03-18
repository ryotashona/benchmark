#!/bin/sh
SERVER_DIR="/opt/rust_server"

cd $SERVER_DIR
cargo build -r

./target/release/rust_server

