package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
)

func do_bench(kind string) string {
	sh_path := ""
	switch kind {
	case "pi":
		sh_path = "/opt/leibniz_formula/leibniz_formula.sh"
		break
	case "fib":
		sh_path = "/opt/fibonacci/fibonacci.sh"
		break
	case "io":
		sh_path = "/opt/io/io.sh"
		break
	default:
		_ = sh_path
		return "未対応機能"
	}
	exec.Command("sh", sh_path).Output()
	content, err := ioutil.ReadFile("/var/tmp/times.txt")
	if err != nil {
		fmt.Println(err)
		return "未対応機能"
	}
	return string(content)
}

func api(w http.ResponseWriter, r *http.Request) {
	// クエリパラメータを解析
	query := r.URL.Query()

	// クエリパラメータをマップに格納
	queryData := make(map[string]string)
	res := "未対応機能"
	for key, values := range query {
		if key == "kind" {
			res = do_bench(values[0])
		}
		_ = key
	}
	queryData["res"] = res

	// マップをJSONにエンコード
	jsonData, err := json.Marshal(queryData)
	if err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}

	// JSONレスポンスを設定
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func main() {
	http.HandleFunc("/golang/", api)

	fmt.Println("Starting server on :9002")
	if err := http.ListenAndServe(":9002", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
