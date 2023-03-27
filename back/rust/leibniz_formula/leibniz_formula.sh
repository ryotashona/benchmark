#!/bin/bash

out_file="/var/tmp/times.txt"

cd /opt/leibniz_formula
cargo build -r

fmt="\nreal:%e[sec]\nuser:%U[sec]\nsys:%S[sec]\nMemory:%M[KB]"
rslt=$(\time -o ${out_file} -f ${fmt} /opt/leibniz_formula/target/release/leibniz_formula)

sed -i '/^$/d' ${out_file}

echo $rslt >> ${out_file}

