<?php

function io() {
    for ($loop=0; $loop < 5; $loop++) {
        $table_name = getTableName();

        $dbh = getDbh();
        createTable($dbh, $table_name);

        // in_csv -> DB
        $fp_in = fopen('/opt/php/test_in.csv', 'r');
        // $dbh->beginTransaction();    // あえてトランザクションは利用しない.
        while($line = fgetcsv($fp_in)){
            insertData($dbh, $table_name, $line);
        }
        fclose($fp_in);
        // $dbh->commit();

        // DB-> out_csv
        $fp_out = fopen("/var/tmp/{$table_name}.csv", 'w');
        $sth = $dbh->query("select * from {$table_name};");
        while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            outputCsv($fp_out, $row);
        }
        fclose($fp_out);

        // in_csv vs out_csv
        $fp_in = fopen('/opt/php/test_in.csv', 'r');
        $fp_out = fopen("/var/tmp/{$table_name}.csv", 'r');
        while($line_in = fgetcsv($fp_in)) {
            $line_out = fgetcsv($fp_out);
            for ($i=0; $i < 5; $i++) { 
                if ($line_in[$i] != $line_out[$i]) {
                    echo 'in/out チェックエラー: '."\n";
                    exit;
                }
            }
        }

        unlink("/var/tmp/{$table_name}.csv");
        dropTable($dbh, $table_name);

        $dbh = null;
    }
    return 'OK!!';
}

function outputCsv($fp_out, array $row) {
    $line = [$row['data_1'],$row['data_2'],$row['data_3'],$row['data_4'],$row['data_5']];
    $data_hash = getDataHash($line);
    if ($data_hash != $row['data_hash']) {
        echo 'hash チェックエラー: '."\n";
        exit;
    }
    fputcsv($fp_out, $line);
}

function getDbh():PDO {
    try{
        //インスタンスの生成
        return new PDO(
            "mysql:host=db;dbname=bench;",
            "bench",
            "bench"
        );
    }catch (PDOException $e) {
        echo 'データベース接続失敗: '."\n";
        exit('データベース接続失敗: ' . $e->getMessage());
    }    
}



function getDataHash(array $line) {
    return hash_hmac('sha256', implode(',', $line), 'bench');
}

function insertData(PDO &$dbh, string $table_name, array $line) {
    $sql = "INSERT INTO {$table_name} (data_1, data_2, data_3, data_4, data_5, data_hash) VALUES(:d_0, :d_1, :d_2, :d_3, :d_4, :d_h);";
    $sth = $dbh->prepare($sql);
    for ($i=0; $i < 5; $i++) {
        $sth->bindValue(":d_{$i}", $line[$i], PDO::PARAM_INT);
    }
    $sth->bindValue(":d_h", getDataHash($line));
    $sth->execute();
}

function createTable(PDO &$dbh, string $table_name){
    $sql = <<< SQL
CREATE TABLE {$table_name}
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    data_1 INT,
    data_2 INT,
    data_3 INT,
    data_4 INT,
    data_5 INT,
    data_hash VARCHAR(100)
);
SQL;
    $dbh->query($sql);
}

function dropTable(PDO &$dbh, string $table_name){
    $sql = "drop table {$table_name}";
    $dbh->query($sql);
}


function getTableName():string {
    return "test_".rand(100000, 999999);
}

$res = io();
echo 'io='.$res."\n";
