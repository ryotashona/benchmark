package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/csv"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"math/rand"
	"os"
	"reflect"
	"strconv"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	for i := 0; i < 5; i++ {
		err := my_io()
		if err {
			return
		}
	}
	println("OK!!")
	return
}

func my_io() bool {
	csv_in_path := "/opt/test_in.csv"
	table_name := getTanbleName()
	db_hdl := getDbHdl()
	createTable(db_hdl, table_name)

	// csv_in -> DB
	file_in, err := os.Open(csv_in_path)
	if err != nil {
		log.Fatal(err)
	}
	reader := csv.NewReader(file_in)
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		insertData(table_name, record, db_hdl)
	}
	file_in.Close()

	// DB-> csv_out
	csv_out_path := "/var/tmp/" + table_name + ".csv"
	file_out, err := os.Create(csv_out_path)
	if err != nil {
		log.Fatal(err)
	}
	writer := csv.NewWriter(file_out)

	selectQuery := "SELECT data_1,data_2,data_3,data_4,data_5,data_hash FROM " + table_name
	rows, err := db_hdl.Query(selectQuery)
	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		hash_ng := outputCsv(rows, writer)
		if hash_ng {
			return true
		}
	}
	rows.Close()
	file_out.Close()

	// in_csv vs out_csv
	file_in, _ = os.Open(csv_in_path)
	reader_in := csv.NewReader(file_in)

	file_out, _ = os.Open(csv_out_path)
	reader_out := csv.NewReader(file_out)
	for {
		record_in, err := reader_in.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		isEmpty := true
		for _, field := range record_in {
			if strings.TrimSpace(field) != "" {
				isEmpty = false
				break
			}
		}

		if isEmpty {
			continue
		}
		record_out, _ := reader_out.Read()
		if !reflect.DeepEqual(record_in, record_out) {
			println("NG!!!")
			return true
		}
	}
	os.Remove(csv_out_path)
	db_hdl.Exec("DROP TABLE " + table_name)
	return false
}

func outputCsv(rows *sql.Rows, writer *csv.Writer) bool {
	var data_1 int
	var data_2 int
	var data_3 int
	var data_4 int
	var data_5 int
	var data_hash string

	err := rows.Scan(&data_1, &data_2, &data_3, &data_4, &data_5, &data_hash)
	if err != nil {
		log.Fatal(err)
	}
	csv_row := []string{
		strconv.Itoa(data_1),
		strconv.Itoa(data_2),
		strconv.Itoa(data_3),
		strconv.Itoa(data_4),
		strconv.Itoa(data_5),
	}
	hash := getDataHash(csv_row)
	if data_hash != hash {
		println("NG!!!")
		return true
	}
	writer.Write(csv_row)
	writer.Flush()
	return false
}

func insertData(table_name string, record []string, db_hdl *sql.DB) {
	isEmpty := true
	for _, field := range record {
		if strings.TrimSpace(field) != "" {
			isEmpty = false
			break
		}
	}

	if !isEmpty {
		insertQuery := "INSERT INTO " + table_name + " (data_1, data_2, data_3, data_4, data_5, data_hash) VALUES (?, ?, ?, ?, ?, ?)"
		data_hash := getDataHash(record)
		_, err := db_hdl.Exec(insertQuery, record[0], record[1], record[2], record[3], record[4], data_hash)
		if err != nil {
			log.Fatal(err)
		}
	}
}

func getTanbleName() string {
	rand := rand.Intn(999999-100000) + 100000
	return "test_go_" + strconv.Itoa(rand)
}

func getDbHdl() *sql.DB {
	db, err := sql.Open("mysql", "bench:bench@tcp(db:3306)/bench")
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func createTable(db_hdl *sql.DB, table_name string) {
	createTable := fmt.Sprintf(`
	CREATE TABLE %s
	(
		id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
		data_1 INT,
		data_2 INT,
		data_3 INT,
		data_4 INT,
		data_5 INT,
		data_hash VARCHAR(100)
	);
	`, table_name)
	_, err := db_hdl.Exec(createTable)
	if err != nil {
		log.Fatal(err)
	}
}

func getDataHash(record []string) string {
	key := []byte("bench")
	message := []byte(strings.Join(record, ","))

	mac := hmac.New(sha256.New, key)
	mac.Write(message)
	hash := mac.Sum(nil)
	return hex.EncodeToString(hash)
}
