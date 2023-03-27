<?php
function fibonacci(int $n) : int
{
    if ($n < 2) {
        return 1;
    } else {
        return fibonacci($n - 2) + fibonacci($n - 1);
    }
}
$fib = fibonacci(40);
echo 'fib='.$fib."\n";
