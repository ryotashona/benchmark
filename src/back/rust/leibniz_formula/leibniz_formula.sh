#!/bin/bash

cd /opt/leibniz_formula
cargo build -r

fmt="\nreal:%e[sec]\nuser:%U[sec]\nsys:%S[sec]\nMemory:%M[KB]"
\time -o /var/tmp/times.txt -f ${fmt} /opt/leibniz_formula/target/release/leibniz_formula

cat /var/tmp/times.txt
