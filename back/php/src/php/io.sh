#!/bin/bash

out_file="/var/tmp/times.txt"

fmt="\nreal:%e[sec]\nuser:%U[sec]\nsys:%S[sec]\nMemory:%M[KB]"
rslt=$(\time -o ${out_file} -f ${fmt} php /opt/php/io.php)

sed -i '/^$/d' ${out_file}

echo $rslt >> ${out_file}
