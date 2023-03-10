#!/bin/bash

fmt="\nreal:%e[sec]\nuser:%U[sec]\nsys:%S[sec]\nMemory:%M[KB]"
\time -o /var/tmp/times.txt -f ${fmt} php /opt/leibniz_formula.php

cat /var/tmp/times.txt
