#!/bin/bash

out_file="/var/tmp/times.txt"

fmt="\nreal:%e[sec]\nuser:%U[sec]\nsys:%S[sec]\nMemory:%M[KB]"
\time -o ${out_file} -f ${fmt} php /opt/php/leibniz_formula.php

sed -i '/^$/d' ${out_file}

cat ${out_file}
