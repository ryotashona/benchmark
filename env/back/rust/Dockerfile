FROM rust:1.68

RUN apt-get update\
 && apt-get install -y time\
 && rustup component add rustfmt\
 && rustup component add clippy
