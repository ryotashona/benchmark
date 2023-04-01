#!/bin/bash

out_file="/var/tmp/times.txt"

cd /opt/leibniz_formula
go build -o ./bin/ leibniz_formula.go

fmt="\nreal:%e[sec]\nuser:%U[sec]\nsys:%S[sec]\nMemory:%M[KB]"
rslt=$(\time -o ${out_file} -f ${fmt} /opt/leibniz_formula/bin/leibniz_formula)

sed -i '/^$/d' ${out_file}

echo $rslt >> ${out_file}
