#!/bin/bash

out_file="/var/tmp/times.txt"

cd /opt/io
go mod download
go build -o ./bin/ io.go

fmt="\nreal:%e[sec]\nuser:%U[sec]\nsys:%S[sec]\nMemory:%M[KB]"
rslt=$(\time -o ${out_file} -f ${fmt} /opt/io/bin/io)

sed -i '/^$/d' ${out_file}

echo $rslt >> ${out_file}
