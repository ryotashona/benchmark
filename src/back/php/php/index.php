<?php

$kind = $_GET['kind'];

$result_file = '/var/tmp/times.txt';
if(file_exists($result_file)) {
    unlink($result_file);
}

if ($kind == 'pi') {
    exec('sh /opt/php/leibniz_formula.sh');
} else if ($kind == 'io') {
    // todo:
} else {
    // nop.
}

header("Content-Type: application/json; charset=utf-8");
if(file_exists($result_file)) {
    echo json_encode(['res' => file_get_contents($result_file)]);
} else {
    echo json_encode(['res' => '未対応機能']);
}
