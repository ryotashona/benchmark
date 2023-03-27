use csv::{ReaderBuilder, Writer};
use futures::TryStreamExt;
use rand::prelude::*;
use sha2::{Digest, Sha256};
use sqlx::{mysql::MySqlPoolOptions, MySql, Pool, Row};
use std::fs::remove_file;

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    io().await?;
    println!("OK!!");

    Ok(())
}

async fn io() -> Result<(), sqlx::Error> {
    for _cnt in 0..5 {
        let table_name = get_table_name();
        let db_pool = get_db_pool().await?;
        create_table(&table_name, &db_pool).await?;

        // let now = time::Instant::now();
        // in_csv -> DB
        let mut rdr = ReaderBuilder::new()
            .has_headers(false)
            .from_path("/opt/test_in.csv")
            .expect("IN CSV OPEN ERROR");
        for result in rdr.records() {
            let record = result.expect("IN CSV READ ERROR");
            insert_data(record, &table_name, &db_pool).await?;
        }
        // println!("IN__{:?}", now.elapsed());

        // let now = time::Instant::now();
        // DB -> out_csv
        let out_csv = format!("/var/tmp/{}.csv", table_name);
        let mut wtr = Writer::from_path(&out_csv).expect("ERROR");
        let sql = format!("SELECT * FROM {}", table_name);
        let mut rows = sqlx::query(&sql).fetch(&db_pool);
        while let Some(row) = rows.try_next().await? {
            output_csv(row, &mut wtr)?;
        }
        // println!("OUT__{:?}", now.elapsed());

        // in_csv vs out_csv
        let mut rdr = ReaderBuilder::new()
            .has_headers(false)
            .from_path("/opt/test_in.csv")
            .expect("IN CSV OPEN ERROR");
        let mut wdr = ReaderBuilder::new()
            .has_headers(false)
            .from_path(&out_csv)
            .expect("IN CSV OPEN ERROR");
        for result in rdr.records() {
            let in_record = result.expect("IN CSV READ ERROR");
            let out_record = wdr.records().next().expect("msg").unwrap();

            let in_str = in_record.iter().collect::<Vec<&str>>().join(",");
            let out_str = out_record.iter().collect::<Vec<&str>>().join(",");

            if in_str != out_str {
                println!(" !!!!aaa in_csv vs out_csv NG!!!!");
            }
        }
        remove_file(&out_csv).expect("msg");

        drop_table(table_name, db_pool).await?;
    }

    Ok(())
}

fn output_csv(
    row: sqlx::mysql::MySqlRow,
    wtr: &mut Writer<std::fs::File>,
) -> Result<(), sqlx::Error> {
    let d_1: i32 = row.try_get("data_1")?;
    let d_2: i32 = row.try_get("data_2")?;
    let d_3: i32 = row.try_get("data_3")?;
    let d_4: i32 = row.try_get("data_4")?;
    let d_5: i32 = row.try_get("data_5")?;
    let d_h: &str = row.try_get("data_hash")?;
    let data_hash = sha256(&format!("{},{},{},{},{}", d_1, d_2, d_3, d_4, d_5));
    if d_h != data_hash {
        println!(" !!!!NG!!!!");
        return Ok(());
    }
    wtr.write_record(&[
        d_1.to_string(),
        d_2.to_string(),
        d_3.to_string(),
        d_4.to_string(),
        d_5.to_string(),
    ])
    .expect("ERROR");
    wtr.flush()?;
    Ok(())
}

async fn insert_data(
    record: csv::StringRecord,
    table_name: &String,
    db_pool: &Pool<MySql>,
) -> Result<(), sqlx::Error> {
    let data_hash = sha256(&record.iter().collect::<Vec<&str>>().join(","));
    let sql = format!("INSERT INTO {} (data_1, data_2, data_3, data_4, data_5, data_hash) VALUES (?, ?, ?, ?, ?, ?)", table_name);
    sqlx::query(&sql)
        .bind(record.get(0))
        .bind(record.get(1))
        .bind(record.get(2))
        .bind(record.get(3))
        .bind(record.get(4))
        .bind(data_hash)
        .execute(db_pool)
        .await?;
    Ok(())
}

fn sha256(data: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data.as_bytes());
    let result = hasher.finalize();
    format!("{:x}", result)
}

async fn create_table(table_name: &String, db_pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
    let sql = format!(
        "
    CREATE TABLE {}
    (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        data_1 INT,
        data_2 INT,
        data_3 INT,
        data_4 INT,
        data_5 INT,
        data_hash VARCHAR(100)
    );    
    ",
        table_name
    );
    sqlx::query(&sql).execute(db_pool).await?;
    Ok(())
}

async fn drop_table(table_name: String, db_pool: Pool<MySql>) -> Result<(), sqlx::Error> {
    let sql = format!("DROP TABLE {}", table_name);
    sqlx::query(&sql).execute(&db_pool).await?;
    Ok(())
}

fn get_table_name() -> String {
    let mut rng = thread_rng();
    let rand = rng.gen_range(100000..999999);
    format!("test_rust_{}", rand)
}

async fn get_db_pool() -> Result<Pool<MySql>, sqlx::Error> {
    let pool = MySqlPoolOptions::new()
        .max_connections(100)
        .connect("mysql://bench:bench@db/bench")
        .await?;
    Ok(pool)
}
