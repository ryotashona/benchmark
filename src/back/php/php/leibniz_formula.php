<?php

function leibniz_formula() {
    $s =0;
    for ($i=0; $i < pow(10,8); $i++) { 
        $s += pow(-1,$i)/(($i*2)+1);
    }
    return $s * 4;
}

$pi = leibniz_formula();
echo 'pi='.$pi."\n";
