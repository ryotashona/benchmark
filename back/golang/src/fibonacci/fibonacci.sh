#!/bin/bash

out_file="/var/tmp/times.txt"

cd /opt/fibonacci
go build -o ./bin/ fibonacci.go

fmt="\nreal:%e[sec]\nuser:%U[sec]\nsys:%S[sec]\nMemory:%M[KB]"
rslt=$(\time -o ${out_file} -f ${fmt} /opt/fibonacci/bin/fibonacci)

sed -i '/^$/d' ${out_file}

echo $rslt >> ${out_file}
