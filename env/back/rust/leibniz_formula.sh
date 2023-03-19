#!/bin/bash

out_file="/var/tmp/times.txt"

if [ -f ${out_file} ]; then
    rm ${out_file}
fi

cd /opt/leibniz_formula
cargo build -r

fmt="\nreal:%e[sec]\nuser:%U[sec]\nsys:%S[sec]\nMemory:%M[KB]"
\time -o ${out_file} -f ${fmt} /opt/leibniz_formula/target/release/leibniz_formula

sed -i '/^$/d' ${out_file}

# cat ${out_file}

